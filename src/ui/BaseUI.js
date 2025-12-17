// src/ui/BaseUI.js
class BaseUI {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    drawText(text, x, y, options = {}) {
        const {
            font = '16px Arial',
            color = '#000',
            align = 'left',
            baseline = 'top'
        } = options;

        this.ctx.save();
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    drawRect(x, y, width, height, color, radius = 0) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        
        if (radius > 0) {
            this.roundRect(x, y, width, height, radius);
            this.ctx.fill();
        } else {
            this.ctx.fillRect(x, y, width, height);
        }

        this.ctx.restore();
    }

    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    drawLine(x1, y1, x2, y2, color = '#000', width = 1) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawCircle(x, y, radius, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}