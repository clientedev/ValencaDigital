# Valença & Soares Law Firm Website

## Overview

This is a full-stack web application for a Brazilian law firm (Valença & Soares Advogados Associados) built with React frontend and Express backend. The application serves as both a professional law firm website and a blog platform featuring legal articles. The site includes practice area showcases, contact forms, and a complete blog management system with like functionality.

The design has been redesigned to be more faithful to the FAS Advogados aesthetic (fasadv.com.br), featuring a clean, sophisticated style with modern typography, subtle animations, and the "Pessoas Excelência Resultados" concept prominently displayed in the hero section.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Follow FAS Advogados style and aesthetic closely

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Validation**: Zod schemas for request validation
- **Storage**: Dual storage approach - in-memory storage for development and Drizzle ORM ready for PostgreSQL
- **Session Management**: Session-based authentication for anonymous blog interactions

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Three main entities:
  - Users table for future authentication
  - Blog posts with full content, metadata, and like counts
  - Blog likes with session-based tracking for anonymous users
- **Migrations**: Drizzle Kit for schema migrations

### Authentication System
- **Admin Access**: Simple password-based authentication for blog management
- **Session Management**: Browser localStorage for admin state persistence
- **Anonymous Interactions**: Session ID generation for blog likes without user registration

### Development Workflow
- **Hot Reload**: Vite development server with HMR
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Code Organization**: Monorepo structure with shared types between client and server
- **Build Process**: Separate builds for client (Vite) and server (esbuild)

## External Dependencies

### Core Framework Dependencies
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **express**: Web application framework for Node.js
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: Database schema management and migrations

### UI Component Library
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Database Integration
- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Validation and Type Safety
- **zod**: Runtime type validation and schema definition
- **drizzle-zod**: Integration between Drizzle ORM and Zod schemas

### Development Tools
- **tsx**: TypeScript execution for development
- **vite**: Build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements