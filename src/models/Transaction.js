
// src/models/Transaction.js
class Transaction extends BaseModel {
    constructor(type, amount, accountId) {
        super();
        this.type = type; // 'deposit', 'withdrawal'
        this.amount = amount;
        this.accountId = accountId;
        this.timestamp = new Date();
        this.status = 'pending';
        this.reference = this.generateReference();
    }

    generateReference() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let ref = '';
        for (let i = 0; i < 12; i++) {
            ref += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return ref;
    }

    complete() {
        this.status = 'completed';
    }

    fail() {
        this.status = 'failed';
    }

    isSuccessful() {
        return this.status === 'completed';
    }
}