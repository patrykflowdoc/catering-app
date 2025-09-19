# Overview

This is a full-stack food ordering application built with React (frontend) and Express.js (backend). The application allows users to browse a menu of food items (soups, main courses, and desserts), select items, and place orders with delivery information. The interface is designed in Polish language and features a modern, responsive design using shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety and modern development
- Vite for fast development and optimized builds
- Wouter for lightweight client-side routing
- TanStack Query for server state management and API caching
- React Hook Form with Zod for form validation
- shadcn/ui component library for consistent UI components
- Tailwind CSS for styling with CSS custom properties for theming

**Key Design Decisions:**
- Single-page application with minimal routing (home page and 404 fallback)
- Component-based architecture with reusable UI components
- Form validation using schema-first approach with Zod
- State management through React Query for server data and local state for UI interactions
- Responsive design with mobile-first approach

## Backend Architecture

**Technology Stack:**
- Express.js with TypeScript for the REST API server
- In-memory storage implementation (MemStorage class) for development
- Drizzle ORM configured for PostgreSQL (production-ready schema defined)
- Zod for request validation and type safety
- ESBuild for production bundling

**API Design:**
- RESTful endpoints for order management:
  - POST /api/orders - Create new order
  - GET /api/orders - Retrieve all orders
  - GET /api/orders/:id - Retrieve specific order
- Comprehensive error handling with proper HTTP status codes
- Request logging middleware for debugging and monitoring

**Data Storage Strategy:**
- Development: In-memory storage using Map data structure
- Production-ready: PostgreSQL schema defined with Drizzle ORM
- Schema includes orders table with customer information, selected items (stored as JSONB), pricing, and timestamps

## Database Schema

**Orders Table:**
- Primary key with UUID generation
- Customer contact information (name, phone, email)
- Delivery scheduling and special instructions
- Selected items stored as JSONB for flexibility
- Pricing breakdown (subtotal, delivery fee, total)
- Audit timestamps for order tracking

## Build and Development

**Development Workflow:**
- Hot module replacement via Vite for frontend development
- TypeScript compilation with strict type checking
- Concurrent frontend and backend development with proxy setup
- Automatic server restart on backend changes

**Production Build:**
- Frontend: Vite optimized build with code splitting
- Backend: ESBuild bundling for Node.js deployment
- Single deployment artifact with static file serving

# External Dependencies

## UI Framework
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## Development Tools
- **Vite**: Build tool with HMR and optimized production builds
- **TypeScript**: Static typing for improved development experience
- **ESBuild**: Fast JavaScript bundler for backend compilation

## Database and ORM
- **Neon Database**: Serverless PostgreSQL for production deployment
- **Drizzle ORM**: Type-safe database toolkit with schema migrations
- **PostgreSQL**: Production database (configured but not actively used in current implementation)

## Form and Data Handling
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation for both frontend forms and backend APIs
- **TanStack Query**: Server state management with caching and background updates

## Styling and Icons
- **Lucide React**: Consistent icon library
- **Class Variance Authority**: Utility for managing component variants
- **clsx & tailwind-merge**: Conditional class name utilities

## Runtime Environment
- **Node.js**: JavaScript runtime for backend services
- **Express.js**: Web framework for REST API development
- **tsx**: TypeScript execution environment for development