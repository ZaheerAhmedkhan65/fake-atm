// src/models/Account.js
class Account extends BaseModel {
    constructor(ownerName, initialBalance = 0) {
        super();
        this.ownerName = ownerName;
        this.balance = initialBalance;
        this.currency = 'USD';
        this.transactions = [];
        this.pin = null;
        this.isActive = true;
    }

    setPin(pin) {
        if (pin.length === 4 && /^\d+$/.test(pin)) {
            this.pin = pin;
            return true;
        }
        return false;
    }

    verifyPin(pin) {
        return this.pin === pin;
    }

    deposit(amount) {
        if (amount <= 0) return false;

        this.balance += amount;
        const transaction = new Transaction('deposit', amount, this.id);
        transaction.complete();
        this.transactions.push(transaction);
        return true;
    }

    withdraw(amount) {
        if (amount <= 0 || amount > this.balance) return false;

        this.balance -= amount;
        const transaction = new Transaction('withdrawal', amount, this.id);
        transaction.complete();
        this.transactions.push(transaction);
        return true;
    }

    getBalance() {
        return this.balance;
    }

    getTransactionHistory() {
        return this.transactions;
    }
}