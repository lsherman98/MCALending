# MCA Platform

A full stack application for managing Merchant Cash Advance (MCA) deals, bank statements, and transaction analysis.

## Tech Stack

### Frontend

- **React** with **TypeScript**
- **Vite** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library

### Backend

- **PocketBase** (Go) - Backend as a Service
- **Gemini AI** - Transaction classification
- **LLaMA Index** - Document processing

## Project Structure

```
mca-platform/
├── src/                        # Frontend source code
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components (shadcn/ui)
│   │   ├── analytics/        # Analytics-specific components
│   │   ├── deal/             # Deal management components
│   │   └── transactions/     # Transaction components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Core utilities and API layer
│   │   ├── api/             # API functions, queries, mutations
│   │   ├── stores/          # State management (Zustand)
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── constants.ts     # Application constants
│   │   ├── utils.ts         # Utility functions
│   │   └── pocketbase.ts    # PocketBase client setup
│   ├── routes/              # TanStack Router route definitions
│   └── styles/              # Global styles and themes
├── pocketbase/              # Backend (Go)
│   ├── pb_hooks/           # PocketBase event hooks
│   │   ├── extraction_hooks/  # Document extraction logic
│   │   ├── statement_hooks/   # Statement processing
│   │   ├── job_hooks/         # Background job management
│   │   └── plaid_hooks/       # Plaid integration
│   ├── collections/        # Database collection definitions
│   ├── llama_client/       # LLaMA AI client
│   └── plaid_client/       # Plaid API client
└── public/                 # Static assets

```

## Development

### Setup

1. Install dependencies:

```bash
pnpm install
```

3. Run development servers:

```bash
# Terminal 1: Frontend
pnpm dev

# Terminal 2: Backend
pnpm pb:serve
```
