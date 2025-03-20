class CandlestickChart {
    constructor(containerSelector, initialData) {
        // DOM Elements
        this.container = document.querySelector(containerSelector);
        this.canvas = this.container.querySelector('#myCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.labelCanvas = this.container.querySelector('#labelCanvas');
        this.labelCtx = this.labelCanvas.getContext('2d');
        this.tooltip = this.container.querySelector('#tooltip');
        this.selectionOverlay = this.container.querySelector('#selectionOverlay');
        
        // Configuration
        this.centerLineColor = '#007bff';
        this.data = initialData;
        
        // State
        this.state = {
            isSelecting: false,
            startX: 0,
            currentX: 0,
            dragStartTime: null,
            visibleRange: {
                start: 0,
                end: null
            },
            lastMouseX: null,
            lastMouseY: null
        }

        // Initialize
        this._bindEvents();
        this._draw();
    }

    _bindEvents() {
        this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
        this.canvas.addEventListener('dblclick', this._onDoubleClick.bind(this));
        this.canvas.addEventListener('mouseleave', this._onMouseLeave.bind(this));
        window.addEventListener('resize', this._draw.bind(this));
    }

    _onMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.state.isSelecting = true;
        this.state.dragStartTime = Date.now();
        this.state.startX = event.clientX - rect.left;
        this.state.currentX = this.state.startX;

        this._updateSelectionOverlay();
    }

    _onMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        if (this.state.isSelecting) {
            this.state.currentX = mouseX;
            this._updateSelectionOverlay();
        }

        this._drawCrosshair(mouseX, mouseY);
        this._updateTooltip(event, mouseX);
    }

    _onMouseUp(event) {
        if (!this.state.isSelecting) return;
        
        const dragDuration = Date.now() - this.state.dragStartTime;
        const isDragSignificant = Math.abs(this.state.currentX - this.state.startX) > 5;
        
        if (dragDuration < 200 && !isDragSignificant) {
            this._handleClick(event);
        } else {
            this._handleDragSelection();
        }
        
        this.state.isSelecting = false;
        this.selectionOverlay.style.display = 'none';
    }

    _onDoubleClick() {
        this._resetZoom();
    }

    _onMouseLeave() {
        this.tooltip.style.display = 'none';
        this._draw();
        this.state.lastMouseX = null;
        this.state.lastMouseY = null;
    }

    _updateSelectionOverlay() {
        const left = Math.min(this.state.startX, this.state.currentX);
        const width = Math.abs(this.state.currentX - this.state.startX);
        
        this.selectionOverlay.style.display = 'block';
        this.selectionOverlay.style.left = `${left}px`;
        this.selectionOverlay.style.width = `${width}px`;
        this.selectionOverlay.style.top = '0';
        this.selectionOverlay.style.height = '100%';
    }

    _handleClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const containerWidth = this.container.offsetWidth - 50;
        const clickedCandle = this._findClickedCandle(clickX, containerWidth);
        
        if (clickedCandle) {
            alert(
                `날짜: ${clickedCandle.date}\n` +
                `시가: ${clickedCandle.Open}\n` +
                `고가: ${clickedCandle.High}\n` +
                `저가: ${clickedCandle.Low}\n` +
                `종가: ${clickedCandle.Close}`
            );
        }
    }


    _handleDragSelection() {
        const containerWidth = this.container.offsetWidth - 50;
        const visibleData = this._getVisibleData();
        const { candleWidth, spacing } = this._calculateDimensions(containerWidth, visibleData.length);
        
        const startIndex = Math.floor(Math.min(this.state.startX, this.state.currentX) / (candleWidth + spacing));
        const endIndex = Math.ceil(Math.max(this.state.startX, this.state.currentX) / (candleWidth + spacing));
        
        if (Math.abs(endIndex - startIndex) > 1) {
            const currentStart = this.state.visibleRange.start;
            this.state.visibleRange = {
                start: currentStart + Math.max(0, startIndex),
                end: currentStart + Math.min(this.data.length - currentStart, endIndex)
            };
            this._draw();
        }
    }

    _calculateDimensions(containerWidth, dataLength) {
        const candleWidth = Math.max(10, (containerWidth / dataLength) - 5);
        const spacing = Math.min(5, (containerWidth / dataLength) - candleWidth);
        return { candleWidth, spacing };
    }

    _getVisibleData() {
        return this.data.slice(
            this.state.visibleRange.start,
            this.state.visibleRange.end || this.data.length
        );
    }

    _findClickedCandle(x, containerWidth) {
        const visibleData = this._getVisibleData();
        const { candleWidth, spacing } = this._calculateDimensions(containerWidth, visibleData.length);

        for (let i = 0; i < visibleData.length; i++) {
            const candleX = i * (candleWidth + spacing);
            if (x >= candleX && x <= candleX + candleWidth) {
                return visibleData[i];
            }
        }
        return null;
    }

    _drawCrosshair(x, y) {
        this._draw();

        this.ctx.save();
        this.ctx.strokeStyle = '#999';
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineWidth = 0.5;

        // Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.stroke();

        // Horizontal line
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.stroke();

        this.ctx.restore();

        this.state.lastMouseX = x;
        this.state.lastMouseY = y;
    }

    _updateTooltip(event, x) {
        const containerWidth = this.container.offsetWidth - 50;
        const visibleData = this._getVisibleData();
        const { candleWidth, spacing } = this._calculateDimensions(containerWidth, visibleData.length);

        let found = false;
        visibleData.forEach((d, i) => {
            const candleX = i * (candleWidth + spacing);
            if (x >= candleX && x <= candleX + candleWidth) {
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = `${event.pageX + 10}px`;
                this.tooltip.style.top = `${event.pageY + 10}px`;
                this.tooltip.innerHTML = `
                    Date: ${d.date}<br>
                    Open: ${d.Open}<br>
                    High: ${d.High}<br>
                    Low: ${d.Low}<br>
                    Close: ${d.Close}
                `;
                found = true;
            }
        });

        if (!found) {
            this.tooltip.style.display = 'none';
        }
    }

    _draw() {
        const containerWidth = this.container.offsetWidth - 50;
        const visibleData = this._getVisibleData();
        const { candleWidth, spacing } = this._calculateDimensions(containerWidth, visibleData.length);
        
        // Resize canvas
        this.canvas.width = containerWidth;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculate price range
        const maxPrice = Math.max(...visibleData.map(d => d.High));
        const minPrice = Math.min(...visibleData.map(d => d.Low));
        const centerPrice = (maxPrice + minPrice) / 2;

        // Draw candles
        visibleData.forEach((candle, i) => {
            const x = i * (candleWidth + spacing);
            const scaleY = this.canvas.height / (maxPrice - minPrice);
            
            const openY = this.canvas.height - (candle.Open - minPrice) * scaleY;
            const closeY = this.canvas.height - (candle.Close - minPrice) * scaleY;
            const highY = this.canvas.height - (candle.High - minPrice) * scaleY;
            const lowY = this.canvas.height - (candle.Low - minPrice) * scaleY;

            // Draw wick
            this.ctx.beginPath();
            this.ctx.moveTo(x + candleWidth / 2, highY);
            this.ctx.lineTo(x + candleWidth / 2, lowY);
            this.ctx.strokeStyle = 'black';
            this.ctx.stroke();

            // Draw body
            this.ctx.fillStyle = candle.Open > candle.Close ? '#ff4d4d' : '#4caf50';
            this.ctx.fillRect(x, Math.min(openY, closeY), candleWidth, Math.abs(openY - closeY));
        });

        // Draw center line
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.strokeStyle = this.centerLineColor;
        this.ctx.stroke();

        // Draw price labels
        this._drawPriceLabels(minPrice, maxPrice, centerPrice);
    }

    _drawPriceLabels(minPrice, maxPrice, centerPrice) {
        const labelCount = 10;
        this.labelCtx.clearRect(0, 0, this.labelCanvas.width, this.labelCanvas.height);

        // Draw price scale
        for (let i = 0; i <= labelCount; i++) {
            const price = minPrice + (i / labelCount) * (maxPrice - minPrice);
            const y = this.labelCanvas.height - (i / labelCount) * this.labelCanvas.height;
            this.labelCtx.fillStyle = 'black';
            this.labelCtx.fillText(price.toFixed(2), 5, y);
        }

        // Draw center price
        const centerY = this.labelCanvas.height / 2;
        const labelText = centerPrice.toFixed(2);
        const boxPadding = 4;
        const boxWidth = this.labelCtx.measureText(labelText).width + 2 * boxPadding;
        const boxHeight = 16;

        this.labelCtx.fillStyle = this.centerLineColor;
        this.labelCtx.fillRect(2, centerY - boxHeight/2, boxWidth, boxHeight);
        
        this.labelCtx.fillStyle = 'white';
        this.labelCtx.font = 'bold 12px Arial';
        this.labelCtx.fillText(labelText, 2 + boxPadding, centerY + 4);
    }

    _resetZoom() {
        this.state.visibleRange = {
            start: 0,
            end: null
        };
        this._draw();
    }

    // Public methods
    addRandomData() {
        const lastData = this.data[this.data.length - 1];
        const newDate = new Date(lastData.date);
        newDate.setDate(newDate.getDate() + 1);
        
        const newData = {
            date: newDate.toISOString().split('T')[0],
            Open: lastData.Close,
            Close: lastData.Close + (Math.random() - 0.5) * 20,
            High: 0,
            Low: 0
        };
        
        newData.High = Math.max(newData.Open, newData.Close) + Math.random() * 10;
        newData.Low = Math.min(newData.Open, newData.Close) - Math.random() * 10;
        
        this.data.push(newData);
        this._draw();
    }
}

// Initialize chart
document.addEventListener('DOMContentLoaded', () => {
    const initialData = [
        { date: '2024-12-01', Open: 100, High: 110, Low: 90, Close: 105 },
        { date: '2024-12-02', Open: 105, High: 115, Low: 95, Close: 110 },
        { date: '2024-12-03', Open: 110, High: 120, Low: 100, Close: 115 },
        { date: '2024-12-04', Open: 115, High: 125, Low: 105, Close: 120 },
        { date: '2024-12-05', Open: 120, High: 130, Low: 110, Close: 125 },
    ];
    
    const chart = new CandlestickChart('#chartContainer', initialData);
    
    document.getElementById('addDataBtn').addEventListener('click', () => {
        chart.addRandomData();
    });
});