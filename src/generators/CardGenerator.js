
// src/generators/CardGenerator.js
class CardGenerator extends BaseGenerator {
    constructor() {
        super();
        this.config = this.loadConfig();
    }

    loadConfig() {
        return {
            cardColors: {
                'gradient-blue': { primary: '#1a2980', secondary: '#26d0ce' },
                'gradient-gold': { primary: '#FFD700', secondary: '#DAA520' },
                'gradient-silver': { primary: '#C0C0C0', secondary: '#808080' },
                'gradient-black': { primary: '#1a1a1a', secondary: '#404040' },
                'gradient-purple': { primary: '#654ea3', secondary: '#eaafc8' }
            },
            cardTypes: {
                'visa': { text: 'VISA', color: '#1a1f71' },
                'mastercard': { text: 'MasterCard', color: '#eb001b' },
                'amex': { text: 'AMEX', color: '#2e77bc' },
                'discover': { text: 'Discover', color: '#ff6000' }
            }
        };
    }

    validate(data) {
        const errors = [];

        if (!data.cardholderName || data.cardholderName.length < 3) {
            errors.push('Cardholder name must be at least 3 characters');
        }

        if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length !== 16) {
            errors.push('Card number must be 16 digits');
        }

        if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
            errors.push('Expiry date must be in MM/YY format');
        }

        if (!data.cvv || !/^\d{3}$/.test(data.cvv)) {
            errors.push('CVV must be 3 digits');
        }

        return errors.length === 0;
    }

    generateCard(data) {
        if (!this.validate(data)) {
            throw new Error('Invalid card data');
        }
        
        return new Card(
            data.cardholderName,
            data.cardNumber,
            data.expiryDate,
            data.cvv,
            data.bankName,
            data.cardType,
            data.cardColor
        );
    }
}