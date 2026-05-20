# Project Agents & Skills Configuration

## Overview
Konfigurasi untuk proyek sosial media fullstack dengan Next.js, shadcn/ui, dan Prisma.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Bahasa**: TypeScript
- **State Management**: Zustand
- **Auth**: Custom (bcryptjs + Prisma)
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL + Prisma ORM

## Available Agents

### Primary Agent (Build)
Agent utama untuk semua task coding.

### Subagents

#### @frontend-dev
Frontend developer specializing in Next.js, React, Tailwind CSS, and shadcn/ui components.
Gunakan untuk:
- Membuat komponen UI baru
- Implementasi halaman/page
- Styling dan responsive design
- Animasi dan motion design

#### @backend-dev
Backend developer specializing in API routes, Prisma, and database operations.
Gunakan untuk:
- Membuat API endpoints
- Prisma schema & migrations
- Database CRUD operations
- File upload dan validasi
- Server-side logic

#### @reviewer
Code reviewer untuk frontend, backend, UI/UX, security, dan architecture.
Gunakan untuk:
- Review code quality FE & BE
- Design consistency & accessibility
- Security & performance audit
- Architecture review

## Available Skills

| Skill | Description | Use Case |
|-------|-------------|----------|
| `next-best-practices` | Next.js best practices | Server Components, App Router, Data fetching |
| `next-cache-components` | Next.js cache components & PPR | `'use cache'`, `cacheLife()`, revalidation |
| `next-upgrade` | Next.js upgrade guide | Migration between major versions |
| `shadcn` | shadcn/ui components | Adding, customizing, composing UI |
| `ui-ux-pro-max` | UI/UX design intelligence | Typography, color, layout, accessibility |
| `vercel-react-best-practices` | React performance | Component optimization, bundle size |

## Konvensi Kode

### Struktur Folder
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route group untuk auth
│   │   └── login/
│   ├── (main)/           # Route group untuk halaman utama
│   │   ├── home/
│   │   ├── explore/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── api/              # API routes
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Komponen reusable
│   ├── ui/              # Komponen dari shadcn
│   ├── layout/          # Header, Sidebar, Footer
│   └── posts/           # Komponen terkait post
├── lib/                  # Utilities dan helper
│   ├── utils.ts
│   └── types.ts
├── data/                 # Data dummy
├── hooks/                # Custom hooks
└── store/                # Zustand stores
```

### Naming Conventions
- Komponen: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase dengan prefix (`useAuth.ts`)
- Store: camelCase (`useUserStore.ts`)
- Utils: camelCase (`formatDate.ts`)

### shadcn/ui Best Practices
- Gunakan `cn()` untuk conditional classes
- Gunakan `gap-*` bukan `space-y-*`
- Gunakan `size-*` untuk dimensi equal
- Items harus inside their Group
- Dialog/Sheet perlu Title untuk accessibility
- Gunakan semantic colors, bukan raw values

## Tahap Implementasi

1. **Tahap 1**: Setup & UI Dasar
2. **Tahap 2**: Autentikasi
3. **Tahap 3**: Feed & Post
4. **Tahap 4**: Komentar
5. **Tahap 5**: Profil Pengguna
6. **Tahap 6**: Polish

## Acceptance Criteria
- [ ] Login dengan kredensial dummy
- [ ] Feed dengan post
- [ ] CRUD post
- [ ] Like/unlike
- [ ] Komentar
- [ ] Profil & follow/unfollow
- [ ] Responsive design