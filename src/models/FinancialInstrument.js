// src/models/FinancialInstrument.js
class FinancialInstrument extends BaseModel {
    constructor(value, currency) {
        super();
        this.value = value;
        this.currency = currency || 'USD';
        this.isValid = true;
    }

    getValue() {
        return this.value;
    }

    getCurrency() {
        return this.currency;
    }

    validate() {
        return this.isValid;
    }

    setValidity(isValid) {
        this.isValid = isValid;
    }
}