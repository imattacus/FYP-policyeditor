class Combinator {
    constructor(op, evaluableArray) {
        this.op = op;
        this.children = evaluableArray;
    }

    evaluate(request) {
        switch(this.op) {
            case 'anyOf':
                return this._anyOf(request);
            case 'allOf':
                return this._allOf(request);
            default:
                throw new Error('Cannot evaluate invalid combinator.');
        }
    }

    validate() {
        try {
            let data_types = this.children.map(child => {return child.validate()})
            if (data_types.every(dt => dt == 'boolean')) {
                return 'boolean'
            } else {
                throw new Error("Combinators must all be booleans")
            }
        } catch(err) {
            throw err
        }
    }

    _anyOf(request) {
        let resArray = this.children.map(val => {return val.evaluate(request)});
        return resArray.some(v => v == true);
    }

    _allOf(request) {
        let resArray = this.children.map(val => {return val.evaluate(request)});
        return resArray.every(v => v == true);
    }

    getObject() {
        let object = {
            op: this.op,
            children: this.children
        }
        return object
    }

    toJson() {
        let children = this.children.map((child) => child.toJson())
        switch(this.op) {
            case 'anyOf':
                return {anyOf: children}
            case 'allOf':
                return {allOf: children}
            default:
                throw new Error("cannot toJson invalid combinator")
        }
    }
}

export default Combinator
