# TaxPod CRM

**Prepared by: Jack Siow Woon Yew**

A CRM system with an agentic AI assistant built for YYC taxPOD. Manages leads, opportunities, and activities with an AI agent that can query data, create records, and process meeting notes through natural language conversation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.9, Vite, Ant Design 5 |
| Backend | NestJS 11, TypeScript 5.9, TypeORM |
| Database | PostgreSQL 17 |
| AI | Vercel AI SDK 6, Gemini 2.0 Flash (default) |
| Infrastructure | Docker Compose, pnpm workspaces |

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- [Node.js](https://nodejs.org/) 24 LTS
- [pnpm](https://pnpm.io/) 10

## Getting Started

```bash
# Clone and setup
git clone https://github.com/NotReliable/TaxPod-CRM.git
cd taxpod-technical-interview
cp .env.example .env
# Add your GOOGLE_API_KEY to .env (get one at https://aistudio.google.com/)

# Option 1: Docker (full stack)
docker-compose up

# Option 2: Local development
pnpm install
docker-compose up db -d  # PostgreSQL only
pnpm seed                # Populate sample data
pnpm dev                 # Start both server and web
```

- **Web**: http://localhost:5173
- **API**: http://localhost:3000/api

## AI Agent

Navigate to the AI Agent page (`/agent`) to interact with the CRM through natural language.

### Example Prompts

- "Show me all prospects"
- "Which opportunities are in the Proposal stage?"
- "Create a new lead: John Smith, john@example.com, ABC Corp"
- "Log a meeting note: Discussed tax filing timeline with Ahmad"
- "What is the total value of opportunities in the Won stage?"
- "Update the status of John Smith to Customer"

### LLM Provider

The AI agent supports multiple LLM providers. Set `LLM_PROVIDER` in your `.env` file:

| Provider | Value | Model | API Key Variable |
|----------|-------|-------|-----------------|
| Google Gemini | `google` | gemini-2.0-flash | `GOOGLE_API_KEY` |
| OpenAI | `openai` | gpt-4o-mini | `OPENAI_API_KEY` |
| Anthropic | `anthropic` | claude-sonnet-4 | `ANTHROPIC_API_KEY` |

```bash
# Example: switch to OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here
```

Restart the server after changing the provider.

### How It Works

- **Read operations** (searching leads, viewing details) execute automatically and display results inline.
- **Write operations** (creating leads, updating stages, logging activities) require confirmation before execution. The agent proposes the action and a confirmation card appears with the details and Confirm/Reject buttons.

## Project Structure

```
taxpod-technical-interview/
├── apps/
│   ├── server/                     # NestJS 11 Backend
│   │   └── src/
│   │       ├── main.ts             # App bootstrap
│   │       ├── app.module.ts       # Root module
│   │       ├── common/             # Exception filter, interceptor, pagination
│   │       ├── database/           # Data source config, migrations, seed
│   │       ├── events/             # EventLog entity, wildcard listener
│   │       ├── leads/              # Lead entity, service, controller, DTOs
│   │       ├── opportunities/      # Opportunity entity, service, controller, DTOs
│   │       ├── activities/         # ActivityLog entity, service, controller, DTOs
│   │       ├── dashboard/          # Stats endpoint, SSE activity feed
│   │       └── agent/              # AI agent module
│   │           ├── entities/       # AgentConversation, AgentMessage
│   │           ├── providers/      # LLM provider factory (Gemini/Claude)
│   │           ├── prompts/        # System prompt
│   │           └── tools/          # 8 agent tools (3 read, 5 write)
│   │
│   └── web/                        # React 19 Frontend
│       └── src/
│           ├── main.tsx            # App entry point
│           ├── app/                # Layout, router
│           ├── shared/             # API client, types, common components
│           └── features/
│               ├── leads/          # Lead table, forms, detail page
│               ├── opportunities/  # Kanban board with drag-and-drop
│               ├── activities/     # Activity timeline, log form
│               ├── dashboard/      # Stats cards, charts, real-time feed
│               └── agent/          # Chat window, message bubbles,
│                                   # tool call cards, confirmation cards
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── .env.example
```

## API Endpoints

All endpoints are prefixed with `/api`.

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Search leads (query, status, pagination) |
| GET | `/api/leads/:id` | Get lead by ID with opportunities and activities |
| POST | `/api/leads` | Create a new lead |
| PATCH | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |

### Opportunities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | Search opportunities (query, stage, leadId, pagination) |
| GET | `/api/opportunities/:id` | Get opportunity by ID |
| POST | `/api/opportunities` | Create a new opportunity |
| PATCH | `/api/opportunities/:id` | Update an opportunity |
| PATCH | `/api/opportunities/:id/stage` | Update opportunity stage |
| DELETE | `/api/opportunities/:id` | Delete an opportunity |

### Activities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Search activities (type, leadId, opportunityId, pagination) |
| POST | `/api/activities` | Create a new activity log |
| DELETE | `/api/activities/:id` | Delete an activity |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |
| GET | `/api/dashboard/activity-feed` | SSE stream of recent events |

### Agent

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent/chat` | Send message and receive streaming response |
| POST | `/api/agent/tools/:toolName/execute` | Execute a confirmed tool call |
| GET | `/api/agent/conversations` | List recent conversations |
| GET | `/api/agent/conversations/:id` | Get conversation with messages |
