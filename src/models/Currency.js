// src/models/Currency.js
class Currency extends BaseModel {
    constructor(code, name, symbol) {
        super();
        this.code = code;
        this.name = name;
        this.symbol = symbol;
        this.exchangeRate = 1.0;
    }

    format(amount) {
        return `${this.symbol}${amount.toFixed(2)}`;
    }

    convert(amount, targetCurrency) {
        return amount * this.exchangeRate;
    }

    setExchangeRate(rate) {
        if (rate > 0) {
            this.exchangeRate = rate;
        }
    }
}