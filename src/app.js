// src/app.js
class AtmSimulator {
    constructor() {
        this.atmManager = new AtmManager();
        this.cardGenerator = new CardGenerator();
        this.initializeUI();
    }

    initializeUI() {
        const container = document.getElementById('atm-machine');
        this.atmUI = new AtmMachineUI(container, 350, 500, {
            body: '#2c3e50',
            screen: '#ecf0f1',
            keyboard: '#34495e',
            cashSlot: '#7f8c8d',
            buttons: ['#3498db', '#e74c3c', '#2ecc71']
        });

    }

    generateCard(cardData) {
        const card = this.cardGenerator.generateCard(cardData);
        // this.atmUI.insertCard(card);
        return card;
    }

    insertCard(card) {
        this.atmUI.insertCard(card);
    }
}

// Initialize the application
// const atmSimulator = new AtmSimulator();