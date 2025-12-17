// src/ui/AtmStateManager.js
class AtmStateManager extends BaseUI {
    constructor(atmUI) {
        super(atmUI.canvas, atmUI.width, atmUI.height);
        this.atmUI = atmUI;
        this.state = '';
        this.inputBuffer = '';
        this.selectedTransaction = null;
        this.showReceipt = false;
        this.isCardInserted = false;
        this.insertedCard = null;
    }

    setState(state) {
        this.state = state;
        this.inputBuffer = '';
        this.atmUI.draw();
    }

    setCardInserted(isInserted, card = null) {
        this.isCardInserted = isInserted;
        if (isInserted && card) {
            this.insertedCard = card;
        }
    }

    getButtonLabels() {
        switch (this.state) {
            case 'welcome':
                return ['Insert Card', 'Help', 'Cancel'];
            case 'pinEntry':
                return ['Enter', 'Clear', 'Cancel'];
            case 'transactionType':
                return ['Deposit', 'Withdraw', 'Cancel'];
            case 'amountEntry':
                return ['OK', 'Clear', 'Cancel'];
            case 'receiptChoice':
                return ['Yes', 'No', 'Cancel'];
            case 'processing':
                return ['', '', 'Cancel'];
            case 'thankYou':
                return ['OK', '', 'Cancel'];
            default:
                return ['OK', 'Help', 'Cancel'];
        }
    }

    drawScreen() {
        switch (this.state) {
            case 'welcome': this.drawWelcomeScreen(); break;
            case 'pinEntry': this.drawPinScreen(); break;
            case 'transactionType': this.drawTransactionTypeScreen(); break;
            case 'amountEntry': this.drawAmountScreen(); break;
            case 'receiptChoice': this.drawReceiptScreen(); break;
            case 'processing': this.drawProcessingScreen(); break;
            case 'thankYou': this.drawThankYouScreen(); break;
        }
    }

    drawWelcomeScreen() {
        console.log(this.width, this.height)
        this.drawText('Welcome to', this.width * 0.5, this.height * 0.18, {
            font: 'bold 28px Arial',
            align: 'center',
            color: '#000'
        });

        this.drawText('Fake Bank ATM', this.width * 0.5, this.height * 0.25, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        this.drawText('Please insert your card', this.width * 0.5, this.height * 0.35, {
            font: '18px Arial',
            align: 'center',
            color: '#000'
        });

        if (!this.isCardInserted) {
            this.drawText('Click "Insert Card" to begin', this.width * 0.5, this.height * 0.42, {
                font: 'bold 16px Arial',
                align: 'center',
                color: '#3498db'
            });
        }
    }

    drawPinScreen() {
        this.drawText('Enter your PIN', this.width * 0.5, this.height * 0.18, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        // Draw PIN input field
        this.drawRect(
            this.width * 0.2,
            this.height * 0.25,
            this.width * 0.6,
            this.height * 0.08,
            '#fff',
            5
        );

        // Draw PIN dots
        const dotSpacing = this.width * 0.10;
        const startX = this.width * 0.35;

        for (let i = 0; i < 4; i++) {
            if (i < this.inputBuffer.length) {
                this.drawText(
                    '*',
                    startX + (i * dotSpacing),
                    this.height * 0.30,
                    {
                        font: '24px Arial',
                        align: 'center',
                        color: '#000',
                        baseline: 'middle'
                    }
                );
            }
        }

        // Draw keypad
        this.atmUI.drawKeypad();
    }

    drawTransactionTypeScreen() {
        this.drawText('Select Transaction', this.width * 0.5, this.height * 0.18, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        const balance = this.atmUI.getAtmManager().getBalance();
        this.drawText(`Balance: $${balance}`, this.width * 0.5, this.height * 0.25, {
            font: '18px Arial',
            align: 'center',
            color: '#000'
        });

        // Draw transaction options
        const options = [
            { text: 'Deposit', y: 0.35 },
            { text: 'Withdraw', y: 0.45 }
        ];

        options.forEach(option => {
            // Draw option box
            this.drawRect(
                this.width * 0.25,
                this.height * option.y,
                this.width * 0.5,
                this.height * 0.08,
                '#ddd',
                8
            );

            // Draw option text
            this.drawText(
                option.text,
                this.width * 0.5,
                this.height * option.y + this.height * 0.04,
                {
                    font: '22px Arial',
                    align: 'center',
                    color: '#000',
                    baseline: 'middle'
                }
            );
        });
    }

    drawAmountScreen() {
        const transactionType = this.selectedTransaction === 'deposit' ? 'Deposit' : 'Withdrawal';

        this.drawText(`Enter ${transactionType} Amount`, this.width * 0.5, this.height * 0.18, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        // Draw amount input field
        this.drawRect(
            this.width * 0.25,
            this.height * 0.25,
            this.width * 0.5,
            this.height * 0.08,
            '#fff',
            5
        );

        // Draw amount
        const displayAmount = this.inputBuffer || '0';
        this.drawText(
            `$${displayAmount}`,
            this.width * 0.5,
            this.height * 0.29,
            {
                font: '28px Arial',
                align: 'center',
                color: '#000',
                baseline: 'middle'
            }
        );

        // Draw limits
        const manager = this.atmUI.getAtmManager();
        const minAmount = this.selectedTransaction === 'deposit' ? manager.minDeposit : manager.minWithdrawal;
        const maxAmount = this.selectedTransaction === 'deposit' ? manager.maxDeposit : manager.maxWithdrawal;

        this.drawText(
            `Min: $${minAmount} | Max: $${maxAmount}`,
            this.width * 0.5,
            this.height * 0.38,
            {
                font: '16px Arial',
                align: 'center',
                color: '#666'
            }
        );

        // Draw keypad
        this.atmUI.drawKeypad();
    }

    drawReceiptScreen() {
        this.drawText('Print Receipt?', this.width * 0.5, this.height * 0.18, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        const options = [
            { text: 'Yes, print receipt', y: 0.3 },
            { text: 'No receipt', y: 0.4 }
        ];

        options.forEach(option => {
            this.drawRect(
                this.width * 0.25,
                this.height * option.y,
                this.width * 0.5,
                this.height * 0.08,
                '#ddd',
                8
            );

            this.drawText(
                option.text,
                this.width * 0.5,
                this.height * option.y + this.height * 0.04,
                {
                    font: '20px Arial',
                    align: 'center',
                    color: '#000',
                    baseline: 'middle'
                }
            );
        });
    }

    drawProcessingScreen() {
        this.drawText('Processing...', this.width * 0.5, this.height * 0.2, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        // Draw spinner
        const time = new Date().getTime() / 1000;
        const centerX = this.width * 0.5;
        const centerY = this.height * 0.35;
        const radius = 25;

        this.ctx.save();
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#3498db';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, time * 2, time * 2 + Math.PI / 2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawThankYouScreen() {
        this.drawText('Thank You!', this.width * 0.5, this.height * 0.2, {
            font: 'bold 24px Arial',
            align: 'center',
            color: '#000'
        });

        this.drawText('Transaction completed successfully', this.width * 0.5, this.height * 0.3, {
            font: '18px Arial',
            align: 'center',
            color: '#000'
        });

        if (this.showReceipt) {
            this.drawText('Receipt has been downloaded', this.width * 0.5, this.height * 0.38, {
                font: '16px Arial',
                align: 'center',
                color: '#27ae60'
            });
        }

        this.drawText('Taking card...', this.width * 0.5, this.height * 0.46, {
            font: '16px Arial',
            align: 'center',
            color: '#666'
        });
    }

    handleClick(event) {
        const { offsetX, offsetY } = event;

        // Check if click is on action buttons
        const buttonWidth = this.width * 0.12;
        const buttonHeight = this.height * 0.06;
        const buttonX = this.width * 0.85;
        const buttonSpacing = this.height * 0.08;

        for (let i = 0; i < 3; i++) {
            const buttonY = this.height * 0.1 + (i * buttonSpacing);

            if (offsetX >= buttonX && offsetX <= buttonX + buttonWidth &&
                offsetY >= buttonY && offsetY <= buttonY + buttonHeight) {
                this.handleButtonClick(i);
                return;
            }
        }

        // Handle other clicks based on state
        switch (this.state) {
            case 'pinEntry':
            case 'amountEntry':
                this.handleKeypadClick(offsetX, offsetY);
                break;
            case 'transactionType':
                this.handleTransactionTypeClick(offsetX, offsetY);
                break;
            case 'receiptChoice':
                this.handleReceiptChoiceClick(offsetX, offsetY);
                break;
        }
    }

    handleButtonClick(buttonIndex) {
        switch (this.state) {
            case 'welcome':
                if (buttonIndex === 0) {
                    if (this.isCardInserted) {
                        this.setState('pinEntry');
                    } else {
                        alert('Please insert a card first');
                    }
                }
                break;

            case 'pinEntry':
                if (buttonIndex === 0) {
                    // Enter button
                    if (this.inputBuffer === this.insertedCard?.pin) {
                        this.setState('transactionType');
                    } else {
                        alert('Invalid PIN. Try again.');
                        this.inputBuffer = '';
                        this.atmUI.draw();
                    }
                } else if (buttonIndex === 1) {
                    // Clear button
                    this.inputBuffer = '';
                    this.atmUI.draw();
                } else if (buttonIndex === 2) {
                    // Cancel button
                    this.atmUI.ejectCard();
                }
                break;

            case 'transactionType':
                if (buttonIndex === 0) {
                    // Deposit
                    this.selectedTransaction = 'deposit';
                    this.setState('amountEntry');
                } else if (buttonIndex === 1) {
                    // Withdraw
                    this.selectedTransaction = 'withdraw';
                    this.setState('amountEntry');
                } else if (buttonIndex === 2) {
                    // Cancel
                    this.atmUI.ejectCard();
                }
                break;

            case 'amountEntry':
                if (buttonIndex === 0) {
                    // OK button
                    const amount = parseInt(this.inputBuffer) || 0;
                    const manager = this.atmUI.getAtmManager();

                    try {
                        if (this.selectedTransaction === 'deposit') {
                            if (amount >= manager.minDeposit && amount <= manager.maxDeposit) {
                                manager.deposit(amount);
                                this.setState('receiptChoice');
                            } else {
                                alert(`Amount must be between $${manager.minDeposit} and $${manager.maxDeposit}`);
                            }
                        } else {
                            if (amount >= manager.minWithdrawal && amount <= manager.maxWithdrawal) {
                                if (manager.withdraw(amount)) {
                                    this.setState('receiptChoice');
                                } else {
                                    alert('Insufficient funds');
                                }
                            } else {
                                alert(`Amount must be between $${manager.minWithdrawal} and $${manager.maxWithdrawal}`);
                            }
                        }
                    } catch (error) {
                        alert(error.message);
                    }
                } else if (buttonIndex === 1) {
                    // Clear button
                    this.inputBuffer = '';
                    this.atmUI.draw();
                } else if (buttonIndex === 2) {
                    // Cancel button
                    this.setState('transactionType');
                }
                break;

            case 'receiptChoice':
                if (buttonIndex === 0) {
                    // Yes - want receipt
                    this.showReceipt = true;
                    this.processTransaction();
                } else if (buttonIndex === 1) {
                    // No - don't want receipt
                    this.showReceipt = false;
                    this.processTransaction();
                } else if (buttonIndex === 2) {
                    // Cancel
                    this.setState('transactionType');
                }
                break;

            case 'thankYou':
                if (buttonIndex === 0 || buttonIndex === 2) {
                    this.atmUI.ejectCard();
                }
                break;
        }
    }

    handleKeypadClick(x, y) {
        const keyWidth = this.width * 0.15;
        const keyHeight = this.height * 0.08;
        const startX = this.width * 0.2;
        const startY = this.height * 0.5;
        const spacing = this.width * 0.05;

        const keys = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', '⌫']
        ];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const key = keys[row][col];
                if (key === '') continue;

                const keyX = startX + (col * (keyWidth + spacing));
                const keyY = startY + (row * (keyHeight + spacing * 0.4));

                if (x >= keyX && x <= keyX + keyWidth &&
                    y >= keyY && y <= keyY + keyHeight) {

                    if (key === '⌫') {
                        // Backspace
                        this.inputBuffer = this.inputBuffer.slice(0, -1);
                    } else {
                        // Number key
                        if (this.state === 'pinEntry' && this.inputBuffer.length < 4) {
                            this.inputBuffer += key;
                        } else if (this.state === 'amountEntry' && this.inputBuffer.length < 6) {
                            this.inputBuffer += key;
                        }
                    }

                    this.atmUI.draw();
                    return;
                }
            }
        }
    }

    handleTransactionTypeClick(x, y) {
        const depositY = this.height * 0.35;
        const withdrawY = this.height * 0.45;
        const boxWidth = this.width * 0.5;
        const boxHeight = this.height * 0.08;
        const boxX = this.width * 0.25;

        if (x >= boxX && x <= boxX + boxWidth) {
            if (y >= depositY && y <= depositY + boxHeight) {
                this.selectedTransaction = 'deposit';
                this.setState('amountEntry');
            } else if (y >= withdrawY && y <= withdrawY + boxHeight) {
                this.selectedTransaction = 'withdraw';
                this.setState('amountEntry');
            }
        }
    }

    handleReceiptChoiceClick(x, y) {
        const yesY = this.height * 0.3;
        const noY = this.height * 0.4;
        const boxWidth = this.width * 0.5;
        const boxHeight = this.height * 0.08;
        const boxX = this.width * 0.25;

        if (x >= boxX && x <= boxX + boxWidth) {
            if (y >= yesY && y <= yesY + boxHeight) {
                this.showReceipt = true;
                this.processTransaction();
            } else if (y >= noY && y <= noY + boxHeight) {
                this.showReceipt = false;
                this.processTransaction();
            }
        }
    }

    processTransaction() {
        this.setState('processing');

        // Simulate processing delay
        setTimeout(() => {
            if (this.showReceipt) {
                const manager = this.atmUI.getAtmManager();
                const amount = parseInt(this.inputBuffer) || 0;
                const previousBalance = this.selectedTransaction === 'deposit' ?
                    manager.getBalance() - amount : manager.getBalance() + amount;
                const newBalance = manager.getBalance();

                this.generateAndDownloadReceipt(
                    this.selectedTransaction,
                    amount,
                    previousBalance,
                    newBalance
                );
            }

            this.setState('thankYou');

            // Auto eject after 3 seconds
            setTimeout(() => {
                this.atmUI.ejectCard();
            }, 3000);
        }, 2000);
    }

    generateAndDownloadReceipt(transactionType, amount, previousBalance, newBalance) {
        const receipt = new Receipt();
        receipt.transactionId = Math.random().toString(36).substr(2, 9).toUpperCase();
        receipt.location = 'ATM #001';

        receipt.addItem({
            name: `${transactionType.toUpperCase()} TRANSACTION`,
            price: amount
        });

        // Download the receipt
        receipt.downloadReceipt(transactionType, amount, previousBalance, newBalance);
    }

    createVisualReceiptCanvas(transactionType, amount, previousBalance, newBalance) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 400;
        let height = 600;

        // Estimate height based on content
        height += 25 * 10; // Approx for items and footer

        canvas.width = width;
        canvas.height = height;

        // Background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, width, height);

        // Header
        ctx.fillStyle = '#000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FAKE BANK ATM RECEIPT', width / 2, 40);

        // Separator
        let y = 70;
        this.drawSeparator(ctx, y, width);
        y += 30;

        // Transaction details
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.fillText(`Transaction Type: ${transactionType}`, 30, y);
        ctx.fillText(`Amount: $${amount.toFixed(2)}`, 30, y + 20);
        ctx.fillText(`Previous Balance: $${previousBalance.toFixed(2)}`, 30, y + 40);
        ctx.fillText(`New Balance: $${newBalance.toFixed(2)}`, 30, y + 60);

        // Separator
        y += 80;
        this.drawSeparator(ctx, y, width);
        y += 30;

        // Footer
        ctx.fillStyle = '#000';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('FAKE BANK', width / 2, height - 20);

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
}