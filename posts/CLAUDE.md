# Marketing Posting Factory - System Memory

## System Overview
This is a multi-agent posting factory that orchestrates specialized creative agents to generate social media content variations based on human requests. The system uses modular templates for maximum flexibility and customization.

## Core Architecture

### Router Agent
- Receives content requests from human workers
- Conducts intelligent questioning using templates from `router-prompts.md`
- Routes to appropriate creative agents based on requirements
- Coordinates parallel processing and manages approvals

### Creative Agent System
- Platform-specific agents (LinkedIn, Twitter, Instagram, Facebook, TikTok)
- Style-specific agents (Professional, Casual, Technical, Humorous, Inspirational)
- Template-driven agent behavior from `agents/` directory
- Generates 3-5 variations per agent with different hooks and CTAs

### Template Framework
All system behavior is controlled by editable .md template files:

#### Brand Templates (customizable by user):
- `brand/brand-voice.md` - Company tone, messaging, values
- `brand/visual-style.md` - Colors, fonts, image guidelines
- `brand/audience-personas.md` - Target audience definitions
- `brand/platform-guidelines.md` - Platform-specific requirements
- `brand/successful-templates.md` - Proven post formats and patterns

#### Agent Templates:
- `agents/platform-agents.md` - Platform-specific agent configurations
- `agents/style-agents.md` - Style-specific agent configurations
- `agents/agent-coordination.md` - Multi-agent workflow patterns

#### System Templates:
- `router-prompts.md` - Question templates and routing logic
- `workflow-templates.md` - TodoWrite task patterns and workflows

## Current Capabilities
- Dynamic agent selection based on request requirements
- Parallel content generation across multiple agents
- Template-driven brand compliance
- Structured approval workflows
- Feedback integration for continuous improvement

## Usage Pattern
1. Human worker submits content topic request
2. Router Agent asks clarifying questions using templates
3. Routes to appropriate agents based on responses
4. Agents generate multiple variations using brand templates
5. Present organized options for human approval
6. Iterate based on feedback if needed

## Memory Integration
- This CLAUDE.md file serves as persistent system memory
- All agents reference templates for consistent behavior
- Successful patterns are captured in template files
- System learns and improves through template updates

## Next Development Phases
- Phase 2: Advanced creative agents and parallel processing
- Phase 3: Context engineering and performance feedback
- Phase 4: Workflow optimization and analytics
- Phase 5: Real-time trend integration and competitor analysis