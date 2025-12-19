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

        // Store screen bounds for text rendering
        this.screenRect = {
            x: w * 0.18,
            y: h * 0.20,
            width: w * 0.64,
            height: h * 0.18,
            padding: 14
        };

        this.keypadRect = {
            x: w * 0.10,
            y: h * 0.46,
            width: w * 0.64,
            height: h * 0.32
        };


        // === OUTER BODY ===
        this.drawRect(0, 0, w, h, this.colors.body, 25);

        // Side shadows
        this.drawRect(0, 0, w * 0.08, h, this.colors.bodyDark);
        this.drawRect(w * 0.92, 0, w * 0.08, h, this.colors.bodyDark);

        // === TOP HEADER ===
        this.drawRect(0, h * 0, w, h * 0.08, this.colors.bodyDark, 0);
        this.drawText('FAKE ATM', w / 2, h * 0.04, {
            font: 'bold 24px Arial',
            color: this.colors.text,
            align: 'center',
            baseline: 'middle'
        });

        // === SCREEN CAVITY ===
        this.drawRect(
            w * 0.08,
            h * 0.08,
            w * 0.84,
            h * 0.38,
            this.colors.bodyShadow,
            0
        );

        // === SCREEN FRAME ===
        this.drawRect(
            w * 0.12,
            h - (h * 0.9),
            w * 0.76,
            h * 0.34,
            this.colors.screenFrame,
            12
        );

        // === SCREEN ===
        this.drawRect(
            w * 0.18,
            h - (h * 0.88),
            w * 0.64,
            h * 0.3,
            this.colors.screen,
            10
        );

        // === SIDE SCREEN BUTTONS ===
        for (let i = 0; i < 4; i++) {
            this.drawRect(w * 0.14, h * (0.2 + i * 0.04), 8, 16, '#90A4AE', 4);
            this.drawRect(w * 0.84, h * (0.2 + i * 0.04), 8, 16, '#90A4AE', 4);
        }

        // === KEYPAD AREA ===
        this.drawRect(
            w * 0.10,
            h * 0.46,
            w * 0.80,
            h * 0.32,
            this.colors.keypad,
            15
        );

        // === CASH SLOT ===
        this.drawRect(
            w * 0.35,
            h * 0.85,
            w * 0.3,
            h * 0.025,
            this.colors.slot,
            8
        );

        // === BOTTOM BRANDING ===
        // this.drawText('ATM', w / 2, h * 0.9, {
        //     font: 'bold 34px Arial',
        //     color: this.colors.text,
        //     align: 'center'
        // });

        // Existing features
        this.drawCardSlot();
        this.drawActionButtons();
        this.drawKeypad();
    }


    drawCardSlot() {
        const slotX = this.width * 0.70;
        const slotY = this.height * 0.5;
        const slotWidth = this.width * 0.17;
        const slotHeight = this.height * 0.025;

        // Draw card slot
        this.drawRect(slotX, slotY, slotWidth, slotHeight, '#222', 3);

        if (this.currentCard) {
            // Draw inserted card
            this.drawRect(
                slotX + this.width * 0.01,
                slotY - this.height * 0.02,
                slotWidth - this.width * 0.02,
                slotHeight * 1.4,
                '#1a2980',
                5
            );

            this.drawText('Inserted', slotX + this.width * 0.01, slotY - 10, {
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
        const buttonWidth = this.width * 0.17;
        const buttonHeight = this.height * 0.06;
        const buttonX = this.width * 0.70;
        const buttonSpacing = this.height * 0.08;

        for (let i = 0; i < 3; i++) {
            const buttonY = this.height * 0.55 + (i * buttonSpacing);

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
                        font: '12px bold Arial',
                        color: '#fff',
                        align: 'center',
                        baseline: 'middle'
                    }
                );
            }
        }
    }

    drawKeypad() {
        const { x, y, width, height } = this.keypadRect;

        const rows = 4;
        const cols = 3;
        const gap = width * 0.04;

        const keyW = (width * 0.9 - gap * (cols + 1)) / cols;
        const keyH = (height - gap * (rows + 1)) / rows;

        const keys = [
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['.', '0', '⌫']
        ];

        this.keyMap = []; // for click detection

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const key = keys[r][c];
                if (!key) continue;

                const keyX = x + gap + c * (keyW + gap);
                const keyY = y + gap + r * (keyH + gap);

                this.drawRect(keyX, keyY, keyW, keyH, '#616161', 6);

                this.drawText(
                    key,
                    keyX + keyW / 2,
                    keyY + keyH / 2,
                    {
                        font: key === '⌫' ? 'bold 20px Arial' : 'bold 22px Arial',
                        color: '#fff',
                        align: 'center',
                        baseline: 'middle'
                    }
                );

                this.keyMap.push({ key, x: keyX, y: keyY, w: keyW, h: keyH });
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