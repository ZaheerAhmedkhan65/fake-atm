// src/models/CurrencyNote.js
class CurrencyNote extends FinancialInstrument {
    constructor(value, currency) {
        super(value, currency);
        this.serialNumber = this.generateSerialNumber();
        this.width = 156;
        this.height = 66;
        this.color = this.getColorByValue(value);
        this.issueDate = new Date();
    }

    generateSerialNumber() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let serial = '';
        for (let i = 0; i < 10; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return serial;
    }

    getColorByValue(value) {
        const colors = {
            1: '#88BB88',
            5: '#BB9966',
            10: '#CC9966',
            20: '#9966CC',
            50: '#6699CC',
            100: '#66CC99'
        };
        return colors[value] || '#666666';
    }

    draw(ctx, x, y) {
        if (!ctx) return;

        const width = this.width;
        const height = this.height;

        // Draw note background
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, width, height);

        // Draw border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw value
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`$${this.value}`, x + width / 2, y + height / 2);

        // Draw serial number
        ctx.font = '8px Arial';
        ctx.fillText(`SN: ${this.serialNumber}`, x + width / 2, y + height - 10);
    }
}