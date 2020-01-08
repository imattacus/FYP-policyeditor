// const Target = require('./Target');
// const Condition = require('./Condition');
import Response from './Response'
import Evaluable from './Evaluable'

class Rule {
    constructor(parent) {
        if (parent == null) {
            throw new Error("Rule has no parent - but cannot be the root of the policy")
        }
        this.parent = parent
        this.isTargetMet = false
        this.isConditionMet = false
        this.isIndeterminate = false
        this.finalDecision = undefined
    }

    init(id) {
        this.id = id
        this.name = "No Name"
        this.description = "No Description"
        this.target = new Evaluable()
        this.condition = new Evaluable()
        this.obligations = []
        this.effect = "Deny"
        this.depth_level = null
    }

    _obj_constructor(rawObj) {

        if(!("id" in rawObj)) throw new Error("id not defined in rule object.");
        if(!("target" in rawObj)) throw new Error("target not defined in rule object.");
        if(!("obligations" in rawObj)) throw new Error("obligations not defined in rule object.");
        if(!("condition" in rawObj)) throw new Error("condition not defined in rule object.");
        if(!("effect" in rawObj)) throw new Error("effect not defined in rule object.");
        if ("name" in rawObj) {
            this.name = rawObj.name
        } else {
            this.name = "No Name"
        }
        
        if(("description" in rawObj)) {
            this.description = rawObj.description
        } else {
            this.description = "No Description"
        }

        this.id = rawObj.id;
        this.target = new Evaluable();
        this.target._obj_constructor(rawObj.target)
        this.condition = new Evaluable();
        this.condition._obj_constructor(rawObj.condition)
        this.effect = rawObj.effect;
        this.obligations = rawObj.obligations;

        this.depth = 0
        this.depth_level = null;

        return this.id
    }

    calculateDepthLevel(d, acc) {
        this.depth_level = d
        console.log("Rule " + this.id + " depth_level: " + this.depth_level)
        acc[this.id] = this.depth_level
        return [d, acc]
    }

    isApplicable(request) {
        // Evaluate the target of this rule to decide if it is applicable to this request
        try {
            this.isTargetMet = this.target.evaluate(request)
            return this.isTargetMet
        } catch (err) {
            console.log("Rule target is indeterminate")
            this.isIndeterminate = true
            return false
        }
    }

    conditionMet(request) {
        try {
            this.isConditionMet = this.condition.evaluate(request)
            return this.isConditionMet
        } catch (err) {
            this.isIndeterminate = true
            return false
        }
    }

    evaluate(request) {
        // Evaluate the condition of this rule to determine what decision should be made (CAUTION does not test target, just condition)
        let response = new Response(this.id, this.description);
        if (this.conditionMet(request)) {
            response.setDecision(this.effect);
            response.setObligations(this.obligations);
        }
        if (this.isIndeterminate) {
            response.setDecision("Indeterminate")
            this.finalDecision = response
            return this.finalDecision
        }
        this.finalDecision = response
        return this.finalDecision
    }

    setName(name) {
        this.name = name
    }

    setDescription(desc) { 
        this.description = desc
    }

    setEffect(effect) {
        this.effect = effect
    }

    deactivate() {
        // Inform this rule it is no longer active in the viewer
        this.isTargetMet = false
        this.isConditionMet = false
        this.isIndeterminate = false
        this.finalDecision = undefined
    }

    moveUpInParent() {
        this.parent.moveChildUp(this.id)
    }

    moveDownInParent() {
        this.parent.moveChildDown(this.id)
    }

    deleteInParent() {
        this.parent.deleteChild(this.id)
    }

    getObject() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            obligations: this.obligations,
            target: this.target,
            condition: this.condition,
            effect: this.effect,
            depth_level: this.depth_level,
            isTargetMet: this.isTargetMet,
            isConditionMet: this.isConditionMet,
            isIndeterminate: this.isIndeterminate,
            finalDecision: this.finalDecision
        }
    }

    toJson() {
        let target = this.target.toJson()
        let condition = this.condition.toJson()
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            obligations: this.obligations,
            target: target,
            condition: condition,
            effect: this.effect
        }
    }
}

export default Rule