// src/models/Receipt.js
class Receipt {
    constructor() {
        this.items = [];
        this.deposits = 0;
        this.withdrawals = 0;
        this.minWithdrawalAmount = 0;
        this.maxWithdrawalAmount = 0;
        this.minDepositAmount = 0;
        this.maxDepositAmount = 0;
        this.transactionDate = new Date();
    }

    addItem(item) {
        this.items.push(item);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + item.price, 0);
    }

    // Text-based receipt (for backward compatibility)
    printReceipt() {
        let receipt = "=== ATM TRANSACTION RECEIPT ===\n";
        receipt += `Transaction ID: ${this.transactionId}\n`;
        receipt += `Date: ${this.transactionDate.toLocaleString()}\n`;
        receipt += "--------------------------------\n";

        this.items.forEach(item => {
            receipt += `${item.name}: $${item.price.toFixed(2)}\n`;
        });

        receipt += "--------------------------------\n";
        receipt += `Total: $${this.getTotal().toFixed(2)}\n`;

        if (this.deposits > 0) {
            receipt += `Total Deposits: $${this.deposits.toFixed(2)}\n`;
        }

        if (this.withdrawals > 0) {
            receipt += `Total Withdrawals: $${this.withdrawals.toFixed(2)}\n`;
        }

        receipt += "Thank you for banking with us!\n";
        receipt += "================================";
        return receipt;
    }

    setDeposits(amount) {
        if (typeof amount === 'number' && amount >= 0) {
            this.deposits = amount;
        } else {
            throw new Error('Deposits must be a non-negative number');
        }
    }

    getDeposits() {
        return this.deposits;
    }

    setWithdrawals(amount) {
        if (typeof amount === 'number' && amount >= 0) {
            this.withdrawals = amount;
        } else {
            throw new Error('Withdrawals must be a non-negative number');
        }
    }

    getWithdrawals() {
        return this.withdrawals;
    }

    setMinWithdrawalAmount(amount) {
        if (typeof amount === 'number' && amount >= 0) {
            this.minWithdrawalAmount = amount;
        } else {
            throw new Error('Minimum withdrawal amount must be a non-negative number');
        }
    }

    getMinWithdrawalAmount() {
        return this.minWithdrawalAmount;
    }

    setMaxWithdrawalAmount(amount) {
        if (typeof amount === 'number' && amount >= this.minWithdrawalAmount) {
            this.maxWithdrawalAmount = amount;
        } else {
            throw new Error('Maximum withdrawal amount must be greater than or equal to the minimum withdrawal amount');
        }
    }

    getMaxWithdrawalAmount() {
        return this.maxWithdrawalAmount;
    }

    setMinDepositAmount(amount) {
        if (typeof amount === 'number' && amount >= 0) {
            this.minDepositAmount = amount;
        } else {
            throw new Error('Minimum deposit amount must be a non-negative number');
        }
    }

    getMinDepositAmount() {
        return this.minDepositAmount;
    }

    setMaxDepositAmount(amount) {
        if (typeof amount === 'number' && amount >= this.minDepositAmount) {
            this.maxDepositAmount = amount;
        } else {
            throw new Error('Maximum deposit amount must be greater than or equal to the minimum deposit amount');
        }
    }

    getMaxDepositAmount() {
        return this.maxDepositAmount;
    }

    // Create a visual receipt on canvas
    createVisualReceiptCanvas(transactionType, amount, previousBalance, newBalance) {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        // Background with gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#f8f9fa');
        gradient.addColorStop(1, '#ffffff');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Decorative top border
        ctx.fillStyle = '#0066cc';
        ctx.fillRect(0, 0, canvas.width, 10);

        // Bank logo/header
        ctx.fillStyle = '#0066cc';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FAKE BANK', canvas.width / 2, 50);

        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.fillText('Secure Banking Services', canvas.width / 2, 70);

        // Receipt title
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('TRANSACTION RECEIPT', canvas.width / 2, 100);

        // Separator
        this.drawSeparator(ctx, 110, canvas.width);

        // Transaction details
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';

        const details = [
            { label: 'Receipt No:', value: this.transactionId },
            { label: 'Date:', value: this.transactionDate.toLocaleDateString() },
            { label: 'Time:', value: this.transactionDate.toLocaleTimeString() },
            { label: 'ATM Location:', value: this.location },
            { label: 'Transaction:', value: transactionType.toUpperCase() },
            { label: 'Amount:', value: `$${amount.toFixed(2)}` },
            { label: 'Previous Balance:', value: `$${previousBalance.toFixed(2)}` },
            { label: 'New Balance:', value: `$${newBalance.toFixed(2)}` },
            { label: 'Status:', value: 'COMPLETED' }
        ];

        let y = 140;
        details.forEach(detail => {
            ctx.fillText(detail.label, 40, y);
            ctx.textAlign = 'right';
            ctx.fillText(detail.value, canvas.width - 40, y);
            ctx.textAlign = 'left';
            y += 25;
        });

        // Items if any
        if (this.items.length > 0) {

            this.drawSeparator(ctx, y, canvas.width);
            y += 20;

            // Total
            ctx.font = 'bold 16px Arial';
            ctx.fillText('Current Balance:', 40, y);
            ctx.textAlign = 'right';
            ctx.fillText(`$${newBalance.toFixed(2)}`, canvas.width - 40, y);
            ctx.textAlign = 'left';
            y += 20;
        }

        // Totals section
        this.drawSeparator(ctx, y, canvas.width);
        y += 20;

        if (this.deposits > 0) {
            ctx.fillText('Total Deposits:', 40, y);
            ctx.textAlign = 'right';
            ctx.fillText(`$${this.deposits.toFixed(2)}`, canvas.width - 40, y);
            ctx.textAlign = 'left';
            y += 25;
        }

        if (this.withdrawals > 0) {
            ctx.fillText('Total Withdrawals:', 40, y);
            ctx.textAlign = 'right';
            ctx.fillText(`$${this.withdrawals.toFixed(2)}`, canvas.width - 40, y);
            ctx.textAlign = 'left';
            y += 25;
        }

        // Footer message
        ctx.textAlign = 'center';
        ctx.font = 'italic 14px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText('Please retain this receipt for your records', canvas.width / 2, y);
        y += 20;
        ctx.fillText('Thank you for banking with us!', canvas.width / 2, y);
        y += 20;
        ctx.font = '12px Arial';
        ctx.fillText('For assistance: 1-800-FAKE-BANK', canvas.width / 2, y);
        y += 20;
        ctx.fillText('www.fakebank.com', canvas.width / 2, y);

        // Add security features
        this.addSecurityFeatures(ctx, canvas);

        return canvas;
    }

    drawSeparator(ctx, y, width) {
        ctx.beginPath();
        ctx.setLineDash([5, 3]);
        ctx.moveTo(30, y);
        ctx.lineTo(width - 30, y);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
        ctx.setLineDash([]);
    }

    addSecurityFeatures(ctx, canvas) {
        // Watermark (unchanged)
        ctx.globalAlpha = 0.1;
        ctx.font = 'bold 60px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText('FAKE BANK', 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1.0;

        /* ---------- SECURITY PATTERN ---------- */
        const size = 10;

        // Top & Bottom
        const horizontalCount = Math.floor(canvas.width / size);
        for (let i = 0; i < horizontalCount; i++) {
            
            ctx.fillStyle = i % 2 === 0 ? '#edf043ff' : '#f0f0f0';

            // Top
            let x = i * size;
            ctx.fillRect(x, 0, size, size);

            // Bottom
            x = (i + 1) * size;
            ctx.fillRect(x, canvas.height - size, size, size);
        }

        // Left & Right (skip top & bottom corners)
        const verticalCount = Math.floor(canvas.height / size);
        for (let i = 1; i < verticalCount - 1; i++) {
            // Skip corners

            // Offset parity to keep alternation continuous
            ctx.fillStyle = i % 2 === 0 ? '#edf043ff' : '#f0f0f0'

            // Left
            let y = i * size;
            ctx.fillRect(0, y, size, size);

            ctx.fillStyle = i % 2 === 0 ? '#f0f0f0' : '#edf043ff';

            // Right
            ctx.fillRect(canvas.width - size, y, size, size);
        }
    }


    // Method to download the receipt as PNG
    downloadReceipt(transactionType, amount, previousBalance, newBalance, filename = 'atm_receipt') {
        const canvas = this.createVisualReceiptCanvas(transactionType, amount, previousBalance, newBalance);

        // Create download link
        const link = document.createElement('a');
        link.download = `${filename}_${this.transactionId}.png`;
        link.href = canvas.toDataURL('image/png');

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return canvas;
    }
}