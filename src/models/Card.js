class Card extends FinancialInstrument {
    constructor(cardholderName, cardNumber, expiryDate, cvv, bankName, cardType, cardColor) {
        super(cardNumber.replace(/\s/g, ''), 'USD');
        this.cardholderName = cardholderName.toUpperCase();
        this.expiryDate = expiryDate;
        this.cvv = cvv;
        this.bankName = bankName;
        this.cardType = cardType;
        this.cardColor = cardColor; // Store the theme color
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

        // Get theme colors from CardGenerator config
        const cardGenerator = new CardGenerator();
        const themeColors = cardGenerator.config.cardColors[this.cardColor] ||
            { primary: '#3498db', secondary: '#ffffff' };                                           

        // Draw card background with theme gradient
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, themeColors.primary);
        gradient.addColorStop(1, themeColors.secondary);

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
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(this.bankName, x + 20, y + 30);

        // Draw card number
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillText(this.getFormattedNumber(), x + 20, y + 150);

        ctx.font = '12px Arial';
        // Draw expiry date
        ctx.fillText('VALID THRU', x + 20, y + height - 70);
        ctx.fillText(this.expiryDate, x + 20, y + height - 55);

        // Draw cardholder name
        ctx.font = '20px Arial';
        ctx.fillText(this.cardholderName, x + 20, y + height - 25);

        // Draw card type with logo color
        const typeColors = {
            'visa': '#1a1f71',
            'mastercard': '#eb001b',
            'amex': '#2e77bc',
            'discover': '#ff6000'
        };

        ctx.fillStyle = typeColors[this.cardType] || '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(this.cardType.toUpperCase(), x + width - 20, y + 30);

        // Draw security features
        this.drawHologram(ctx, x + width - 100, y + 50, 80, 30);

        // Draw shine effect
        this.addShineEffect(ctx, x, y, width, height);

        //Add subtle card type logo in corner
        this.drawCardTypeBadge(ctx, x + width - 40, y + height - 30);

        // Draw chip
        this.drawChip(ctx, x + 20, y + 80);

    }

    drawCardTypeBadge(ctx, x, y) {
        // Small card type indicator badge
        const badgeColors = {
            'visa': { bg: '#1a1f71', text: '#ffffff' },
            'mastercard': { bg: '#eb001b', text: '#ffffff' },
            'amex': { bg: '#2e77bc', text: '#ffffff' },
            'discover': { bg: '#ff6000', text: '#ffffff' }
        };

        const badge = badgeColors[this.cardType];
        if (badge) {
            ctx.fillStyle = badge.bg;
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = badge.text;
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.cardType.substring(0, 2).toUpperCase(), x, y);
        }
    }

    drawChip(ctx, x, y) {
        // More realistic EMV chip design
        const chipWidth = 36;
        const chipHeight = 28;

        // Draw chip body with metallic sheen
        this.drawEMVChipBody(ctx, x, y, chipWidth, chipHeight);

        // Draw detailed circuit pattern
        this.drawEMVCircuitPattern(ctx, x, y, chipWidth, chipHeight);

        // Draw chip contacts in proper EMV arrangement
        this.drawEMVContacts(ctx, x, y, chipWidth, chipHeight);

        // Draw chip bevel/edge
        this.drawChipBevel(ctx, x, y, chipWidth, chipHeight);
    }

    drawEMVChipBody(ctx, x, y, width, height) {
        // Complex metallic gradient for realistic chip
        const gradient = ctx.createRadialGradient(
            x + width / 2, y + height / 2, 0,
            x + width / 2, y + height / 2, width
        );

        // Gold metallic gradient
        gradient.addColorStop(0, '#FFEC8B');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(0.5, '#B8860B');
        gradient.addColorStop(0.7, '#DAA520');
        gradient.addColorStop(1, '#FFD700');

        // Draw chip with subtle corner rounding
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x + 3, y);
        ctx.lineTo(x + width - 3, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + 3);
        ctx.lineTo(x + width, y + height - 3);
        ctx.quadraticCurveTo(x + width, y + height, x + width - 3, y + height);
        ctx.lineTo(x + 3, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - 3);
        ctx.lineTo(x, y + 3);
        ctx.quadraticCurveTo(x, y, x + 3, y);
        ctx.closePath();
        ctx.fill();

        // Add highlight on top
        const highlight = ctx.createLinearGradient(x, y, x, y + height / 3);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = highlight;
        ctx.fill();

        // Add shadow on bottom
        const shadow = ctx.createLinearGradient(x, y + height * 2 / 3, x, y + height);
        shadow.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
        shadow.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

        ctx.fillStyle = shadow;
        ctx.fill();
    }

    drawEMVCircuitPattern(ctx, x, y, width, height) {
        ctx.save();

        const centerX = x + width / 2;
        const centerY = y + height / 2;

        // Dark central rectangle (chip core)
        ctx.fillStyle = '#111';
        const coreWidth = 14;
        const coreHeight = 10;
        ctx.fillRect(centerX - coreWidth / 2, centerY - coreHeight / 2, coreWidth, coreHeight);

        // Circuit traces coming from core
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        ctx.lineCap = 'square';

        // Top trace
        ctx.beginPath();
        ctx.moveTo(centerX - 3, centerY - coreHeight / 2);
        ctx.lineTo(centerX - 3, y + 4);
        ctx.stroke();

        // Bottom trace
        ctx.beginPath();
        ctx.moveTo(centerX + 3, centerY + coreHeight / 2);
        ctx.lineTo(centerX + 3, y + height - 4);
        ctx.stroke();

        // Left trace
        ctx.beginPath();
        ctx.moveTo(centerX - coreWidth / 2, centerY - 2);
        ctx.lineTo(x + 4, centerY - 2);
        ctx.stroke();

        // Right trace
        ctx.beginPath();
        ctx.moveTo(centerX + coreWidth / 2, centerY + 2);
        ctx.lineTo(x + width - 4, centerY + 2);
        ctx.stroke();

        // Add tiny connection dots at trace ends
        ctx.fillStyle = '#444';

        // Top connection
        ctx.beginPath();
        ctx.arc(centerX - 3, y + 4, 1, 0, Math.PI * 2);
        ctx.fill();

        // Bottom connection
        ctx.beginPath();
        ctx.arc(centerX + 3, y + height - 4, 1, 0, Math.PI * 2);
        ctx.fill();

        // Left connection
        ctx.beginPath();
        ctx.arc(x + 4, centerY - 2, 1, 0, Math.PI * 2);
        ctx.fill();

        // Right connection
        ctx.beginPath();
        ctx.arc(x + width - 4, centerY + 2, 1, 0, Math.PI * 2);
        ctx.fill();

        // Add some random circuit elements
        ctx.fillStyle = '#333';

        // Small rectangles (capacitors/resistors)
        ctx.fillRect(centerX + 2, centerY - 4, 3, 2);
        ctx.fillRect(centerX - 5, centerY + 2, 3, 2);
        ctx.fillRect(x + 8, centerY - 1, 2, 4);
        ctx.fillRect(x + width - 10, centerY - 2, 2, 4);

        // Tiny dots (vias/connections)
        const dots = [
            [centerX - 2, centerY + 5],
            [centerX + 1, centerY - 3],
            [x + 10, y + 8],
            [x + width - 8, y + 8],
            [x + 10, y + height - 8],
            [x + width - 8, y + height - 8]
        ];

        dots.forEach(([dotX, dotY]) => {
            ctx.beginPath();
            ctx.arc(dotX, dotY, 0.8, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    drawEMVContacts(ctx, x, y, width, height) {
        // EMV chips typically have 6-8 contacts in specific positions
        const contacts = [
            // C1 - VCC (Power)
            { x: x + 4, y: y + 6, width: 3, height: 2 },
            // C2 - RST (Reset)
            { x: x + 10, y: y + 6, width: 3, height: 2 },
            // C3 - CLK (Clock)
            { x: x + 16, y: y + 6, width: 3, height: 2 },
            // C5 - GND (Ground)
            { x: x + 4, y: y + height - 8, width: 3, height: 2 },
            // C6 - VPP (Programming Voltage)
            { x: x + 10, y: y + height - 8, width: 3, height: 2 },
            // C7 - I/O (Data)
            { x: x + 16, y: y + height - 8, width: 3, height: 2 }
        ];

        contacts.forEach(contact => {
            // Silver contact pad with 3D effect
            const contactGradient = ctx.createLinearGradient(
                contact.x, contact.y,
                contact.x + contact.width, contact.y + contact.height
            );

            contactGradient.addColorStop(0, '#F0F0F0');
            contactGradient.addColorStop(0.5, '#D0D0D0');
            contactGradient.addColorStop(1, '#A0A0A0');

            ctx.fillStyle = contactGradient;
            ctx.fillRect(contact.x, contact.y, contact.width, contact.height);

            // Add top highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(contact.x, contact.y, contact.width, 0.5);

            // Add side shadows for 3D effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(contact.x, contact.y + contact.height, contact.width, 0.5);
            ctx.fillRect(contact.x + contact.width, contact.y, 0.5, contact.height);
        });
    }

    drawChipBevel(ctx, x, y, width, height) {
        // Add bevel/edge around chip
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 1);
        ctx.lineTo(x + width - 1, y + 1);
        ctx.lineTo(x + width - 1, y + height - 1);
        ctx.lineTo(x + 1, y + height - 1);
        ctx.closePath();
        ctx.stroke();

        // Inner bevel highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 2);
        ctx.lineTo(x + width - 2, y + 2);
        ctx.lineTo(x + width - 2, y + height - 2);
        ctx.lineTo(x + 2, y + height - 2);
        ctx.closePath();
        ctx.stroke();
    }

    drawHologram(ctx, x, y, width, height) {
        // Create hologram effect with theme color
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