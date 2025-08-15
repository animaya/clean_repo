# Agent Coordination & Workflow Patterns

## Multi-Agent Orchestration Framework

### Parallel Processing Rules
**Simultaneous Agent Activation:**
- Router Agent can activate multiple platform agents simultaneously
- Style agents can be applied to platform agent outputs
- Maximum recommended concurrent agents: 5 (to maintain quality control)
- Each agent operates independently but shares brand context

**Agent Combination Strategies:**
1. **Platform-First**: Activate multiple platform agents for same topic
2. **Style-First**: Apply multiple styles to same content, then adapt to platforms
3. **Hybrid**: Platform agents with specific style instructions
4. **Sequential**: One agent output becomes input for another agent

### Agent Selection Matrix

#### Content Goal → Agent Selection
**Brand Awareness:**
- Primary: Instagram Visual + Twitter Engagement
- Secondary: LinkedIn Professional + Facebook Community
- Style: Inspirational + Storytelling

**Lead Generation:**
- Primary: LinkedIn Professional + Facebook Community
- Secondary: Twitter Engagement (for traffic driving)
- Style: Professional + Educational

**Engagement/Community Building:**
- Primary: Twitter Engagement + Instagram Visual + Facebook Community
- Secondary: TikTok Trend (if audience appropriate)
- Style: Conversational + Humorous (if brand appropriate)

**Thought Leadership:**
- Primary: LinkedIn Professional + Twitter Engagement
- Secondary: YouTube Educational (if applicable)
- Style: Professional + Technical/Educational

**Product Launch:**
- Primary: All platform agents activated
- Secondary: All style agents for variety
- Approach: Coordinated campaign across platforms

## Workflow Orchestration Patterns

### Pattern 1: Topic Explosion
**Use Case:** Single topic needs content for multiple platforms
**Process:**
1. Router Agent receives topic and requirements
2. Activates 3-5 platform agents simultaneously
3. Each platform agent generates 3 variations
4. Router compiles and presents organized options
5. Human selects preferred variations for each platform

**TodoWrite Structure:**
```
- Activate LinkedIn Agent for [topic]
- Activate Twitter Agent for [topic]  
- Activate Instagram Agent for [topic]
- Activate Facebook Agent for [topic]
- Compile and organize platform-specific variations
- Present options to human for selection
```

### Pattern 2: Style Exploration
**Use Case:** Explore different messaging approaches for same content
**Process:**
1. Router Agent receives topic and platform preference
2. Activates 3-4 style agents for chosen platform
3. Each style agent generates content in their approach
4. Router presents style variations for comparison
5. Human selects preferred style approach

**TodoWrite Structure:**
```
- Apply Professional style to [topic] for [platform]
- Apply Conversational style to [topic] for [platform]
- Apply Educational style to [topic] for [platform]
- Compare style effectiveness and brand alignment
- Present style options with recommendations
```

### Pattern 3: Campaign Coordination
**Use Case:** Multi-platform campaign with consistent messaging
**Process:**
1. Router Agent receives campaign theme and timeline
2. Develops master messaging framework
3. Activates all relevant platform agents with campaign brief
4. Ensures message consistency while allowing platform optimization
5. Creates campaign calendar with coordinated posting schedule

**TodoWrite Structure:**
```
- Develop campaign messaging framework for [theme]
- Brief all platform agents on campaign requirements
- Generate coordinated content variations per platform
- Create posting timeline with optimal scheduling
- Prepare campaign launch materials
- Set up performance tracking framework
```

### Pattern 4: Content Series Development
**Use Case:** Multi-part educational or storytelling series
**Process:**
1. Router Agent receives series concept and scope
2. Breaks series into individual topics/episodes
3. Assigns different angles to appropriate agents
4. Ensures series coherence across all parts
5. Develops series arc and engagement strategy

**TodoWrite Structure:**
```
- Outline [series name] with [X] parts
- Assign series part 1 to [appropriate agent]
- Assign series part 2 to [appropriate agent]
- Ensure series coherence and progression
- Develop series promotion and cross-linking strategy
- Create series completion celebration content
```

## Agent Communication Protocols

### Information Sharing Between Agents
**Shared Context:**
- All agents access same brand template files
- Successful content patterns shared across agents
- Performance feedback incorporated into future generations
- Brand voice consistency maintained across all agents

**Agent-to-Agent Handoffs:**
- Platform agent output can be input for style agent refinement
- Style agent output can inform platform agent adaptations
- Router Agent facilitates all inter-agent communication
- Clear documentation of handoff requirements and expectations

### Quality Assurance Framework
**Multi-Agent QA Process:**
1. **Individual Agent QA**: Each agent self-checks against brand guidelines
2. **Cross-Agent Consistency**: Router Agent checks for message alignment
3. **Platform Optimization**: Platform-specific requirements validated
4. **Brand Compliance**: Final brand voice and visual consistency check
5. **Human Review**: Organized presentation for human approval

### Conflict Resolution
**When Agents Generate Conflicting Approaches:**
- Router Agent identifies conflicting elements
- References brand templates for resolution criteria
- Prioritizes brand consistency over agent preferences
- Escalates to human review when conflicts can't be resolved
- Documents resolution patterns for future reference

## Workflow Templates

### Template 1: Daily Content Generation
**Frequency:** Daily posting needs
**Scope:** 1-2 platforms, single topic
**Process:**
```
1. Receive daily topic request
2. Quick brand/audience reference check
3. Activate primary platform agent
4. Generate 3 variations
5. Select and schedule best option
6. Monitor performance for learning
```

**TodoWrite Pattern:**
```
- Identify today's content topic
- Activate [platform] agent for daily content
- Generate 3 content variations
- Select optimal variation based on recent performance
- Schedule content for optimal posting time
- Set performance tracking reminder
```

### Template 2: Weekly Content Batch
**Frequency:** Weekly content planning
**Scope:** Multiple platforms, multiple topics
**Process:**
```
1. Receive weekly content themes/topics
2. Develop content calendar approach
3. Activate multiple agents in parallel
4. Generate content bank for week
5. Organize by platform and scheduling
6. Present weekly calendar for approval
```

**TodoWrite Pattern:**
```
- Plan weekly content themes based on [brand priorities]
- Activate LinkedIn agent for professional content
- Activate Instagram agent for visual content
- Activate Twitter agent for engagement content
- Organize content by optimal posting schedule
- Present weekly content calendar
- Prepare content bank for scheduling
```

### Template 3: Campaign Launch
**Frequency:** Product launches, announcements
**Scope:** All platforms, coordinated messaging
**Process:**
```
1. Receive campaign brief and requirements
2. Develop campaign messaging framework
3. Activate all relevant platform agents
4. Create campaign content library
5. Develop launch sequence and timing
6. Prepare success metrics and tracking
```

**TodoWrite Pattern:**
```
- Analyze campaign requirements and goals
- Develop master campaign messaging framework
- Brief all platform agents on campaign objectives
- Generate coordinated campaign content variations
- Create launch timeline with platform optimization
- Prepare campaign performance tracking
- Set up post-campaign analysis framework
```

### Template 4: Trending Topic Response
**Frequency:** Real-time trending opportunities
**Scope:** Quick response content, multiple platforms
**Process:**
```
1. Identify trending topic opportunity
2. Quick brand relevance and safety check
3. Activate appropriate agents for rapid response
4. Generate timely content variations
5. Fast-track approval process
6. Deploy across relevant platforms
```

**TodoWrite Pattern:**
```
- Assess trending topic [topic] for brand relevance
- Verify brand safety and messaging alignment
- Activate Twitter agent for immediate response
- Activate LinkedIn agent for professional angle
- Generate rapid response content options
- Fast-track human approval
- Deploy trending content with monitoring
```

## Performance Optimization Patterns

### Learning Loop Integration
**Continuous Improvement Process:**
1. **Content Performance Tracking**: Monitor engagement metrics per agent
2. **Pattern Recognition**: Identify which agent combinations work best
3. **Template Updates**: Update successful patterns in brand templates
4. **Agent Refinement**: Adjust agent prompts based on performance data
5. **Workflow Optimization**: Streamline successful coordination patterns

### A/B Testing Framework
**Agent Effectiveness Testing:**
- Test different agent combinations for same topic
- Compare platform agent vs. style agent primary approaches
- Test workflow patterns for efficiency and quality
- Document successful combinations for replication

### Success Metrics by Agent Type
**Platform Agent Metrics:**
- Platform-specific engagement rates
- Cross-platform content performance comparison
- Platform optimization effectiveness

**Style Agent Metrics:**
- Style approach effectiveness by audience segment
- Brand consistency maintenance across styles
- Style adaptation success across platforms

**Coordination Metrics:**
- Multi-agent workflow efficiency
- Content variety and quality across agents
- Human approval rates for multi-agent content

## Escalation and Override Protocols

### When to Override Agent Recommendations
**Human Override Scenarios:**
- Brand safety concerns not caught by agents
- Market timing considerations agents can't assess
- Strategic pivots that require immediate adjustment
- Crisis communication requiring special handling

### Emergency Response Protocols
**Crisis Communication:**
- Immediate pause on all automated agent activation
- Router Agent switches to crisis communication mode
- All content filtered through crisis communication guidelines
- Accelerated approval process for time-sensitive responses

### Quality Control Escalation
**When Agent Output Needs Review:**
- Brand voice inconsistencies across agents
- Platform guideline violations
- Content quality below brand standards
- Agent coordination failures

## Usage Notes for Agents
- Router Agent uses these coordination patterns to manage multiple agents effectively
- Platform and style agents reference coordination rules for consistent collaboration
- TodoWrite patterns provide structured workflow management
- Update coordination patterns based on workflow efficiency and content quality results
- Document successful coordination examples in `successful-templates.md`
- Regular review of agent coordination effectiveness and optimization opportunities