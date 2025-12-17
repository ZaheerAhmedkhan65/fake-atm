// src/ui/AtmMachineUI.js
class AtmMachineUI extends BaseUI {
    constructor(container, width, height, colors = {}) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        container.appendChild(canvas);

        super(canvas, width, height);

        this.colors = {
            body: '#8BC34A',
            bodyDark: '#689F38',
            bodyShadow: '#558B2F',
            screenFrame: '#CFD8DC',
            screen: '#29B6F6',
            keypad: '#B0BEC5',
            slot: '#263238',
            text: '#ffffff',
            buttons: ['#FF9800', '#4CAF50', '#F44336']
        };

        this.stateManager = new AtmStateManager(this);
        this.atmManager = new AtmManager();
        this.currentCard = null;

        // Add click event listener
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.stateManager.handleClick({ offsetX: x, offsetY: y });
        });

        this.draw();
    }

    draw() {
        // Clear canvas
        this.clear();

        // Draw ATM body
        this.drawAtmBody();

        // Draw current screen based on state
        this.stateManager.drawScreen();
    }

    drawAtmBody() {
        const w = this.width;
        const h = this.height;

        // === OUTER BODY ===
        this.drawRect(0, 0, w, h, this.colors.body, 25);

        // Side shadows
        this.drawRect(0, 0, w * 0.08, h, this.colors.bodyDark);
        this.drawRect(w * 0.92, 0, w * 0.08, h, this.colors.bodyDark);

        // === TOP HEADER ===
        this.drawRect(w * 0.1, h * 0.03, w * 0.8, h * 0.08, this.colors.bodyDark, 15);
        this.drawText('ATM', w / 2, h * 0.085, {
            font: 'bold 28px Arial',
            color: this.colors.text,
            align: 'center',
            baseline: 'middle'
        });

        // === SCREEN CAVITY ===
        this.drawRect(
            w * 0.08,
            h * 0.14,
            w * 0.84,
            h * 0.32,
            this.colors.bodyShadow,
            20
        );

        // === SCREEN FRAME ===
        this.drawRect(
            w * 0.15,
            h * 0.18,
            w * 0.7,
            h * 0.22,
            this.colors.screenFrame,
            12
        );

        // === SCREEN ===
        this.drawRect(
            w * 0.18,
            h * 0.2,
            w * 0.64,
            h * 0.18,
            this.colors.screen,
            10
        );

        // === SIDE SCREEN BUTTONS ===
        for (let i = 0; i < 4; i++) {
            this.drawRect(w * 0.14, h * (0.22 + i * 0.04), 8, 16, '#90A4AE', 4);
            this.drawRect(w * 0.84, h * (0.22 + i * 0.04), 8, 16, '#90A4AE', 4);
        }

        // === KEYPAD AREA ===
        this.drawRect(
            w * 0.18,
            h * 0.46,
            w * 0.64,
            h * 0.22,
            this.colors.keypad,
            15
        );

        // === CARD SLOT ===
        this.drawRect(
            w * 0.62,
            h * 0.42,
            w * 0.18,
            h * 0.035,
            this.colors.slot,
            6
        );

        // === CASH SLOT ===
        this.drawRect(
            w * 0.35,
            h * 0.75,
            w * 0.3,
            h * 0.05,
            this.colors.slot,
            8
        );

        // === BOTTOM BRANDING ===
        this.drawText('ATM', w / 2, h * 0.9, {
            font: 'bold 34px Arial',
            color: this.colors.text,
            align: 'center'
        });

        // Existing features
        this.drawCardSlot();
        this.drawActionButtons();
    }


    drawCardSlot() {
        const slotX = this.width * 0.75;
        const slotY = this.height * 0.4;
        const slotWidth = this.width * 0.15;
        const slotHeight = this.height * 0.05;

        // Draw card slot
        this.drawRect(slotX, slotY, slotWidth, slotHeight, '#222', 3);

        if (this.currentCard) {
            // Draw inserted card
            this.drawRect(
                slotX - this.width * 0.02,
                slotY - this.height * 0.01,
                slotWidth * 0.8,
                slotHeight * 1.4,
                '#1a2980',
                5
            );

            this.drawText('✓ Card Inserted', slotX, slotY - 10, {
                font: '12px Arial',
                color: '#27ae60',
                align: 'left'
            });
        } else {
            this.drawText('Insert Card →', slotX, slotY - 10, {
                font: '12px Arial',
                color: '#fff',
                align: 'left'
            });
        }
    }

    drawActionButtons() {
        const buttonWidth = this.width * 0.12;
        const buttonHeight = this.height * 0.06;
        const buttonX = this.width * 0.85;
        const buttonSpacing = this.height * 0.08;

        for (let i = 0; i < 3; i++) {
            const buttonY = this.height * 0.1 + (i * buttonSpacing);

            this.drawRect(
                buttonX,
                buttonY,
                buttonWidth,
                buttonHeight,
                this.colors.buttons[i],
                5
            );

            // Draw button labels based on state
            const labels = this.stateManager.getButtonLabels();
            if (labels[i]) {
                this.drawText(
                    labels[i],
                    buttonX + buttonWidth / 2,
                    buttonY + buttonHeight / 2,
                    {
                        font: '14px Arial',
                        color: '#fff',
                        align: 'center',
                        baseline: 'middle'
                    }
                );
            }
        }
    }

    drawKeypad() {
        const keyWidth = this.width * 0.15;
        const keyHeight = this.height * 0.08;
        const startX = this.width * 0.2;
        const startY = this.height * 0.5;
        const spacing = this.width * 0.05;

        const keys = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', '⌫']
        ];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const key = keys[row][col];
                if (key === '') continue;

                const x = startX + (col * (keyWidth + spacing));
                const y = startY + (row * (keyHeight + spacing * 0.8));

                // Draw key
                this.drawRect(x, y, keyWidth, keyHeight, '#666', 5);

                // Draw key label
                this.drawText(
                    key,
                    x + keyWidth / 2,
                    y + keyHeight / 2,
                    {
                        font: key === '⌫' ? 'bold 20px Arial' : 'bold 24px Arial',
                        color: '#fff',
                        align: 'center',
                        baseline: 'middle'
                    }
                );
            }
        }
    }

    insertCard(card) {
        this.currentCard = card;
        this.atmManager.insertCard(card);
        this.stateManager.setCardInserted(true , card);
        this.stateManager.setState('pinEntry');
        this.draw();
    }

    ejectCard() {
        this.currentCard = null;
        this.atmManager.ejectCard();
        this.stateManager.setCardInserted(false);
        this.stateManager.setState('welcome');
        this.draw();
    }

    getAtmManager() {
        return this.atmManager;
    }

    getStateManager() {
        return this.stateManager;
    }
}