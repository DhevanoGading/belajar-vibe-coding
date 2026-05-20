# Project Agents & Skills Configuration

## Overview
Konfigurasi untuk proyek sosial media fullstack dengan Next.js, shadcn/ui, dan Better Auth.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Bahasa**: TypeScript
- **State Management**: Zustand
- **Auth**: Better Auth
- **UI Components**: shadcn/ui
- **Data**: Data dummy (JSON/in-memory)

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

#### @auth-dev
Authentication specialist untuk Better Auth.
Gunakan untuk:
- Setup autentikasi
- Protected routes
- Session management
- Login/register flows

#### @ui-reviewer
UI/UX reviewer untuk design quality.
Gunakan untuk:
- Review design consistency
- Accessibility check
- Design pattern adherence

## Available Skills

| Skill | Description | Use Case |
|-------|-------------|----------|
| `next-best-practices` | Next.js best practices | Server Components, App Router, Data fetching |
| `frontend-design` | UI/UX design patterns | Typography, motion, visual details |
| `shadcn` | shadcn/ui components | Adding, customizing, composing UI |
| `better-auth-best-practices` | Better Auth configuration | Auth setup, session, middleware |
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
2. **Tahap 2**: Autentikasi (Better Auth)
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