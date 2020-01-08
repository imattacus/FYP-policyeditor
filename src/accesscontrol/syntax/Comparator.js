// const Evaluable = require('./Evaluable');

class Comparator {
    constructor(op, param1, param2) {
        this.op = op
        this.param1 = param1
        this.param2 = param2
    }

    // constructor(obj, evaluator) {
    //     this.evaluator = evaluator;
    //     if (!('comparator' in obj)) throw new Error("Invalid comparator.");
    //     this.op = obj.comparator;
    //     switch (this.op) {
    //         case 'equalTo':
    //             if(!('param1' in obj)) throw new Error("Missing param1 in comparator");
    //             if(!('param2' in obj)) throw new Error("Missing param2 in comparator");
    //             // this.param1 = new Evaluable(obj.param1);
    //             // this.param2 = new Evaluable(obj.param2);
    //             this.param1 = evaluator._DI(obj.param1);
    //             this.param2 = evaluator._DI(obj.param2);
    //             break;
    //         default:
    //             throw new Error('Invalid comparator operation.');
    //             break;
    //     }
    // }

    evaluate(request) {
        switch(this.op) {
            case 'equalTo':
                var v1 = this.param1.evaluate(request);
                var v2 = this.param2.evaluate(request);
                console.log("EQUALTO: " + v1 + ", " + v2);
                return this._equalTo(v1,v2);
            case 'lessThan':
                var v1 = parseInt(this.param1.evaluate(request));
                var v2 = parseInt(this.param2.evaluate(request));
                var res = this._lessThan(v1, v2)
                console.log("LESSTHAN: " + v1 + ", " + v2 + " , " + res)
                return res
            case 'greaterThan':
                var v1 = parseInt(this.param1.evaluate(request));
                var v2 = parseInt(this.param2.evaluate(request));
                var res = this._greaterThan(v1, v2)
                console.log("GREATERTHAN: " + v1 + ", " + v2 + " , " + res)
                return res
            default:
                throw new Error('Cannot evaluate invalid comparator.');
        }
    }

    validate() {
        try {
            let dt1 = this.param1.validate()
            let dt2 = this.param2.validate()
            if (dt1 != dt2) {
                throw new Error("Comparator cannot compare different data types!")
            }
            if (this.op == 'lessThan' || this.op == 'greaterThan') {
                if (dt1 != 'integer') throw new Error("Less than / Greater than only works on integer values")
            }
            return 'boolean'
        } catch(err) {
            throw err
        }
    }

    _equalTo(param, value) {
        return param == value;
    }

    _lessThan(param, value) {
        return param < value
    }

    _greaterThan(param, value) {
        return param > value
    }

    getObject() {
        let object = {
            op: this.op
        }
        switch(this.op) {
            case 'greaterThan':
            case 'lessThan':
            case 'equalTo':
                object.param1 = this.param1
                object.param2 = this.param2
                break
            default:
                throw new Error("Could not getObject on invalid Comparator")
        }
        return object
    }

    toJson() {
        let param1 = this.param1.toJson()
        let param2 = this.param2.toJson()
        switch(this.op) {
            case 'equalTo':
                return {comparator: 'equalTo', param1: param1, param2: param2}
            case 'lessThan':
                return {comparator: 'lessThan', param1: param1, param2: param2}
            case 'greaterThan':
                return {comparator: 'greaterThan', param1: param1, param2: param2}
            default:
                throw new Error("Cannot toJson invalid comparator")
        }
    }
}

export default Comparator