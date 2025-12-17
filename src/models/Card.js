// src/models/Card.js
class Card extends FinancialInstrument {
    constructor(cardholderName, cardNumber, expiryDate, cvv, bankName, cardType, cardColor) {
        super(cardNumber.replace(/\s/g, ''), 'USD');
        this.cardholderName = cardholderName.toUpperCase();
        this.expiryDate = expiryDate;
        this.cvv = cvv;
        this.bankName = bankName;
        this.cardType = cardType;
        this.cardColor = cardColor;
        this.pin = '1234'; // Default for demo
        this.cardId = this.generateCardId();
    }

    generateCardId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    getLastFourDigits() {
        return this.value.slice(-4);
    }

    getFormattedNumber() {
        return this.value.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    draw(ctx, x = 0, y = 0, width = 300, height = 180) {
        if (!ctx) return;

        // Card colors based on type
        const colors = {
            'visa': { primary: '#1a1f71', secondary: '#f7b600' },
            'mastercard': { primary: '#eb001b', secondary: '#f79e1b' },
            'amex': { primary: '#2e77bc', secondary: '#ffffff' },
            'discover': { primary: '#ff6000', secondary: '#ffffff' }
        };

        const cardColor = colors[this.cardType] || { primary: '#3498db', secondary: '#ffffff' };

        // Draw card background with gradient
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, cardColor.primary);
        gradient.addColorStop(1, cardColor.secondary);
        
        ctx.fillStyle = gradient;
        this.roundRect(ctx, x, y, width, height, 15);
        ctx.fill();

        // Draw card border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        this.roundRect(ctx, x, y, width, height, 15);
        ctx.stroke();

        // Draw bank name
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(this.bankName, x + 20, y + 30);

        // Draw chip
        this.drawChip(ctx, x + 20, y + 50);

        // Draw card number
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText(this.getFormattedNumber(), x + 20, y + 100);

        // Draw cardholder name
        ctx.font = '16px Arial';
        ctx.fillText(this.cardholderName, x + 20, y + height - 40);

        // Draw expiry date
        ctx.fillText(`VALID THRU ${this.expiryDate}`, x + width - 120, y + height - 40);

        // Draw card type
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(this.cardType.toUpperCase(), x + width - 20, y + 30);

        // Draw security features
        this.drawHologram(ctx, x + width - 100, y + 50, 80, 30);

        // Draw shine effect
        this.addShineEffect(ctx, x, y, width, height);
    }

    drawChip(ctx, x, y) {
        // Draw gold chip
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x, y, 40, 30);

        // Chip details
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 5, y + 5, 30, 20);

        // Chip lines
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 10, y);
        ctx.lineTo(x + 10, y - 5);
        ctx.moveTo(x + 30, y);
        ctx.lineTo(x + 30, y - 5);
        ctx.moveTo(x + 10, y + 30);
        ctx.lineTo(x + 10, y + 35);
        ctx.moveTo(x + 30, y + 30);
        ctx.lineTo(x + 30, y + 35);
        ctx.stroke();
    }

    drawHologram(ctx, x, y, width, height) {
        // Create hologram effect
        const gradient = ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);

        // Add hologram text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = 'italic 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('HOLOGRAM', x + width / 2, y + height / 2 + 4);
    }

    addShineEffect(ctx, x, y, width, height) {
        // Add subtle shine effect
        const gradient = ctx.createRadialGradient(
            x + width * 0.7, y + height * 0.3, 0,
            x + width * 0.7, y + height * 0.3, width * 0.8
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
}