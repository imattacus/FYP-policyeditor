class Response {
    // TODO: Will be more useful if a response has more info about where it has come from etc will be easier for users to understand..

    constructor(id, description) {
        this.id = id
        this.description = description
        this.Decision = "NotApplicable";
        this.Obligations = [];
    }

    setDecision(decision) {
        this.Decision = decision;
    }

    addObligation(obligation) {
        this.Obligations.push(obligation);
    }

    setObligations(obligations) {
        this.Obligations = obligations;
    }
}

export default Response