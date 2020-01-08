import Response from './Response'

class CombiningAlgorithm {
    constructor(id, description, type) {
        this.id = id
        this.description = description
        this.setType(type)
    }

    getType() {
        return this.type
    }

    setType(type) {
        if (!(['denyOverrides', 'permitOverrides', 'firstApplicable', 'permitUnlessDeny', 'denyUnlessPermit']).includes(type)) {
            throw new Error("Invalid combining algorithm type!");
        }
        this.type = type; 
    }

    combine(responses) {
        switch(this.type) {
            case "denyOverrides":
                return this._denyOverrides(responses);
            case "permitOverrides":
                return this._permitOverrides(responses);
            case "firstApplicable":
                return this._firstApplicable(responses);
            case "permitUnlessDeny":
                return this._permitUnlessDeny(responses);
            case "denyUnlessPermit":
                return this._denyUnlessPermit(responses);
            default:
                throw new Error("Could not evaluate invalid algorithm type!");
        }
    }

    // Deny overrides, so [Permit, Permit, Permit, Deny] is Deny.. but can still be NotApplicable eg if [NA, NA]
    _denyOverrides(responses) {
        // let response = new Response();
        // if ((responses.filter(r=> r.Decision == "Deny")).length > 0) {
        //     response.setDecision("Deny");
        // } else if ((responses.filter(r=> r.Decision == "Permit")).length > 0) {
        //     response.setDecision("Permit");
        // }
        let response = responses.find(res => res.Decision == "Deny")
        if (response) {
            return response;
        } else {
            // No deny so default to firstApplicable
            return this._firstApplicable(responses)
        }
    }

    _permitOverrides(responses) {
        // TODO: Collect obligations from all responses?
        // let response = new Response();
        // if ((responses.filter(r=> r.Decision == "Permit")).length > 0) {
        //     response.setDecision("Permit");
        // } else if ((responses.filter(r=> r.Decision == "Deny")).length > 0) {
        //     response.setDecision("Deny");
        // }
        // return response;
        let response = responses.find(res => res.Decision == "Permit")
        if (response) {
            return response
        } else {
            return this._firstApplicable(responses)
        }
    }

    _firstApplicable(responses) {
        // for(let i=0; i<responses.length; i++) {
        //     let r = responses[i];
        //     if (r.Decision == "Permit" || r.Decision == "Deny") {
        //         return r;
        //     }
        // }

        let response = responses.find(res => res.Decision == "Permit" || res.Decision == "Deny")
        if (response) {
            return response
        } else {
            // No valid response found so return a new NotApplicable response from this id in the policytree
            let newResponse = new Response(this.id, this.description)
            return newResponse
        }
    }

    _permitUnlessDeny(responses) {
        let response = responses.find(res => res.Decision == "Deny")
        if (response) {
            return response
        } else {
            let newResponse = new Response(this.id, this.description)
            newResponse.setDecision("Permit")
            return newResponse
        }
    }

    _denyUnlessPermit(responses) {
        // let response = new Response();
        // if ((responses.filter(r=>r.Decision=="Permit")).length > 0) {
        //     // Responses DOES contain a Permit
        //     response.setDecision("Permit");
        // } else {
        //     response.setDecision("Deny");
        // }
        // return response;

        let response = responses.find(res => res.Decision == "Permit")
        if (response) {
            return response
        } else {
            let newResponse = new Response(this.id, this.description)
            newResponse.setDecision("Deny")
            return newResponse
        }
    }
}

export default CombiningAlgorithm