/*
Client side version -> 
    Policies can have either rules or policies as their children; hence removing the notion of 'policyset' as they make it unnecessarily complicated
    Rather than automatically creating all their children in the constructor have
*/
import Rule from './Rule'
import Evaluable from './Evaluable'
import CombiningAlgorithm from './CombiningAlgorithm'
import Response from './Response'

class Policy {
    constructor(parent) {
        if (parent == null) {
            this.isRoot = true
        }
        this.parent = parent
        this.idCounter = 0
        this.finalDecision = undefined
        this.isActive = false
        this.isTargetMet = false
        this.isIndeterminate = false
    }

    // Initialise a new empty Policy with default values
    init(id) {
        this.id = id
        this.name = "No Name"
        this.description = "No Description"
        this.target = new Evaluable()
        this.obligations = []
        this.algorithm = new CombiningAlgorithm(this.id, this.description, 'firstApplicable')
        this.children = []
        this.depth_level = null
    }

    _obj_constructor(rawObj) {
        console.log("Constructing new AC Policy object")
        if(!("id" in rawObj)) throw new Error("id not defined in policy object.");
        if(!("target" in rawObj)) throw new Error("target not defined in policy object.");
        if(!("obligations" in rawObj)) throw new Error("obligations not defined in policy object.");
        if(!("children" in rawObj)) throw new Error("children not defined in policy object.");
        if(!("algorithm" in rawObj)) throw new Error("policy combining algorithm not defined in policy object.");
        if("name" in rawObj) {
            this.name = rawObj.name
        } else {
            this.name = "No Name"
        }
        if("description" in rawObj) {
            this.description = rawObj.description
        } else {
            this.description = "No Description"
        }

        this.id = rawObj.id;
        this.target = new Evaluable();
        this.target._obj_constructor(rawObj.target)
        this.obligations = rawObj.obligations;
        this.children = rawObj.children.map((child)=>{
            if ("condition" in child) {
                // Child is a rule
                let newRule = new Rule(this) // COnstruct rule object setting this policy to be its parent
                newRule._obj_constructor(child)
                // let split = newId.split('_')
                // let idsuffix = parseInt(split[split.length-1])
                // if ((idsuffix) >= this.idCounter) this.counter = idsuffix+1
                return newRule
            } else {
                // Child is another policy
                let newPolicy = new Policy(this)
                newPolicy._obj_constructor(child)
                // let split = newId.split('_')
                // let idsuffix = parseInt(split[split.length-1])
                // if ((idsuffix) > this.idCounter) this.counter = idsuffix+1
                return newPolicy
            }
        });
        this.algorithm = new CombiningAlgorithm(this.id, this.description, rawObj.algorithm);

        this.depth_level = null

        this.idCounter = this.children.length

        return this.id
    }

    // Calculate depth of each component in policy and build up an accumulated depths for each ID object
    calculateDepthLevel(d, acc) {
        this.depth_level = d
        let n = d
        let nAcc = acc
        for (var i=0; i<this.children.length; i++) {
            [n, nAcc] = this.children[i].calculateDepthLevel(n+1, nAcc)
        }
        acc[this.id] = this.depth_level
        return [n, nAcc]
    }

    isApplicable(request) {
        // Test if the target is satisfied by the current request to determine if should be further evaluated
        this.isIndeterminate = false
        try {
            let res = this.target.evaluate(request);
            this.isTargetMet = res
            return res
        } catch(err) {
            console.log("Policy component caught error evaluating target so is Indeterminate!")
            this.isIndeterminate = true
            return false
        }
    }

    evaluate(request) {
        this.isActive = true
        if (this.isIndeterminate) {
            let res = new Response(this.id, this.description)
            res.setDecision("Indeterminate")
            this.finalDecision = res
            return this.finalDecision
        }
        let results = [];
        this.children.forEach(child => {
            if (child.isApplicable(request)) {
                results.push(child.evaluate(request));
            } else {
                var indeterminate = child.isIndeterminate
                child.deactivate()
                child.isIndeterminate = indeterminate
            }
        });
        this.finalDecision = this.algorithm.combine(results)
        console.log(this.id + " final decision is " + this.finalDecision.id)
        return this.finalDecision
    }

    deactivate() {
        this.isActive = false
        this.targetMet = false
        this.finalDecision = undefined
        this.isIndeterminate = false
        this.children.forEach(child => {
            child.deactivate()
        })
    }

    setName(name) {
        this.name = name
    }

    setDescription(desc) {
        this.description = desc
    }

    setAlgorithm(algo) {
        this.algorithm.setType(algo)
    }

    // Instruct the parent policy to move this policy up in its children
    moveUpInParent() {
        if (this.parent != null) {
            this.parent.moveChildUp(this.id)
        }
    }

    moveDownInParent() {
        if (this.parent != null) {
            this.parent.moveChildDown(this.id)
        }
    }

    deleteInParent() {
        if (this.parent != null) {
            this.parent.deleteChild(this.id)
        }
    }

    // Move a child policy up
    moveChildUp(id) {
        let array = this.children
        let index = array.findIndex(n => n.id == id)
        if (index == 0) {
            // Do nothing it can't be moved up
            return
        }
        // Remove the element from array
        let newArray = array.slice(0, index).concat(array.slice(index+1))
        newArray.splice(index-1, 0, array[index])
        this.children = newArray
    }

    moveChildDown(id) {
        let array = this.children
        let index = array.findIndex(n => n.id == id)
        if (index == array.length-1) {
            // This is the last element so cant be moved
            return
        }
        let newArray = array.slice(0, index).concat(array.slice(index+1))
        newArray.splice(index+1, 0, array[index])
        this.children = newArray
    }

    deleteChild(id) {
        let array = this.children
        let index = array.findIndex(n => n.id == id)
        let newArray = this.children.slice(0)
        newArray.splice(index, 1)
        this.children = newArray
    }

    newChildPolicy() {
        let newPolicy = new Policy(this)
        newPolicy.init(this.id + '_' + this.idCounter)
        this.idCounter++
        this.children.push(newPolicy)
    }

    newChildRule() {
        let newRule = new Rule(this)
        newRule.init(this.id + '_' + this.idCounter)
        this.idCounter++
        this.children.push(newRule)
    }

    // Returns a plain old data object for use by React
    getObject() {
        return {
            id : this.id,
            name: this.name,
            description: this.description,
            obligations: this.obligations,
            target: this.target,
            algorithm: this.algorithm,
            depth_level: this.depth_level,
            children: this.children,
            isActive: this.isActive,
            isIndeterminate: this.isIndeterminate,
            isTargetMet: this.isTargetMet,
            finalDecision: this.finalDecision
        }
    }

    toJson() {
        let target = this.target.toJson()
        let children = this.children.map((child) => {
            return child.toJson()
        })

        return {
            id: this.id,
            name: this.name,
            description: this.description,
            obligations: this.obligations,
            target: target,
            algorithm: this.algorithm.getType(),
            children: children
        }
        
    }
}

export default Policy