# Architecture

**Prepared by: Jack Siow Woon Yew**

## System Design

TaxPod CRM follows a **modular monolith** architecture with an **event-driven agent pattern**. The backend is organized into cohesive NestJS modules that communicate through an internal EventBus (EventEmitter), while the AI agent integrates via the Vercel AI SDK's streaming protocol. This approach provides the clear boundaries of microservices without the operational overhead, making it ideal for a focused CRM application.

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         React 19 SPA                                │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────────┐ │
│  │  Leads    │ │ Opportunities│ │ Activities │ │   Agent Chat     │ │
│  │  Pages    │ │ Kanban Board │ │  Timeline  │ │ (useChat + SSE)  │ │
│  └──────────┘ └──────────────┘ └────────────┘ └──────────────────┘ │
│  ┌──────────────────┐  ┌─────────────────────────────────────────┐ │
│  │  Dashboard        │  │  Shared: API Client, Types, Components │ │
│  │  (Stats + SSE)    │  │  (Axios, React Query, Ant Design 5)   │ │
│  └──────────────────┘  └─────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────────┘
                           │  REST API + SSE (Data Stream)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      NestJS 11 Backend                              │
│                                                                     │
│  ┌──────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────────┐ │
│  │  Leads   │ │ Opportunities│ │ Activities │ │    Dashboard     │ │
│  │  Module  │ │    Module    │ │   Module   │ │     Module       │ │
│  └────┬─────┘ └──────┬───────┘ └─────┬──────┘ └───────┬──────────┘ │
│       │              │               │                │            │
│       └──────────────┴───────┬───────┴────────────────┘            │
│                              │                                     │
│                    ┌─────────▼──────────┐                          │
│                    │  EventBus          │                          │
│                    │  (EventEmitter)    │                          │
│                    └─────────┬──────────┘                          │
│                              │                                     │
│                    ┌─────────▼──────────┐                          │
│                    │   Events Module    │                          │
│                    │   (EventLog)       │                          │
│                    └────────────────────┘                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                     Agent Module                                ││
│  │  ┌──────────┐ ┌───────────┐ ┌─────────┐ ┌───────────────────┐ ││
│  │  │ Service  │ │ Tools (8) │ │ Prompts │ │  LLM Provider     │ ││
│  │  │(streamText)│ │ R:3 W:5  │ │ System  │ │ Gemini / Claude  │ ││
│  │  └──────────┘ └───────────┘ └─────────┘ └────────┬──────────┘ ││
│  └──────────────────────────────────────────────────┼─────────────┘│
└──────────────────────────┬──────────────────────────┼──────────────┘
                           │                          │
                           ▼                          ▼
                 ┌──────────────────┐     ┌──────────────────────┐
                 │  PostgreSQL 17   │     │  LLM Provider        │
                 │  (TypeORM)       │     │  Gemini 2.0 Flash    │
                 │                  │     │  Claude Sonnet 4     │
                 └──────────────────┘     │  (Vercel AI SDK 6)   │
                                          └──────────────────────┘
```

### Module Communication

- **CRM Modules** (Leads, Opportunities, Activities) emit domain events through the NestJS EventEmitter on every create, update, and delete operation.
- **Events Module** listens to all events with a wildcard listener and persists them to the `event_log` table, creating a full audit trail.
- **Dashboard Module** uses SSE polling to stream recent events to the frontend in real-time.
- **Agent Module** accesses CRM services directly via dependency injection to execute tool calls.

---

## Data Model

The application uses 6 entities managed by TypeORM with PostgreSQL:

### Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────────┐
│        Lead          │       │      Opportunity         │
├──────────────────────┤       ├──────────────────────────┤
│ id         UUID PK   │       │ id         UUID PK       │
│ name       VARCHAR   │◄──┐  │ title      VARCHAR       │
│ email      VARCHAR   │   │  │ value      DECIMAL(12,2) │
│ phone      VARCHAR?  │   └──│ leadId     UUID FK       │
│ company    VARCHAR?  │      │ stage      ENUM          │
│ status     ENUM      │      │ createdAt  TIMESTAMP     │
│ createdAt  TIMESTAMP │      │ updatedAt  TIMESTAMP     │
│ updatedAt  TIMESTAMP │      └──────────────┬───────────┘
└──────────┬───────────┘                     │
           │                                 │
           │  1:N                            │  1:N
           ▼                                 ▼
┌──────────────────────────────────────────────────┐
│                 ActivityLog                       │
├──────────────────────────────────────────────────┤
│ id              UUID PK                           │
│ type            ENUM (Call|Email|Meeting|Note)    │
│ description     TEXT                              │
│ date            TIMESTAMP                         │
│ leadId          UUID FK? (SET NULL on delete)    │
│ opportunityId   UUID FK? (SET NULL on delete)    │
│ createdAt       TIMESTAMP                         │
└──────────────────────────────────────────────────┘

┌──────────────────────────┐       ┌──────────────────────────────┐
│   AgentConversation      │       │       AgentMessage           │
├──────────────────────────┤       ├──────────────────────────────┤
│ id         UUID PK       │◄──┐  │ id              UUID PK      │
│ title      VARCHAR?      │   └──│ conversationId  UUID FK      │
│ createdAt  TIMESTAMP     │      │ role            ENUM         │
│ updatedAt  TIMESTAMP     │      │ content         TEXT?        │
└──────────────────────────┘      │ toolCalls       JSONB?      │
                                   │ toolResults     JSONB?      │
                                   │ createdAt       TIMESTAMP   │
                                   └──────────────────────────────┘

┌──────────────────────────────┐
│          EventLog            │
├──────────────────────────────┤
│ id          UUID PK          │
│ eventType   VARCHAR(100)     │
│ payload     JSONB            │
│ source      ENUM (user|agent)│
│ entityType  VARCHAR(50)?     │
│ entityId    UUID?            │
│ createdAt   TIMESTAMP        │
└──────────────────────────────┘
```

### Enumerations

| Enum | Values |
|------|--------|
| LeadStatus | `Lead`, `Prospect`, `Customer` |
| OpportunityStage | `New`, `Contacted`, `Qualified`, `Proposal`, `Won`, `Lost` |
| ActivityType | `Call`, `Email`, `Meeting`, `Note` |
| MessageRole | `user`, `assistant`, `tool` |
| EventSource | `user`, `agent` |

### Relationships

- **Lead -> Opportunity**: One-to-Many. A lead can have multiple opportunities. Deleting a lead cascades to delete its opportunities.
- **Lead -> ActivityLog**: One-to-Many. A lead can have multiple activity logs. Deleting a lead sets `leadId` to NULL on activities.
- **Opportunity -> ActivityLog**: One-to-Many. An opportunity can have multiple activity logs. Deleting an opportunity sets `opportunityId` to NULL.
- **AgentConversation -> AgentMessage**: One-to-Many. A conversation contains multiple messages. Deleting a conversation cascades to delete its messages.

---

## AI Integration Design

### Vercel AI SDK 6 Streaming

The agent uses `streamText()` from the Vercel AI SDK with `maxSteps: 10`, enabling multi-step reasoning where the LLM can chain up to 10 tool calls in a single turn. The streaming response is sent to the frontend as a Server-Sent Events (SSE) data stream, providing real-time token-by-token display.

```
User Message → streamText({ model, system, messages, tools, maxSteps: 10 })
                                    │
                       ┌────────────┼────────────┐
                       │            │            │
                   Text Tokens   Tool Calls   Tool Results
                       │            │            │
                       ▼            ▼            ▼
                    SSE Data Stream → Frontend (useChat)
```

### Tool Definitions (8 Tools)

The agent has 8 tools divided into two categories based on their safety profile:

**Read Tools (3) — Auto-Execute:**
These tools have an `execute` function and run automatically without user confirmation:

| Tool | Description |
|------|-------------|
| `search_leads` | Search leads by name, email, company, or status |
| `get_lead_details` | Get full details of a specific lead including opportunities and activities |
| `search_opportunities` | Search opportunities by title, stage, or associated lead |

**Write Tools (5) — Human-in-the-Loop:**
These tools have NO `execute` function, which causes the stream to pause and return the tool call to the frontend for user confirmation:

| Tool | Description |
|------|-------------|
| `create_lead` | Create a new lead |
| `update_lead` | Update lead fields (name, email, phone, company, status) |
| `create_opportunity` | Create a new opportunity linked to a lead |
| `update_opportunity_stage` | Move an opportunity to a different pipeline stage |
| `log_activity` | Log a call, email, meeting, or note |

### Human-in-the-Loop Flow

```
1. User sends message
   │
2. Agent calls a write tool (e.g., create_lead)
   │  ← Tool has no execute function
   │
3. Stream pauses, returns tool call to frontend
   │
4. Frontend renders ConfirmationCard
   │  ← Shows tool name, parameters, Confirm/Reject buttons
   │
5a. User clicks "Confirm"
   │  → POST /api/agent/tools/:toolName/execute (with args)
   │  → Server executes the actual CRM operation
   │  → addToolResult() feeds result back to the chat
   │  → New stream begins for agent to acknowledge the result
   │
5b. User clicks "Reject"
   │  → addToolResult({ error: "User rejected this action" })
   │  → Agent acknowledges the rejection
```

This pattern ensures that all write operations (creating leads, updating stages, logging activities) require explicit user consent before execution.

### System Prompt Design

The system prompt establishes the agent as a CRM assistant for YYC taxPOD with:
- Current date injection for temporal awareness
- Capability summary (search, create, update, log activities, extract from meeting notes)
- Behavioral rules: explain before acting, search first for queries, present proposed changes clearly, use RM for currency, handle ambiguity by asking for clarification

### Provider Abstraction

The LLM provider is abstracted through a factory function in `llm.provider.ts`:

- **Default**: Google Gemini 2.0 Flash (`gemini-2.0-flash`) — chosen for speed and free-tier availability
- **Alternative**: Anthropic Claude Sonnet 4 (`claude-sonnet-4-20250514`) — available as a fallback
- Provider is selected via the `LLM_PROVIDER` environment variable (`google` | `anthropic`)

Both providers are accessed through the Vercel AI SDK's unified interface (`@ai-sdk/google`, `@ai-sdk/anthropic`), making switching seamless.

### Error Handling Strategy

- **Agent-level**: The chat endpoint wraps the entire streaming flow in a try-catch, returning a structured error response on failure
- **Tool-level**: Each tool execution in the `executeTool` endpoint handles errors independently
- **Frontend-level**: The `useAgentChat` hook catches tool execution errors and feeds them back as tool results, allowing the agent to gracefully handle failures
- **Stream resilience**: If the stream breaks, the conversation history is persisted in the database and can be resumed

---

## Stack Choices

| Technology | Version | Justification |
|-----------|---------|---------------|
| **React** | 19 | Latest stable with improved performance, concurrent features |
| **TypeScript** | 5.9 | Shared type safety across frontend and backend in a monorepo |
| **Vite** | 8 | Fast HMR and build times, modern ESM-first bundler |
| **Ant Design** | 5 | Comprehensive component library with Pro Components for admin UIs |
| **React Router** | 7 | File-based routing patterns, stable API |
| **React Query** | 5 | Server state management with caching, refetching, and optimistic updates |
| **dnd-kit** | 6 | Modern drag-and-drop for the Kanban board, accessible and composable |
| **NestJS** | 11 | Modular architecture with decorators, dependency injection, built-in patterns |
| **TypeORM** | 0.3 | Mature ORM with decorator-based entities, migration support, PostgreSQL features |
| **PostgreSQL** | 17 | JSONB for flexible event payloads, ENUM support, production-ready RDBMS |
| **Vercel AI SDK** | 6 | Unified streaming interface, multi-provider support, built-in tool calling |
| **Gemini 2.0 Flash** | - | Fast inference, generous free tier, strong tool-calling support |
| **pnpm Workspaces** | 10 | Efficient monorepo dependency management with strict hoisting |
| **Docker Compose** | - | One-command deployment for database, backend, and frontend |
| **Axios** | 1.7 | Reliable HTTP client with interceptors for API prefix and error handling |
| **Zod** | 4 | Runtime schema validation for agent tool parameters |

---

## What I Would Do Differently With More Time

1. **Add authentication** — Implement JWT or session-based auth with role-based access control. Currently the app has no authentication, which is unsuitable for production.

2. **WebSocket instead of SSE polling** — The dashboard activity feed currently uses SSE with 3-second polling intervals. A proper WebSocket connection would provide true real-time updates with lower latency and less server load.

3. **More comprehensive test coverage** — Add unit tests for services and controllers, integration tests for the API endpoints with a test database, and end-to-end tests with Playwright for critical user flows.

4. **Turborepo for build orchestration** — pnpm workspaces handle dependency management, but Turborepo would add intelligent build caching, parallel task execution, and remote caching for CI.

5. **CI/CD pipeline** — Set up GitHub Actions for automated linting, testing, building, and deployment. Include database migration checks and preview deployments for PRs.

6. **Better conversation management** — Support editing messages, regenerating responses, branching conversations, and deleting conversations. The current implementation is append-only.

7. **Rate limiting and API security** — Add request rate limiting, input sanitization beyond class-validator, CORS configuration for production, and API key management for the LLM providers.

8. **Proper logging with structured logs** — Replace console logging with a structured logger (e.g., Winston or Pino) with log levels, request IDs, and centralized log aggregation.

9. **AI agent monitoring and evals** — Add observability and evaluation for the agentic AI system: trace every LLM call with latency, token usage, and cost tracking (e.g., Langfuse or Braintrust); build an evaluation suite with golden test cases to measure tool-calling accuracy, response relevance, and hallucination rate; set up guardrails to detect and flag when the agent produces incorrect tool arguments or hallucinates lead/opportunity data; monitor prompt drift over time as the system prompt evolves; and implement A/B testing infrastructure to compare model providers (Gemini vs Claude vs GPT) on quality, speed, and cost for the CRM use case.
