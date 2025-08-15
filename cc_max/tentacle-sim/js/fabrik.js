class FABRIKSolver {
    static solve(chain, target, tolerance = 0.5, maxIterations = 10) {
        if (chain.length < 2) return false;
        
        const basePosition = chain[0].copy();
        const totalLength = this.getTotalLength(chain);
        const distanceToTarget = Vector2.distance(basePosition, target);
        
        if (distanceToTarget > totalLength) {
            this.stretchToTarget(chain, target);
            return true;
        }
        
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            if (this.reachTarget(chain, target, tolerance)) {
                return true;
            }
            
            this.forwardReach(chain, target);
            this.backwardReach(chain, basePosition);
        }
        
        return false;
    }

    static getTotalLength(chain) {
        let totalLength = 0;
        for (let i = 0; i < chain.length - 1; i++) {
            totalLength += Vector2.distance(chain[i], chain[i + 1]);
        }
        return totalLength;
    }

    static getSegmentLengths(chain) {
        const lengths = [];
        for (let i = 0; i < chain.length - 1; i++) {
            lengths.push(Vector2.distance(chain[i], chain[i + 1]));
        }
        return lengths;
    }

    static stretchToTarget(chain, target) {
        const basePos = chain[0];
        const direction = Vector2.normalize(Vector2.subtract(target, basePos));
        const lengths = this.getSegmentLengths(chain);
        
        let currentPos = basePos;
        for (let i = 1; i < chain.length; i++) {
            currentPos = Vector2.add(currentPos, 
                Vector2.multiply(direction, lengths[i - 1]));
            chain[i].x = currentPos.x;
            chain[i].y = currentPos.y;
        }
    }

    static forwardReach(chain, target) {
        chain[chain.length - 1].x = target.x;
        chain[chain.length - 1].y = target.y;
        
        for (let i = chain.length - 2; i >= 0; i--) {
            const current = chain[i];
            const next = chain[i + 1];
            const segmentLength = Vector2.distance(current, next);
            
            const direction = Vector2.normalize(Vector2.subtract(current, next));
            const newPos = Vector2.add(next, Vector2.multiply(direction, segmentLength));
            
            current.x = newPos.x;
            current.y = newPos.y;
        }
    }

    static backwardReach(chain, basePosition) {
        chain[0].x = basePosition.x;
        chain[0].y = basePosition.y;
        
        for (let i = 1; i < chain.length; i++) {
            const previous = chain[i - 1];
            const current = chain[i];
            const segmentLength = Vector2.distance(previous, current);
            
            const direction = Vector2.normalize(Vector2.subtract(current, previous));
            const newPos = Vector2.add(previous, Vector2.multiply(direction, segmentLength));
            
            current.x = newPos.x;
            current.y = newPos.y;
        }
    }

    static reachTarget(chain, target, tolerance) {
        const endEffector = chain[chain.length - 1];
        return Vector2.distance(endEffector, target) <= tolerance;
    }

    static applyJointConstraints(chain, constraints) {
        for (let i = 1; i < chain.length - 1; i++) {
            if (constraints[i]) {
                this.constrainJoint(chain, i, constraints[i]);
            }
        }
    }

    static constrainJoint(chain, jointIndex, constraint) {
        const prev = chain[jointIndex - 1];
        const joint = chain[jointIndex];
        const next = chain[jointIndex + 1];
        
        const incomingAngle = Math.atan2(joint.y - prev.y, joint.x - prev.x);
        const outgoingAngle = Math.atan2(next.y - joint.y, next.x - joint.x);
        
        let angleDiff = outgoingAngle - incomingAngle;
        
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        
        const constrainedAngle = Math.max(constraint.min, 
            Math.min(constraint.max, angleDiff));
        
        const newOutgoingAngle = incomingAngle + constrainedAngle;
        const segmentLength = Vector2.distance(joint, next);
        
        next.x = joint.x + Math.cos(newOutgoingAngle) * segmentLength;
        next.y = joint.y + Math.sin(newOutgoingAngle) * segmentLength;
    }

    static solveMultiTarget(chain, targets, weights, tolerance = 0.5, maxIterations = 10) {
        if (targets.length !== weights.length) {
            throw new Error("Targets and weights arrays must have the same length");
        }
        
        const weightedTarget = this.calculateWeightedTarget(targets, weights);
        return this.solve(chain, weightedTarget, tolerance, maxIterations);
    }

    static calculateWeightedTarget(targets, weights) {
        let totalWeight = 0;
        let weightedX = 0;
        let weightedY = 0;
        
        for (let i = 0; i < targets.length; i++) {
            weightedX += targets[i].x * weights[i];
            weightedY += targets[i].y * weights[i];
            totalWeight += weights[i];
        }
        
        return new Vector2(weightedX / totalWeight, weightedY / totalWeight);
    }

    static solveCCD(chain, target, maxIterations = 10) {
        const basePosition = chain[0].copy();
        
        for (let iteration = 0; iteration < maxIterations; iteration++) {
            for (let i = chain.length - 2; i >= 0; i--) {
                const joint = chain[i];
                const endEffector = chain[chain.length - 1];
                
                const toEndEffector = Vector2.subtract(endEffector, joint);
                const toTarget = Vector2.subtract(target, joint);
                
                const angle1 = Math.atan2(toEndEffector.y, toEndEffector.x);
                const angle2 = Math.atan2(toTarget.y, toTarget.x);
                let deltaAngle = angle2 - angle1;
                
                while (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
                while (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;
                
                this.rotateChainFromJoint(chain, i, deltaAngle);
            }
            
            if (Vector2.distance(chain[chain.length - 1], target) < 1.0) {
                break;
            }
        }
        
        chain[0].x = basePosition.x;
        chain[0].y = basePosition.y;
        this.updateChainFromBase(chain);
    }

    static rotateChainFromJoint(chain, jointIndex, angle) {
        const joint = chain[jointIndex];
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        
        for (let i = jointIndex + 1; i < chain.length; i++) {
            const point = chain[i];
            const x = point.x - joint.x;
            const y = point.y - joint.y;
            
            point.x = joint.x + (x * cos - y * sin);
            point.y = joint.y + (x * sin + y * cos);
        }
    }

    static updateChainFromBase(chain) {
        for (let i = 1; i < chain.length; i++) {
            const prev = chain[i - 1];
            const current = chain[i];
            const length = Vector2.distance(prev, current);
            const direction = Vector2.normalize(Vector2.subtract(current, prev));
            
            current.x = prev.x + direction.x * length;
            current.y = prev.y + direction.y * length;
        }
    }
}