# AI Usage

This document describes how AI tools were used during the development of TaxPod CRM.

## AI Tools Used

**Claude Code** was the primary AI tool used throughout this project:

- **Architecture design and brainstorming** — Explored architectural patterns, evaluated trade-offs, and converged on a modular monolith with an event-driven agent pattern.
- **Implementation plan generation** — Produced a comprehensive, ordered task list covering backend entities, services, controllers, frontend features, and AI integration.
- **Code generation across frontend and backend** — Generated NestJS modules, TypeORM entities, React components, custom hooks, and API integration code.
- **Debugging and problem-solving** — Diagnosed issues with streaming responses, TypeORM relations, drag-and-drop behavior, and LLM provider quirks.

## Real Example: Brainstorming to Implementation

### 1. Starting with the Case Study

The process began with the YYC taxPOD case study requirements: build a CRM with leads, opportunities, activities, a dashboard, and an AI agent that can interact with CRM data through natural language.

### 2. Architecture Brainstorming

Used Claude Code to explore architectural options:

- **Modular monolith vs. microservices**: Evaluated the complexity of a microservices approach (separate services for leads, opportunities, agent) against a modular monolith. Decided on modular monolith for simplicity — the domain is cohesive, the team is small, and a single deployment unit reduces operational overhead.
- **Event-driven communication**: Chose EventEmitter over direct service coupling for cross-module effects (e.g., logging events, updating dashboards), providing an audit trail without tight coupling.
- **AI integration pattern**: Explored direct LLM API calls vs. Vercel AI SDK. Chose the SDK for its streaming protocol, built-in tool calling, and multi-provider abstraction.
- **Human-in-the-loop design**: Designed the tool split (read = auto-execute, write = require confirmation) by leveraging the Vercel AI SDK's behavior when a tool has no `execute` function — the stream pauses and returns the tool call to the client.

### 3. Design Specification

Generated a comprehensive design spec covering:
- Data model with 6 entities and their relationships
- API endpoint design for all CRUD operations
- React component structure following a feature-based architecture
- Agent tool definitions with parameter schemas
- Human-in-the-loop confirmation flow

### 4. Implementation Plan

Created a detailed implementation plan with 28 tasks organized into 8 chunks:
1. Project scaffolding (monorepo, NestJS, React)
2. Common backend infrastructure (events, exception filters)
3. CRM entities and services (leads, opportunities, activities)
4. Dashboard and data seeding
5. Frontend shared utilities and lead management UI
6. Opportunity Kanban board and activities UI
7. AI agent backend (entities, LLM provider, tools, streaming)
8. AI agent frontend (chat interface, confirmation cards)
9. Documentation and polish

### 5. Subagent-Driven Development

Each task was implemented using Claude Code's subagent capability:
- The main agent coordinated the overall plan and tracked progress
- Subagents handled individual tasks with focused context
- Each subagent received the relevant task spec and produced a working implementation
- An automated review step verified each task's output before moving to the next

## Where AI Helped Most

1. **Architecture decisions** — Pattern selection (modular monolith, event-driven), tech stack evaluation (comparing ORMs, UI libraries, AI SDKs), and design trade-off analysis. AI was particularly good at articulating the pros and cons of each option.

2. **Boilerplate generation** — NestJS modules follow a consistent pattern (entity, service, controller, module, DTOs). AI generated these consistently across all CRM modules, saving significant time on repetitive but important scaffolding.

3. **Consistent code patterns** — Maintaining the same patterns for error handling, event emission, API responses, and React hooks across all features. AI ensured each new module followed the established conventions.

4. **Comprehensive seed data** — Generated realistic seed data with Malaysian business context (YYC taxPOD's tax e-learning domain), including properly interrelated leads, opportunities, and activities that demonstrate the full feature set.

## Where AI Fell Short

1. **Complex integration testing** — Setting up test databases, handling TypeORM connection lifecycle in tests, and verifying end-to-end flows required manual verification and iteration that went beyond what AI could reliably automate.

2. **UI polish and visual design** — While AI generated functional components, the visual refinements — spacing, color choices, responsive behavior, loading states — needed human judgment to feel right.

3. **Edge cases in drag-and-drop behavior** — The Kanban board's drag-and-drop with dnd-kit required manual testing to handle edge cases like dragging between columns, empty columns, and optimistic updates with rollback on failure.

4. **LLM provider-specific quirks** — Each LLM provider has subtle differences in how they handle tool calls, streaming, and error cases. Debugging these required hands-on experimentation that AI couldn't fully anticipate from documentation alone.
