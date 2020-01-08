import Combinator from './Combinator'
import Comparator from './Comparator'

class Evaluable {

    // Construct an empty evaluable object
    constructor() {
        this.op = 'empty'
        this.result = null
        this.error = false
        this.errordetail = ''
    }

    resetToEmpty() {
        for(let key in Object.keys(this)) {
            delete this[key]
        }
        this.op ='empty'
        this.result = null
        this.error = false
        this.errordetail = ''
    }

    // functions to init each type of evaluable object
    initSubjectHasAttribute() {
        this.op = "subjectHasAttribute"
        this.attr = null
    }

    initResourceHasAttribute() {
        this.op = "resourceHasAttribute"
        this.attr = null
    }

    initSubjectAttribute() {
        this.op = "subjectAttribute"
        this.attr = null
    }

    initResourceAttribute() {
        this.op = "resourceAttribute"
        this.attr = null
    }

    initEnvironmentAttribute() {
        this.op = "environmentAttribute"
        this.attr = null
    }

    initCombinator(op) {
        this.op = "combinator"
        this.combinator = new Combinator(op, [new Evaluable()])
    }

    initComparator(op) {
        this.op = "comparator"
        this.comparator = new Comparator(op, new Evaluable(), new Evaluable())
    }

    initValue() {
        this.op ="value"
        this.value = null
        this.data_type = 'string'
    }

    initActionType() {
        this.op = "actionType"
        this.action = null
    }

    // Fill in the details using an existing object (eg from json)
    _obj_constructor(obj) {
        console.log(obj)
        if (Object.keys(obj).length == 0) {
            this.op = 'empty'
            return
        }

        // This is a value literal because it contains the key 'value'
        if ('value' in obj) {
            this.op = 'value';
            this.value = obj.value;
            this.data_type = obj.data_type;
            return;
        }

        // This is a subject attribute lookup because it contains the key 'subjectAttribute'
        if ('subjectAttribute' in obj) {
            this.op = 'subjectAttribute';
            this.attr = obj.subjectAttribute;
            // this.default_value = new Evaluable()
            // this.default_value._obj_constructor(obj.default_value)
            return;
        }

        // This is a resource attribute lookup because it contains the key 'resourceAttribute'
        if ('resourceAttribute' in obj) {
            this.op = 'resourceAttribute';
            this.attr = obj.resourceAttribute;
            return;
        }

        if ('environmentAttribute' in obj) {
            this.op = 'environmentAttribute'
            this.attr = obj.environmentAttribute
            return
        }

        // This is a comparator because it contains the key 'comparator'
        if ('comparator' in obj) {
            this.op = 'comparator';
            let param1 = new Evaluable()
            param1._obj_constructor(obj.param1)
            let param2 = new Evaluable()
            param2._obj_constructor(obj.param2)
            this.comparator = new Comparator(obj.comparator, param1, param2);
            return;
        }

        // This is an allOf combinator because it contains the key 'allOf'
        if ('allOf' in obj) {
            this.op = 'combinator';
            this.combinator = new Combinator('allOf', obj.allOf.map(n => {
                let child = new Evaluable()
                child._obj_constructor(n)
                return child
            }));
            return;
        }
        if ('anyOf' in obj) {
            this.op = 'combinator';
            this.combinator = new Combinator('anyOf', obj.anyOf.map(n => {
                let child = new Evaluable()
                child._obj_constructor(n)
                return child
            }));
            return;
        }

        // This is an attribute presence check on the subject because it contains the key 'subjectHasAttribute'
        if ('subjectHasAttribute' in obj) {
            this.op = 'subjectHasAttribute';
            this.attr = obj.subjectHasAttribute;
            return;
        }
        // This is an attribute check on the resource because it contains the key 'resourceHasAttribute'
        if ('resourceHasAttribute' in obj) {
            this.op = 'resourceHasAttribute';
            this.attr = obj.resourceHasAttribute;
            return;
        }

        if ('actionType' in obj) {
            this.op="actionType"
            this.action = obj.actionType
            return;
        }
    }

    setAction(type) {
        this.action = type
    }

    evaluate(request) {
        let ret
        switch(this.op) {
            case 'empty':
                ret = true
                break
            case 'value':
                ret = this.value;
                break
            case 'subjectAttribute':
                ret = this._getSubjectAttribute(request);
                break
            case 'resourceAttribute':
                ret = this._getResourceAttribute(request);
                break
            case 'environmentAttribute':
                ret = this._getEnvironmentAttribute(request)
                break
            case 'combinator':
                ret = this.combinator.evaluate(request);
                break
            case 'comparator':
                ret = this.comparator.evaluate(request);
                break
            case 'subjectHasAttribute':
                ret = this._subjectHasAttribute(request);
                break
            case 'resourceHasAttribute':
                ret = this._resourceHasAttribute(request);
                break
            case 'actionType':
                ret = this._actionType(request);
                break
            default:
                throw new Error("Could not evaluate invalid evaluable.");
        }
        this.result = ret
        return this.result
    }

    throwError(string) {
        this.error = true
        this.errordetail = string
        throw new Error(string)
    }

    validate() {
        this.error = false
        this.errordetail = null
        let data_type
        switch(this.op) {
            case 'empty':
                data_type = 'boolean'
                break
            case 'value':
                if (this.value == null) this.throwError('value undefined')
                if (this.data_type == null) this.throwError("No data type specified for value")
                switch(this.data_type) {
                    case 'boolean':
                        if (this.value != 'true' && this.value != 'false') this.throwError("Invalid value for boolean")
                        break
                    case 'string':
                        // Values are stored as strings anyway
                        break
                    case 'integer':
                        if (isNaN(this.value)) this.throwError("Invalid value for integer")
                        break
                    default:
                        this.throwError("invalid datatype for value")
                }
                data_type = this.data_type
                break
            case 'environmentAttribute':
            case 'resourceAttribute':
            case 'subjectAttribute':
                if (this.attr == null) this.throwError("missing attribute in attribute lookup")
                data_type = this.attr.data_type
                break
            case 'subjectHasAttribute':
                if (this.attr == null) this.throwError('missing attribute')
                data_type = 'boolean'
                break
            case 'resourceHasAttribute':
                if (this.attr == null) this.throwError('missing attribute')
                data_type = 'boolean'
                break
            case 'comparator':
                try {
                    data_type = this.comparator.validate()
                    break
                } catch(err) {
                    this.throwError(err.message)
                }
            case 'combinator':
                try {
                    data_type = this.combinator.validate()
                    break
                } catch(err) {
                    this.throwError(err.message)
                }
            case 'actionType':
                if (this.action == null) this.throwError("Action type cannot be null")
                data_type = 'boolean'
                break
            default:
                throw new Error('could not validate invalid evaluable')    
        }
        return data_type
    }

    combinatorAddChild() {
        this.combinator.children.push(new Evaluable())
    }

    setValue(val) {
        this.value = val
    }

    _getSubjectAttribute(request) {
        return request.getSubjectAttribute(this.attr.attribute_id).value;
    }

    _getResourceAttribute(request) {
        return request.getResourceAttribute(this.attr.attribute_id).value;
    }

    _getEnvironmentAttribute(request) {
        return request.getEnvironmentAttribute(this.attr.attribute_id).value
    }

    _subjectHasAttribute(request) {
        try {
            let attr = request.getSubjectAttribute(this.attr.attribute_id)
            if (attr == undefined) {
                return false
            }
            return true
        } catch (err) {
            return false
        }
    }

    _resourceHasAttribute(request) {
        try {
            let attr = request.getResourceAttribute(this.attr.attribute_id)
            if (attr == undefined) {
                return false
            }
            return true
        } catch(err) {
            return false
        }
    }

    _actionType(request) {
        return this.action == request.getActionType()
    }

    // Returns a plain old javascript object for use by react
    getObject() {
        let object = {
            op: this.op,
            result: this.result,
            error: this.error,
            errordetail: this.errordetail
        }
        switch (this.op) {
            case 'empty':
                break
            case 'value':
                object.value = this.value
                object.data_type = this.data_type
                break
            case 'subjectAttribute':
                object.attribute = this.attr
                break
            case 'resourceAttribute':
                object.attribute = this.attr
                break
            case 'environmentAttribute':
                object.attribute = this.attr
                break
            case 'combinator':
                object.combinator = this.combinator.getObject()
                break
            case 'comparator':
                object.comparator = this.comparator.getObject()
                break
            case 'subjectHasAttribute':
                object.attribute = this.attr
                break
            case 'resourceHasAttribute':
                object.attribute = this.attr
                break
            case 'actionType':
                object.action = this.action
                break
            default:
                throw new Error("Could not getObject of invalid evaluable")
        }
        return object
    }

    toJson() {
        switch(this.op) {
            case 'empty':
                return {}
            case 'value':
                return {value: this.value, data_type: this.data_type}
            case 'subjectAttribute':
                return {subjectAttribute: this.attr}
            case 'resourceAttribute':
                return {resourceAttribute: this.attr}
            case 'environmentAttribute':
                return {environmentAttribute: this.attr}
            case 'combinator':
                return this.combinator.toJson()
            case 'comparator':
                return this.comparator.toJson()
            case 'subjectHasAttribute':
                return {subjectHasAttribute: this.attr}
            case 'resourceHasAttribute':
                return {resourceHasAttribute: this.attr}
            case 'actionType':
                return {actionType: this.action}
            default:
                throw new Error("Could not toJson invalid evaluable.");
        }
    }
}

export default Evaluable

