class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static distance(a, b) {
        return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
    }

    static normalize(v) {
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(v.x / len, v.y / len);
    }

    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static subtract(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static multiply(v, scalar) {
        return new Vector2(v.x * scalar, v.y * scalar);
    }

    copy() {
        return new Vector2(this.x, this.y);
    }
}

class TentacleSegment {
    constructor(position, length, thickness, hue) {
        this.position = position.copy();
        this.length = length;
        this.thickness = thickness;
        this.hue = hue;
        this.angle = 0;
        this.targetAngle = 0;
        this.angleConstraint = Math.PI / 4; // ±45 degrees for balanced flexibility
    }

    getEndPosition() {
        return new Vector2(
            this.position.x + Math.cos(this.angle) * this.length,
            this.position.y + Math.sin(this.angle) * this.length
        );
    }

    applyAngleConstraint(baseAngle) {
        const deltaAngle = this.angle - baseAngle;
        const constrainedDelta = Math.max(-this.angleConstraint, 
                                         Math.min(this.angleConstraint, deltaAngle));
        this.angle = baseAngle + constrainedDelta;
    }
}

class Tentacle {
    constructor(basePosition, segmentCount = 16) {
        this.basePosition = basePosition.copy();
        this.segments = [];
        this.target = basePosition.copy();
        this.smoothTarget = basePosition.copy();
        this.targetVelocity = new Vector2(0, 0);
        this.parameters = {
            speed: 1.0,
            curlines: 0.5,
            rigidness: 0.3,
            randomness: 0.2,
            smoothing: 0.05,
            damping: 0.95
        };
        
        this.initializeSegments(segmentCount);
        this.time = 0;
        this.isRunning = false;
    }

    initializeSegments(count) {
        const baseLength = 90; // Increased from 60 to 90 (1.5x)
        const baseThickness = 40;
        const lengthReduction = 0.92; // Slower reduction for more segments
        const thicknessReduction = 0.92; // Slower reduction for more segments
        
        let currentPos = this.basePosition.copy();
        
        for (let i = 0; i < count; i++) {
            const length = baseLength * Math.pow(lengthReduction, i);
            const thickness = baseThickness * Math.pow(thicknessReduction, i);
            const hue = 30 + (i / count) * 90; // Orange to light green progression
            
            const segment = new TentacleSegment(currentPos, length, thickness, hue);
            this.segments.push(segment);
            
            currentPos = segment.getEndPosition();
        }
    }

    updateTarget(mousePos) {
        if (!this.isRunning) return;
        
        this.time += 0.016 * this.parameters.speed;
        
        let targetPos = mousePos.copy();
        
        if (this.parameters.curlines > 0) {
            const curlOffset = Math.sin(this.time * 2) * 50 * this.parameters.curlines;
            targetPos.x += curlOffset;
        }
        
        if (this.parameters.randomness > 0) {
            const noiseX = (Math.sin(this.time * 3.7) + Math.cos(this.time * 2.3)) * 
                          30 * this.parameters.randomness;
            const noiseY = (Math.cos(this.time * 2.9) + Math.sin(this.time * 3.1)) * 
                          30 * this.parameters.randomness;
            targetPos.x += noiseX;
            targetPos.y += noiseY;
        }
        
        // Apply smoothing to reduce jittery movement
        const deltaX = targetPos.x - this.smoothTarget.x;
        const deltaY = targetPos.y - this.smoothTarget.y;
        
        // Update velocity with momentum
        this.targetVelocity.x = this.targetVelocity.x * this.parameters.damping + deltaX * this.parameters.smoothing;
        this.targetVelocity.y = this.targetVelocity.y * this.parameters.damping + deltaY * this.parameters.smoothing;
        
        // Update smooth target position
        this.smoothTarget.x += this.targetVelocity.x;
        this.smoothTarget.y += this.targetVelocity.y;
        
        this.target = this.smoothTarget.copy();
    }

    update() {
        if (!this.isRunning) return;
        
        this.solveFABRIK();
        this.applyConstraints();
    }

    solveFABRIK(iterations = 3) {
        for (let iter = 0; iter < iterations; iter++) {
            this.forwardReach();
            this.backwardReach();
        }
    }

    forwardReach() {
        if (this.segments.length === 0) return;
        
        let currentTarget = this.target.copy();
        
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];
            const direction = Vector2.subtract(currentTarget, segment.position);
            const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            
            if (distance > 0) {
                const normalizedDir = Vector2.multiply(direction, 1 / distance);
                segment.position = Vector2.subtract(currentTarget, 
                    Vector2.multiply(normalizedDir, segment.length));
                segment.angle = Math.atan2(normalizedDir.y, normalizedDir.x);
            }
            
            currentTarget = segment.position.copy();
        }
    }

    backwardReach() {
        if (this.segments.length === 0) return;
        
        let currentPos = this.basePosition.copy();
        this.segments[0].position = currentPos.copy();
        
        for (let i = 1; i < this.segments.length; i++) {
            const prevSegment = this.segments[i - 1];
            const currentSegment = this.segments[i];
            
            const direction = Vector2.subtract(currentSegment.position, prevSegment.position);
            const distance = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
            
            if (distance > 0) {
                const normalizedDir = Vector2.multiply(direction, 1 / distance);
                currentSegment.position = Vector2.add(prevSegment.position,
                    Vector2.multiply(normalizedDir, prevSegment.length));
                currentSegment.angle = Math.atan2(normalizedDir.y, normalizedDir.x);
            }
            
            currentPos = currentSegment.position.copy();
        }
    }

    applyConstraints() {
        const rigidnessFactor = this.parameters.rigidness;
        
        // Only apply constraints if rigidness is significant
        if (rigidnessFactor < 0.1) return;
        
        for (let i = 1; i < this.segments.length; i++) {
            const segment = this.segments[i];
            const prevSegment = this.segments[i - 1];
            
            // Calculate current angle from positions (FABRIK-determined)
            const direction = Vector2.subtract(segment.position, prevSegment.position);
            const currentAngle = Math.atan2(direction.y, direction.x);
            
            // Progressive flexibility - tips are more flexible
            const flexibilityMultiplier = 1.0 + (i / this.segments.length) * 0.3;
            const maxAngleDiff = segment.angleConstraint * flexibilityMultiplier * (1 - rigidnessFactor * 0.5);
            
            // Calculate angle difference
            let angleDiff = currentAngle - prevSegment.angle;
            
            // Normalize angle difference to [-π, π]
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            const constrainedDiff = Math.max(-maxAngleDiff, 
                                           Math.min(maxAngleDiff, angleDiff));
            
            // Only modify if constraint is violated
            if (Math.abs(angleDiff) > maxAngleDiff) {
                const targetAngle = prevSegment.angle + constrainedDiff;
                
                // Maintain segment length while adjusting angle
                const segmentLength = Vector2.distance(prevSegment.position, segment.position);
                const newEndPos = new Vector2(
                    prevSegment.position.x + Math.cos(targetAngle) * segmentLength,
                    prevSegment.position.y + Math.sin(targetAngle) * segmentLength
                );
                
                // Smooth the position adjustment
                segment.position.x = segment.position.x * 0.7 + newEndPos.x * 0.3;
                segment.position.y = segment.position.y * 0.7 + newEndPos.y * 0.3;
            }
            
            // Update segment angle based on final position
            const finalDirection = Vector2.subtract(segment.position, prevSegment.position);
            segment.angle = Math.atan2(finalDirection.y, finalDirection.x);
        }
    }

    setParameter(name, value) {
        if (this.parameters.hasOwnProperty(name)) {
            this.parameters[name] = parseFloat(value);
        }
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    getEndEffectorPosition() {
        if (this.segments.length === 0) return this.basePosition.copy();
        
        const lastSegment = this.segments[this.segments.length - 1];
        return new Vector2(
            lastSegment.position.x + Math.cos(lastSegment.angle) * lastSegment.length,
            lastSegment.position.y + Math.sin(lastSegment.angle) * lastSegment.length
        );
    }
}