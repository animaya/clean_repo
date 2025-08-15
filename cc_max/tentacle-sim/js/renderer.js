class TentacleRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animationId = null;
        this.debugMode = false;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fafafa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderTentacle(tentacle) {
        if (tentacle.segments.length === 0) return;

        this.renderSegments(tentacle);
        this.renderJoints(tentacle);
        
        if (this.debugMode) {
            this.renderDebugInfo(tentacle);
        }
    }

    renderSegments(tentacle) {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        for (let i = 0; i < tentacle.segments.length; i++) {
            const segment = tentacle.segments[i];
            let endPos;
            
            if (i < tentacle.segments.length - 1) {
                endPos = tentacle.segments[i + 1].position;
            } else {
                endPos = new Vector2(
                    segment.position.x + Math.cos(segment.angle) * segment.length,
                    segment.position.y + Math.sin(segment.angle) * segment.length
                );
            }

            const hue = this.getSegmentHue(i, tentacle.segments.length);
            const saturation = 70;
            const lightness = 60 - (i * 2.5); // Slower darkening for more segments
            
            this.ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            this.ctx.lineWidth = segment.thickness * 0.8; // Slightly thinner than joints
            
            this.ctx.beginPath();
            this.ctx.moveTo(segment.position.x, segment.position.y);
            this.ctx.lineTo(endPos.x, endPos.y);
            this.ctx.stroke();
        }
    }

    renderJoints(tentacle) {
        for (let i = 0; i < tentacle.segments.length; i++) {
            const segment = tentacle.segments[i];
            
            const hue = this.getSegmentHue(i, tentacle.segments.length);
            const saturation = 80;
            const lightness = 50 - (i * 1.5); // Reduced lightness change for more segments
            
            this.ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 1;
            
            this.ctx.beginPath();
            this.ctx.arc(
                segment.position.x, 
                segment.position.y, 
                segment.thickness * 0.5, 
                0, 
                2 * Math.PI
            );
            this.ctx.fill();
            this.ctx.stroke();
        }

        const endEffector = tentacle.getEndEffectorPosition();
        const lastSegment = tentacle.segments[tentacle.segments.length - 1];
        const hue = this.getSegmentHue(tentacle.segments.length, tentacle.segments.length);
        
        this.ctx.fillStyle = `hsl(${hue}, 90%, 45%)`;
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        this.ctx.arc(
            endEffector.x, 
            endEffector.y, 
            lastSegment.thickness * 0.3, 
            0, 
            2 * Math.PI
        );
        this.ctx.fill();
        this.ctx.stroke();
    }

    getSegmentHue(index, totalSegments) {
        const progress = index / Math.max(1, totalSegments - 1);
        
        return 30 + progress * 90;
    }

    renderDebugInfo(tentacle) {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(tentacle.target.x, tentacle.target.y, 10, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.strokeStyle = 'green';
        
        this.ctx.beginPath();
        this.ctx.arc(tentacle.basePosition.x, tentacle.basePosition.y, 8, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();

        for (let i = 0; i < tentacle.segments.length; i++) {
            const segment = tentacle.segments[i];
            
            this.ctx.strokeStyle = 'blue';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(segment.position.x, segment.position.y);
            this.ctx.lineTo(
                segment.position.x + Math.cos(segment.angle) * 20,
                segment.position.y + Math.sin(segment.angle) * 20
            );
            this.ctx.stroke();
        }
    }

    renderBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#fafafa');
        gradient.addColorStop(1, '#f0f0f0');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    renderMousePosition(mousePos) {
        if (!mousePos) return;
        
        this.ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(mousePos.x, mousePos.y, 5, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    renderPerformanceInfo(fps, tentacle) {
        if (!this.debugMode) return;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`FPS: ${fps.toFixed(1)}`, 20, 30);
        this.ctx.fillText(`Segments: ${tentacle.segments.length}`, 20, 50);
        this.ctx.fillText(`Running: ${tentacle.isRunning}`, 20, 70);
        
        const endEffector = tentacle.getEndEffectorPosition();
        const distance = Vector2.distance(endEffector, tentacle.target);
        this.ctx.fillText(`Target Distance: ${distance.toFixed(1)}`, 20, 90);
    }

    toggleDebugMode() {
        this.debugMode = !this.debugMode;
    }

    setCanvasSize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.ctx.scale(dpr, dpr);
    }

    exportFrame() {
        return this.canvas.toDataURL('image/png');
    }
}