// src/generators/BaseGenerator.js
class BaseGenerator {
    constructor() {
        this.config = {};
    }

    loadConfig() {
        return {};
    }

    validate(data) {
        return true;
    }

    generate(data) {
        if (!this.validate(data)) {
            throw new Error('Invalid data provided');
        }
        return data;
    }
}