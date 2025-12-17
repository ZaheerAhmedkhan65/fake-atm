
// src/models/AtmManager.js
class AtmManager extends BaseModel {
    constructor() {
        super();
        this.accounts = [];
        this.currentAccount = null;
        this.currentCard = null;
        this.isCardInserted = false;
        this.minWithdrawal = 100;
        this.maxWithdrawal = 5000;
        this.minDeposit = 50;
        this.maxDeposit = 10000;
    }

    insertCard(card) {
        this.currentCard = card;
        this.isCardInserted = true;

        // For demo, create a mock account
        this.currentAccount = new Account(card.cardholderName, 2500);
        this.currentAccount.setPin(card.pin);

        return true;
    }

    ejectCard() {
        this.currentCard = null;
        this.isCardInserted = false;
        this.currentAccount = null;
        return true;
    }

    verifyPin(pin) {
        if (!this.currentAccount) return false;
        return this.currentAccount.verifyPin(pin);
    }

    withdraw(amount) {
        if (!this.currentAccount) return false;
        if (amount < this.minWithdrawal || amount > this.maxWithdrawal) {
            throw new Error(`Amount must be between $${this.minWithdrawal} and $${this.maxWithdrawal}`);
        }
        return this.currentAccount.withdraw(amount);
    }

    deposit(amount) {
        if (!this.currentAccount) return false;
        if (amount < this.minDeposit || amount > this.maxDeposit) {
            throw new Error(`Amount must be between $${this.minDeposit} and $${this.maxDeposit}`);
        }
        return this.currentAccount.deposit(amount);
    }

    getBalance() {
        return this.currentAccount ? this.currentAccount.getBalance() : 0;
    }

    generateReceipt(transactionType, amount) {
        if (!this.currentAccount) return null;

        const receipt = new Receipt();
        receipt.addItem({
            name: `${transactionType} Transaction`,
            price: amount
        });

        return receipt;
    }
}