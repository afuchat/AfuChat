# AfuChat - Social Media Platform

## Overview

AfuChat is a modern full-stack social media application built with React (frontend) and Express.js (backend). The platform features advanced posting capabilities inspired by modern Twitter/X, including posts with privacy controls, character counting, media attachments, scheduling, and AI integration through AfuAI. The application uses a mobile-first design with notifications in the top bar and a five-section bottom navigation.

## System Architecture

### Monorepo Structure
- **Frontend**: React with TypeScript, located in `/client`
- **Backend**: Express.js with TypeScript, located in `/server`
- **Shared**: Common schemas and types, located in `/shared`
- **Database**: PostgreSQL with Drizzle ORM

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui components, TanStack Query
- **Backend**: Express.js, TypeScript, Drizzle ORM, Passport.js with OpenID Connect
- **Database**: PostgreSQL (via Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **Build Tools**: Vite (frontend), esbuild (backend)
- **Deployment**: Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with Twitter-inspired design system (blue theme)
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for client-side routing
- **Layout**: Mobile-first design with bottom navigation bar (Home, Explore, Notifications, Messages, Profile)

### Backend Architecture
- **API Structure**: RESTful endpoints under `/api` prefix
- **Authentication**: Passport.js with OpenID Connect strategy for Replit Auth
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Database Layer**: Drizzle ORM with type-safe queries
- **Error Handling**: Global error middleware with structured error responses

### Database Schema
Key tables include:
- **users**: User profiles with Twitter-style fields (bio, verified status, follower counts)
- **posts**: Tweet content with engagement metrics and timestamps
- **likes**: Tweet likes relationship table
- **comments**: Replies to tweets
- **follows**: User following relationships
- **conversations & messages**: Direct messaging system
- **sessions**: Authentication session storage (required for Replit Auth)

## Data Flow

1. **Authentication Flow**: 
   - Replit OAuth → Passport.js → Session creation → User profile sync
   - Protected routes check session validity
   - Automatic login redirect for unauthenticated users

2. **Content Creation**:
   - Client form submission → API validation → Database insertion → Real-time updates

3. **Social Interactions**:
   - Like/follow actions → Optimistic updates → API calls → Database updates → Counter updates

4. **Real-time Features**:
   - TanStack Query provides cache invalidation and background refetching
   - No WebSocket implementation (uses polling for real-time effects)

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection via Neon
- **drizzle-orm & drizzle-kit**: Database ORM and migration tools
- **passport & openid-client**: Authentication via Replit OAuth
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI components foundation
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies  
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **vite**: Frontend development server and build tool

## Deployment Strategy

### Development Environment
- Uses `tsx` for hot-reloading TypeScript server
- Vite dev server with HMR for frontend
- Development runs on port 5000
- Database migrations via `drizzle-kit push`

### Production Build
1. Frontend: `vite build` → static files in `/dist/public`
2. Backend: `esbuild` → bundled server in `/dist/index.js`
3. Static file serving: Express serves built frontend files
4. Database: Requires `DATABASE_URL` environment variable

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Environment**: Automatic provisioning of database and session secrets

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
- June 19, 2025. Integrated real OpenAI API for AfuAI chat and content enhancement
- June 19, 2025. Added premium subscription features with golden crown button in top bar
- June 19, 2025. Fixed home page layout consistency with proper spacing and mobile responsiveness
- June 19, 2025. Replaced logout button with Premium subscription button in top navigation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```