# Adaptive Workspace

Portfolio-grade productivity tool with clean architecture and monorepo setup.

## 🎯 Project Goal

Grow from strong junior frontend to middle fullstack/software engineer through building a production-quality application.

## 🏗️ Architecture

### Monorepo Structure

```
adaptive-workspace/
├── apps/
│   ├── client/          # Nuxt 4 SPA (Vue 3, TypeScript, Tailwind v4, Pinia, Nuxt UI)
│   └── server/          # Future NestJS backend (planned v3)
├── libs/
│   └── domain/          # Framework-agnostic domain layer
├── docs/                # Architecture documentation
└── [config files]       # Root-level tooling configs
```

### Architecture Principles

- ✅ **Domain-first**: Business logic isolated in `libs/domain`
- ✅ **Framework-agnostic domain**: No Vue/Nuxt/UI dependencies
- ✅ **Monorepo**: pnpm workspaces
- ✅ **Type-safe**: TypeScript everywhere
- ✅ **Local-first**: SPA with localStorage persistence

## 🚀 Tech Stack

### Client (`apps/client`)

- **Framework**: Nuxt 4 (SPA mode, SSR disabled)
- **UI**: Vue 3 + Nuxt UI + Tailwind CSS v4
- **State**: Pinia with localStorage
- **Type Safety**: TypeScript

### Domain (`libs/domain`)

- Pure TypeScript types and business rules
- No external dependencies
- Consumed by both client and future server

### Development Tools (Root level)

- **Linting**: ESLint 9 (flat config) + TypeScript ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript with project references

## 📦 Scripts

### Development

```bash
# Start client dev server
pnpm dev:client

# Build client for production
pnpm build:client
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format all code
pnpm format

# Check formatting
pnpm format:check

# Type check
pnpm typecheck
```

## 🔧 Setup

```bash
# Install dependencies
pnpm install

# Setup git hooks
pnpm prepare

# Start development
pnpm dev:client
```

## 📝 Configuration Files

### Root Level (Monorepo-wide)

| File                  | Purpose                                 |
| --------------------- | --------------------------------------- |
| `pnpm-workspace.yaml` | Workspace definition (apps/\*, libs/\*) |
| `tsconfig.json`       | TypeScript project references           |
| `eslint.config.mjs`   | ESLint configuration (flat config)      |
| `.prettierrc`         | Prettier code formatting                |
| `.lintstagedrc`       | Pre-commit hooks configuration          |
| `.husky/`             | Git hooks (pre-commit)                  |

### Client Level

| File                      | Purpose                       |
| ------------------------- | ----------------------------- |
| `nuxt.config.ts`          | Nuxt configuration (SPA mode) |
| `tailwind.config.ts`      | Tailwind CSS v4 configuration |
| `eslint.config.mjs`       | Client-specific ESLint (Vue)  |
| `src/app.config.ts`       | Nuxt UI theme                 |
| `src/assets/css/main.css` | Tailwind CSS entry point      |

## 🎨 Domain Model

### Core Types (`@repo/domain`)

```typescript
type SessionMode = 'focus' | 'review' | 'plan'

interface Task {
  id: string
  title: string
  priority?: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: number
}

interface Session {
  id: string
  taskId: string
  mode: SessionMode
  startTime: number
  endTime?: number
  notes?: string
}
```

## 🏛️ Architectural Decisions

### Why SPA Mode?

- Local-first approach (no server-side rendering needed)
- Simpler deployment (static files)
- Better for localStorage-based state
- Faster development iteration

### Why Monorepo?

- Shared domain logic between frontend and future backend
- Consistent tooling across all packages
- Easier refactoring and type safety
- Professional industry standard

### Why Domain Layer?

- Business logic isolated from UI framework
- Reusable between client and server
- Enforces architectural boundaries (ESLint rules)
- Easier testing and maintenance

## 🔜 Roadmap

**MVP (v1)** - Current

- [x] Monorepo setup
- [x] Domain layer with types
- [x] Client architecture (Nuxt SPA)
- [x] Dev tooling (ESLint, Prettier, Husky)
- [ ] Mode selection UI
- [ ] Focus mode with timer
- [ ] Review mode
- [ ] Plan mode

**v2** - Enhanced Features

- [ ] Session history
- [ ] Task management
- [ ] Analytics/charts

**v3** - Backend Integration

- [ ] NestJS server
- [ ] REST/GraphQL API
- [ ] Database persistence
- [ ] Authentication

## 📚 Documentation

See `docs/` directory for:

- `architecture.md` - System architecture (TODO)
- `decisions.md` - ADRs (TODO)
- `ux-flow.md` - User flows (TODO)

## 🤝 Contributing

This is a learning/portfolio project. See commit history for development progress.

## 📄 License

ISC
