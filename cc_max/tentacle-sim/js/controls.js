class TentacleControls {
    constructor(tentacle, renderer) {
        this.tentacle = tentacle;
        this.renderer = renderer;
        this.mousePosition = new Vector2(400, 200);
        this.isMouseTracking = true;
        
        this.initializeControls();
        this.setupEventListeners();
    }

    initializeControls() {
        this.controls = {
            runSimBtn: document.getElementById('runSimBtn'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue'),
            curlinesSlider: document.getElementById('curlinesSlider'),
            curlinesValue: document.getElementById('curlinesValue'),
            rigidnessSlider: document.getElementById('rigidnessSlider'),
            rigidnessValue: document.getElementById('rigidnessValue'),
            randomnessSlider: document.getElementById('randomnessSlider'),
            randomnessValue: document.getElementById('randomnessValue')
        };

        this.updateSliderDisplays();
    }

    setupEventListeners() {
        this.controls.runSimBtn.addEventListener('click', () => this.toggleSimulation());
        
        this.controls.speedSlider.addEventListener('input', (e) => {
            this.updateParameter('speed', e.target.value);
            this.controls.speedValue.textContent = parseFloat(e.target.value).toFixed(1);
        });

        this.controls.curlinesSlider.addEventListener('input', (e) => {
            this.updateParameter('curlines', e.target.value);
            this.controls.curlinesValue.textContent = parseFloat(e.target.value).toFixed(1);
        });

        this.controls.rigidnessSlider.addEventListener('input', (e) => {
            this.updateParameter('rigidness', e.target.value);
            this.controls.rigidnessValue.textContent = parseFloat(e.target.value).toFixed(1);
        });

        this.controls.randomnessSlider.addEventListener('input', (e) => {
            this.updateParameter('randomness', e.target.value);
            this.controls.randomnessValue.textContent = parseFloat(e.target.value).toFixed(1);
        });

        const canvas = this.renderer.canvas;
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseenter', () => this.isMouseTracking = true);
        canvas.addEventListener('mouseleave', () => this.isMouseTracking = false);
        canvas.addEventListener('click', (e) => this.handleCanvasClick(e));

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        window.addEventListener('resize', () => this.handleResize());
    }

    updateParameter(name, value) {
        this.tentacle.setParameter(name, value);
    }

    updateSliderDisplays() {
        this.controls.speedValue.textContent = this.tentacle.parameters.speed.toFixed(1);
        this.controls.curlinesValue.textContent = this.tentacle.parameters.curlines.toFixed(1);
        this.controls.rigidnessValue.textContent = this.tentacle.parameters.rigidness.toFixed(1);
        this.controls.randomnessValue.textContent = this.tentacle.parameters.randomness.toFixed(1);
        
        this.controls.speedSlider.value = this.tentacle.parameters.speed;
        this.controls.curlinesSlider.value = this.tentacle.parameters.curlines;
        this.controls.rigidnessSlider.value = this.tentacle.parameters.rigidness;
        this.controls.randomnessSlider.value = this.tentacle.parameters.randomness;
    }

    toggleSimulation() {
        if (this.tentacle.isRunning) {
            this.tentacle.stop();
            this.controls.runSimBtn.textContent = 'Run Sim';
            this.controls.runSimBtn.classList.remove('running');
        } else {
            this.tentacle.start();
            this.controls.runSimBtn.textContent = 'Stop Sim';
            this.controls.runSimBtn.classList.add('running');
        }
    }

    handleMouseMove(e) {
        if (!this.isMouseTracking) return;
        
        const rect = this.renderer.canvas.getBoundingClientRect();
        const scaleX = this.renderer.canvas.width / rect.width;
        const scaleY = this.renderer.canvas.height / rect.height;
        
        this.mousePosition.x = (e.clientX - rect.left) * scaleX;
        this.mousePosition.y = (e.clientY - rect.top) * scaleY;
        
        this.tentacle.updateTarget(this.mousePosition);
    }

    handleCanvasClick(e) {
        const rect = this.renderer.canvas.getBoundingClientRect();
        const scaleX = this.renderer.canvas.width / rect.width;
        const scaleY = this.renderer.canvas.height / rect.height;
        
        const clickPos = new Vector2(
            (e.clientX - rect.left) * scaleX,
            (e.clientY - rect.top) * scaleY
        );
        
        this.mousePosition = clickPos;
        this.tentacle.updateTarget(this.mousePosition);
        
        if (!this.tentacle.isRunning) {
            this.toggleSimulation();
        }
    }

    handleKeyPress(e) {
        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                this.toggleSimulation();
                break;
            case 'd':
                this.renderer.toggleDebugMode();
                break;
            case 'r':
                this.resetTentacle();
                break;
            case '1':
                this.loadPreset('smooth');
                break;
            case '2':
                this.loadPreset('rigid');
                break;
            case '3':
                this.loadPreset('chaotic');
                break;
            case '4':
                this.loadPreset('slow');
                break;
            case 'arrowup':
                this.adjustParameter('speed', 0.1);
                break;
            case 'arrowdown':
                this.adjustParameter('speed', -0.1);
                break;
            case 'arrowleft':
                this.adjustParameter('rigidness', -0.1);
                break;
            case 'arrowright':
                this.adjustParameter('rigidness', 0.1);
                break;
        }
    }

    adjustParameter(name, delta) {
        const current = this.tentacle.parameters[name];
        const newValue = Math.max(0, Math.min(3, current + delta));
        
        this.tentacle.setParameter(name, newValue);
        
        const slider = document.getElementById(name + 'Slider');
        const display = document.getElementById(name + 'Value');
        
        if (slider && display) {
            slider.value = newValue;
            display.textContent = newValue.toFixed(1);
        }
    }

    loadPreset(presetName) {
        const presets = {
            smooth: {
                speed: 1.0,
                curlines: 0.3,
                rigidness: 0.7,
                randomness: 0.1
            },
            rigid: {
                speed: 0.8,
                curlines: 0.1,
                rigidness: 0.9,
                randomness: 0.0
            },
            chaotic: {
                speed: 2.0,
                curlines: 0.8,
                rigidness: 0.1,
                randomness: 0.7
            },
            slow: {
                speed: 0.3,
                curlines: 0.5,
                rigidness: 0.5,
                randomness: 0.3
            }
        };

        const preset = presets[presetName];
        if (!preset) return;

        Object.keys(preset).forEach(key => {
            this.tentacle.setParameter(key, preset[key]);
        });

        this.updateSliderDisplays();
        
        console.log(`Loaded preset: ${presetName}`);
    }

    resetTentacle() {
        this.tentacle.stop();
        this.controls.runSimBtn.textContent = 'Run Sim';
        this.controls.runSimBtn.classList.remove('running');
        
        const centerX = this.renderer.canvas.width / 2;
        const centerY = this.renderer.canvas.height / 2;
        
        this.tentacle.basePosition = new Vector2(centerX - 200, centerY);
        this.mousePosition = new Vector2(centerX + 200, centerY);
        
        this.tentacle.initializeSegments(8);
        this.tentacle.updateTarget(this.mousePosition);
    }

    handleResize() {
        const container = this.renderer.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        this.renderer.setCanvasSize(
            Math.min(800, rect.width - 40),
            Math.min(400, rect.height - 100)
        );
        
        this.resetTentacle();
    }

    getMousePosition() {
        return this.mousePosition.copy();
    }

    setMouseTracking(enabled) {
        this.isMouseTracking = enabled;
    }

    showHelp() {
        const helpText = `
Tentacle Simulation Controls:

Mouse: Move target position
Click: Set target and start simulation
Spacebar: Toggle simulation
D: Toggle debug mode
R: Reset tentacle

Presets:
1: Smooth movement
2: Rigid movement  
3: Chaotic movement
4: Slow movement

Arrow Keys:
Up/Down: Adjust speed
Left/Right: Adjust rigidness

Sliders:
- SPEED: Animation speed multiplier
- CURLINES: Adds sinusoidal movement patterns
- RIGIDNES: Joint stiffness (higher = less flexible)
- RANDOMNES: Procedural noise amplitude
        `;
        
        alert(helpText);
    }
}