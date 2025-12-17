// src/models/BaseModel.js
class BaseModel {
    constructor() {
        this.id = this.generateId();
        this.createdAt = new Date();
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    toJSON() {
        return JSON.stringify(this);
    }

    fromJSON(json) {
        return JSON.parse(json);
    }
}