class TentacleSimulationApp {
    constructor() {
        this.canvas = null;
        this.renderer = null;
        this.tentacle = null;
        this.controls = null;
        
        this.animationId = null;
        this.lastFrameTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        this.fpsUpdateInterval = 60;
        
        this.isInitialized = false;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApplication());
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        try {
            this.initializeCanvas();
            this.initializeTentacle();
            this.initializeRenderer();
            this.initializeControls();
            
            this.startAnimationLoop();
            this.isInitialized = true;
            
            console.log('Tentacle Simulation initialized successfully');
            this.displayWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to initialize Tentacle Simulation:', error);
            this.displayErrorMessage(error);
        }
    }

    initializeCanvas() {
        this.canvas = document.getElementById('tentacleCanvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = 800;
        this.canvas.height = 400;
        
        const ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('2D context not supported');
        }
    }

    initializeTentacle() {
        const baseX = this.canvas.width * 0.25; // Left side of canvas
        const baseY = this.canvas.height * 0.5; // Center vertically
        
        this.tentacle = new Tentacle(new Vector2(baseX, baseY), 8);
        
        const targetX = this.canvas.width * 0.75; // Right side of canvas  
        const targetY = this.canvas.height * 0.5; // Center vertically
        
        this.tentacle.updateTarget(new Vector2(targetX, targetY));
    }

    initializeRenderer() {
        this.renderer = new TentacleRenderer(this.canvas);
    }

    initializeControls() {
        this.controls = new TentacleControls(this.tentacle, this.renderer);
    }

    startAnimationLoop() {
        this.lastFrameTime = performance.now();
        this.animate();
    }

    animate(currentTime = performance.now()) {
        this.animationId = requestAnimationFrame((time) => this.animate(time));
        
        const deltaTime = currentTime - this.lastFrameTime;
        
        if (deltaTime >= this.frameInterval) {
            this.update(deltaTime);
            this.render();
            
            this.updateFPS(deltaTime);
            this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
        }
    }

    update(deltaTime) {
        if (this.tentacle.isRunning) {
            // Update tentacle physics
            this.tentacle.update();
            
            // Update target based on mouse position and procedural movement
            const mousePos = this.controls.getMousePosition();
            this.tentacle.updateTarget(mousePos);
        }
    }

    render() {
        this.renderer.clear();
        
        if (this.tentacle.segments.length > 0) {
            this.renderer.renderTentacle(this.tentacle);
        }
        
        if (this.controls.isMouseTracking && this.tentacle.isRunning) {
            this.renderer.renderMousePosition(this.controls.getMousePosition());
        }
        
        if (this.renderer.debugMode) {
            this.renderer.renderPerformanceInfo(this.fps, this.tentacle);
        }
    }

    updateFPS(deltaTime) {
        this.frameCount++;
        
        if (this.frameCount >= this.fpsUpdateInterval) {
            this.fps = 1000 / (deltaTime / this.fpsUpdateInterval);
            this.frameCount = 0;
            
            if (this.fps < 30) {
                console.warn('Low FPS detected:', this.fps.toFixed(1));
            }
        }
    }

    displayWelcomeMessage() {
        console.log(`
╔══════════════════════════════════════╗
║        Tentacle Simulation           ║
║                                      ║
║  Controls:                           ║
║  • Mouse: Move target                ║
║  • Click: Set target & start         ║
║  • Spacebar: Toggle simulation       ║
║  • D: Debug mode                     ║
║  • R: Reset                          ║
║  • 1-4: Load presets                 ║
║                                      ║
║  Use sliders to adjust parameters    ║
╚══════════════════════════════════════╝
        `);
    }

    displayErrorMessage(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            z-index: 1000;
            max-width: 400px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3>Initialization Error</h3>
            <p>${error.message}</p>
            <button onclick="this.parentElement.remove()" 
                    style="background: white; color: #ff4444; border: none; 
                           padding: 8px 16px; border-radius: 4px; margin-top: 10px;">
                Close
            </button>
        `;
        document.body.appendChild(errorDiv);
    }

    // Performance optimization methods
    optimizePerformance() {
        // Reduce update frequency for complex calculations
        if (this.fps < 40) {
            this.targetFPS = 30;
            this.frameInterval = 1000 / this.targetFPS;
            console.log('Performance mode: Reduced to 30 FPS');
        } else if (this.fps > 55 && this.targetFPS === 30) {
            this.targetFPS = 60;
            this.frameInterval = 1000 / this.targetFPS;
            console.log('Performance mode: Restored to 60 FPS');
        }
    }

    // Public API methods
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.animationId) {
            this.startAnimationLoop();
        }
    }

    reset() {
        this.controls.resetTentacle();
    }

    loadPreset(presetName) {
        this.controls.loadPreset(presetName);
    }

    toggleDebug() {
        this.renderer.toggleDebugMode();
    }

    exportFrame() {
        return this.renderer.exportFrame();
    }

    getStats() {
        return {
            fps: this.fps,
            isRunning: this.tentacle ? this.tentacle.isRunning : false,
            segments: this.tentacle ? this.tentacle.segments.length : 0,
            parameters: this.tentacle ? { ...this.tentacle.parameters } : {}
        };
    }

    destroy() {
        this.pause();
        
        if (this.controls) {
            // Remove event listeners would go here if we had a cleanup method
        }
        
        this.canvas = null;
        this.renderer = null;
        this.tentacle = null;
        this.controls = null;
        
        console.log('Tentacle Simulation destroyed');
    }
}

// Auto-start when page loads
let app = null;

window.addEventListener('load', () => {
    app = new TentacleSimulationApp();
});

// Expose API to window for debugging and external control
window.TentacleSimAPI = {
    pause: () => app?.pause(),
    resume: () => app?.resume(),
    reset: () => app?.reset(),
    loadPreset: (name) => app?.loadPreset(name),
    toggleDebug: () => app?.toggleDebug(),
    exportFrame: () => app?.exportFrame(),
    getStats: () => app?.getStats()
};

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (app) {
        if (document.hidden) {
            app.pause();
        } else {
            app.resume();
        }
    }
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (app && app.controls) {
            app.controls.handleResize();
        }
    }, 250);
});