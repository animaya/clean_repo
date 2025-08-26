# Development Best Practices

## Context

Global development guidelines for Agent OS projects.

<conditional-block context-check="core-principles">
IF this Core Principles section already read in current context:
  SKIP: Re-reading this section
  NOTE: "Using Core Principles already in context"
ELSE:
  READ: The following principles

## Core Principles

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones
- Prefer built-in Next.js features over custom implementations

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- Add comments for "why" not "what"
- Use TypeScript types for documentation

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to custom hooks or utility functions
- Extract repeated UI markup to reusable React components
- Create utility functions for common audio processing operations
- Share types across client and server components

### File Structure
- Keep files focused on a single responsibility
- Group related functionality together (audio, transcription, UI)
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Place all source code in the `src/` directory
- Organize components by feature (transcription, audio upload, settings)
</conditional-block>

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Prefer TypeScript-compatible libraries
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
  - TypeScript definitions (@types packages or built-in types)
- For audio processing, ensure compatibility with Next.js server actions
- Consider bundle size impact on the web application
</conditional-block>
