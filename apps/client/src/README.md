# Client App Structure

Nuxt 4 application with TypeScript, Pinia, and Nuxt UI.

## Directory Structure

```
src/                          # srcDir (configured in nuxt.config.ts)
├── app.vue                  # Root app component
├── app.config.ts            # Nuxt UI theme configuration
│
├── layouts/                 # Layout components
│   └── default.vue         # Default layout with header & color mode
│
├── pages/                   # File-based routing
│   └── index.vue           # Home page (mode selection)
│
├── stores/                  # Pinia stores
│   └── session.store.ts          # Session & task management (localStorage)
│
├── composables/             # Vue composables (auto-imported)
│   └── useColorMode.ts     # Dark/light mode helper
│
├── plugins/                 # Nuxt plugins
│   └── init.client.ts      # Client-side initialization (loads localStorage)
│
└── public/                  # Static assets
    ├── favicon.ico
    └── robots.txt
```

## Key Patterns

### 1. Layout System

- `app.vue` - Uses `<NuxtLayout>` + `<NuxtPage/>`
- `layouts/default.vue` - Contains header, container, color mode toggle
- Session indicator in header when active

### 2. State Management (Pinia)

- `stores/session.store.ts` - Manages sessions and tasks
- Automatic localStorage persistence
- Loaded via `plugins/init.client.ts` on mount

### 3. Domain Integration

- Uses `@repo/domain` types via workspace dependency
- Import: `import type { Session, Task, SessionMode } from '@repo/domain'`

### 4. Nuxt UI Components

- Auto-imported globally
- Examples: `UButton`, `UCard`, `UBadge`, `UContainer`, `UMain`
- Theme configured in `app.config.ts`

### 5. Routing

- File-based routing via `pages/` directory
- `index.vue` - Mode selection (Focus/Review/Plan)
- Future: `/focus`, `/review`, `/plan` pages

## Running

```bash
# Development
pnpm dev:client

# Build
pnpm build:client
```

## Next Steps

- [ ] Add `/focus`, `/review`, `/plan` pages
- [ ] Implement timer for Focus mode
- [ ] Add session history view
- [ ] Create task management UI
- [ ] Add charts/analytics for Review mode
