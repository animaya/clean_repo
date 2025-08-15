# Tentacle Simulation

A realistic 2D tentacle simulation using advanced inverse kinematics algorithms and biomechanically-inspired movement patterns.

![Tentacle Simulation](screenshot.png)

## Features

- **FABRIK Algorithm**: Forward And Backward Reaching Inverse Kinematics for realistic joint movement
- **Progressive Visualization**: Distinct colors and reducing sizes from base to tip
- **Interactive Controls**: Real-time parameter adjustment via sliders
- **Mouse Following**: Dynamic target tracking with smooth movement
- **Procedural Animation**: Sine wave patterns and noise-based organic movement
- **Constraint System**: Joint angle limits and segment length preservation
- **Performance Optimized**: 60fps rendering with automatic performance scaling

## Mathematical Foundation

### FABRIK (Forward And Backward Reaching Inverse Kinematics)
The simulation uses the FABRIK algorithm, which solves inverse kinematics through:
1. **Forward Reach**: Moving from end-effector toward target
2. **Backward Reach**: Restoring base position and propagating changes
3. **Constraint Application**: Joint angle limits and flexibility control

### Biomechanical Modeling
Based on research of cephalopod tentacle biomechanics:
- Variable segment stiffness
- Progressive size reduction
- Natural movement constraints
- Organic noise patterns

## Controls

### Mouse Controls
- **Move**: Hover to set target position
- **Click**: Set target and start simulation

### Keyboard Shortcuts
- **Spacebar**: Toggle simulation on/off
- **D**: Toggle debug mode
- **R**: Reset tentacle to default position
- **1-4**: Load movement presets
- **Arrow Keys**: Adjust speed (↑↓) and rigidness (←→)

### Parameter Sliders

#### SPEED (0.1 - 3.0)
- Controls animation speed multiplier
- Higher values = faster movement
- Lower values = smoother, more controlled motion

#### CURLINES (0.0 - 1.0)
- Adds sinusoidal movement patterns
- Creates natural undulation and flowing motion
- 0 = straight movement, 1 = maximum curvature

#### RIGIDNES (0.0 - 1.0)
- Joint stiffness control
- Higher values = less flexible, more rigid movement
- Lower values = more fluid, snake-like motion

#### RANDOMNES (0.0 - 1.0)
- Procedural noise amplitude
- Adds organic, lifelike movement variations
- Creates realistic biological movement patterns

## Presets

### Preset 1 - Smooth
- Balanced parameters for natural movement
- Good for demonstration purposes

### Preset 2 - Rigid
- High rigidness for robotic-like movement
- Minimal randomness and curvature

### Preset 3 - Chaotic  
- Maximum randomness and curvature
- Fast, unpredictable movement patterns

### Preset 4 - Slow
- Reduced speed with balanced parameters
- Ideal for studying movement mechanics

## File Structure

```
tentacle-sim/
├── index.html          # Main UI layout
├── css/
│   └── styles.css      # Interface styling
├── js/
│   ├── tentacle.js     # Core tentacle physics
│   ├── fabrik.js       # FABRIK algorithm implementation  
│   ├── renderer.js     # Canvas rendering system
│   ├── controls.js     # UI controls and interactions
│   └── app.js         # Main application controller
└── README.md          # This documentation
```

## Technical Implementation

### Core Classes

#### `Tentacle`
- Manages segment chain and physics
- Implements FABRIK solver
- Handles parameter updates
- Applies movement constraints

#### `TentacleRenderer`  
- Progressive color rendering (orange → yellow → green)
- Size reduction from base to tip
- Debug visualization modes
- Performance monitoring

#### `TentacleControls`
- Mouse tracking and interaction
- Slider parameter binding  
- Keyboard shortcut handling
- Preset management

#### `TentacleSimulationApp`
- Animation loop management
- Performance optimization
- Component orchestration
- Error handling

### Performance Features

- **Adaptive FPS**: Automatically reduces frame rate under load
- **Efficient Rendering**: Optimized canvas operations
- **Smart Updates**: Only updates when simulation is running
- **Memory Management**: Proper cleanup and resource management

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support

Requires HTML5 Canvas and ES6 JavaScript support.

## Usage Example

```javascript
// Access the simulation API
const stats = window.TentacleSimAPI.getStats();
console.log('FPS:', stats.fps);

// Load a preset
window.TentacleSimAPI.loadPreset('chaotic');

// Export current frame
const imageData = window.TentacleSimAPI.exportFrame();
```

## Research References

Based on scientific research in:
- Cephalopod biomechanics and motor control
- FABRIK inverse kinematics algorithms  
- Continuum robotics and soft-body physics
- Bio-inspired movement generation

## Development

To run locally:
1. Clone repository
2. Open `index.html` in browser
3. No build process required

For development with live reload:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## Performance Tuning

The simulation automatically optimizes performance but can be manually tuned:

- Reduce segment count for better performance
- Lower update frequency in `app.js`
- Disable debug mode for production
- Adjust FABRIK iteration count in `tentacle.js`

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create feature branch
3. Add tests if applicable  
4. Submit pull request

Focus areas for contribution:
- Additional movement presets
- Enhanced constraint systems
- Mobile touch controls
- WebGL acceleration