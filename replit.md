# Divine Words - Bible Verse App

## Overview

Divine Words is a full-stack web application for exploring, discovering, and managing Bible verses. The application provides users with daily verses, random verse discovery, search functionality, category-based browsing, and personal bookmarking features. Built as a modern React application with a Node.js/Express backend, it uses PostgreSQL for data persistence and includes a comprehensive UI component system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The client-side is built with **React 18** and **TypeScript**, using a modern single-page application (SPA) architecture:

- **Routing**: Uses Wouter for lightweight client-side routing with three main pages (Home, Daily, Favorites)
- **State Management**: React Query (@tanstack/react-query) handles server state management, caching, and data fetching
- **UI Framework**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture  

The server is an **Express.js** application with TypeScript:

- **API Design**: RESTful API with dedicated endpoints for verses, bookmarks, and daily verse management
- **Storage Layer**: Abstracted storage interface allowing for multiple implementations (currently in-memory with sample data)
- **Development Features**: Hot module replacement, request logging, and error handling middleware
- **Static Serving**: Serves the built React application in production

### Data Storage Solutions

**Database Schema** (PostgreSQL via Drizzle ORM):
- `verses` table: Stores verse text, references, categories, and metadata
- `bookmarks` table: User's saved verses with timestamps
- `daily_verses` table: Maps dates to featured verses

**Current Implementation**: Uses in-memory storage with sample data for development, designed to easily switch to PostgreSQL database.

### Component Architecture

**Design System**: 
- Comprehensive UI component library with consistent theming
- Accessible components using Radix UI primitives
- Custom components for verse display, category filtering, and navigation
- Responsive design with mobile-first approach

**Key Components**:
- `VerseCard`: Primary verse display component with bookmark and share functionality
- `CategoryPills`: Filter interface for verse categories  
- `Header`: Navigation with responsive mobile menu

### Development Workflow

**Build Process**:
- Development: Vite dev server with HMR and proxy to Express API
- Production: Static build served by Express with API routes
- TypeScript compilation with strict type checking
- CSS processing through PostCSS and Tailwind

**Code Organization**:
- Shared schema definitions between client and server
- Path aliases for clean imports (@/, @shared/)
- Separation of concerns with dedicated API, storage, and UI layers

## External Dependencies

### Core Framework Dependencies
- **React ecosystem**: React 18, React DOM, React Router (Wouter)
- **Backend**: Express.js, Node.js runtime
- **Build tools**: Vite, TypeScript, esbuild

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder and migrations
- **Drizzle Kit**: Schema management and migration tools  
- **PostgreSQL**: Primary database (via @neondatabase/serverless connector)
- **Database connection**: Neon serverless Postgres for cloud deployment

### UI & Styling
- **Shadcn/ui**: Complete component library built on Radix UI
- **Radix UI**: Accessible, unstyled component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Class Variance Authority**: Type-safe variant API for components
- **Lucide React**: Icon library

### Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form validation and management
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Replit integration**: Development environment plugins and error overlay
- **PostCSS & Autoprefixer**: CSS processing pipeline
- **Date-fns**: Date manipulation and formatting utilities

### Potential Future Integrations
- **Bible API services**: ESV API, Bible Gateway API, or YouVersion API for expanded verse content
- **Authentication providers**: For user account management
- **Push notification services**: For daily verse reminders
- **Social sharing APIs**: Enhanced sharing capabilities