# AUTO ANI - Premium Used Car Dealership

## Overview

AUTO ANI is a premium used car dealership application built for a business in Mitrovica, Kosovo, specializing in quality vehicle imports from Finland and Germany. The application features a modern web interface for browsing inventory, submitting custom orders, and contacting the dealership.

## User Preferences

Preferred communication style: Simple, everyday language.
**Full Admin Access Granted**: User has complete control over website content, vehicle inventory, and all site functionality. User can independently manage all aspects without needing developer assistance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **Styling**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Development**: Hot reload with Vite integration
- **Storage**: In-memory storage with interface for easy database migration

### Key Components

#### Frontend Pages
- **Home**: Hero section, featured vehicles, brand showcase, testimonials
- **Inventory**: Vehicle browsing with filtering capabilities
- **Services**: Custom order form and service descriptions
- **About**: Company information and milestones
- **Contact**: Contact form and business information

#### Backend API Endpoints
- `/api/vehicles` - Vehicle CRUD operations
- `/api/vehicles/featured` - Featured vehicles
- `/api/vehicles/available` - Available vehicles
- `/api/custom-orders` - Custom order submissions
- `/api/contact` - Contact form submissions

#### Internationalization
- Multi-language support (English, Albanian, Croatian, Serbian)
- Geolocation-based language detection
- Dynamic translation system

## Data Flow

### Vehicle Management
1. Vehicles stored with comprehensive metadata (brand, model, year, price, images, features)
2. Filtering system for brand, price range, year, fuel type, transmission
3. Featured vehicle highlighting for homepage display
4. Import country tracking (Finland/Germany)

### Custom Orders
1. Customer submits detailed vehicle requirements
2. Order stored with status tracking (pending, processing, completed, cancelled)
3. Form validation using Zod schemas
4. Email notifications for new orders

### Contact Management
1. Contact form submissions with service interest categorization
2. Message read/unread status tracking
3. Phone and email contact options
4. WhatsApp and social media integration

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation
- **@radix-ui/react-***: UI component primitives
- **wouter**: Client-side routing
- **zod**: Schema validation
- **tailwindcss**: CSS framework

### Database Integration
- **Drizzle ORM**: Database ORM with PostgreSQL dialect
- **@neondatabase/serverless**: Database connection
- **connect-pg-simple**: Session storage (ready for PostgreSQL)

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety
- **ESLint/Prettier**: Code quality (implicit)

## Deployment Strategy

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Single deployment artifact with both frontend and backend

### Environment Configuration
- Database URL configuration via environment variables
- Development/production mode switching
- Replit-specific optimizations included

### Database Migration
- Drizzle schema defined in `shared/schema.ts`
- Migration files generated in `./migrations`
- Ready for PostgreSQL deployment with `npm run db:push`

### Current Storage
- In-memory storage implementation with sample vehicle data
- Interface-based design allows easy migration to PostgreSQL
- Working vehicle inventory with BMW and Mercedes models

### Facebook Integration Status
- Facebook API service implemented with basic page information
- Currently using user access token (Behar Kabashi account)
- Displays AUTO ANI business information correctly
- Instagram integration requires Facebook Business Manager setup
- For full Instagram feed: need Instagram Business Account linked to Facebook page

### Recent Progress (July 10-11, 2025)
- Successfully deployed functional automotive website
- Vehicle inventory displaying correctly with pricing in euros
- Multi-language support working (Albanian, English, Croatian, Serbian)
- Custom order and contact forms operational
- Facebook service showing AUTO ANI business details
- Website ready for production deployment
- **Admin Interface**: Full vehicle management system at `/admin`
- **User Access**: Complete editing permissions granted for all website content
- **Real Inventory**: Replaced sample data with authentic VW Tiguan from Facebook
- **Vehicle Details**: Clickable cars now show detailed pages with real specifications
- **Image Upload**: Added direct photo upload from PC with live preview
- **Enhanced Admin**: Both URL input and file upload options for maximum flexibility
- **COMPLETE INLINE EDITING**: Full double-click editing implemented across ALL pages
- **Total Page Coverage**: Home, Services, About, and Inventory pages all fully editable
- **Comprehensive Control**: Every text element, title, description, and button is now editable
- **Real-time Updates**: All edits save instantly and appear immediately on the website
- **FEATURED VEHICLES FIX**: Fixed homepage display issue - featured vehicles now show correctly
- **UNIVERSAL TEXT EDITOR**: Revolutionary new editing system allowing you to add anything anywhere
- **ULTIMATE FLEXIBILITY**: 9 different element types (text, titles, buttons, images, links, badges, custom HTML)
- **ADVANCED POSITIONING**: Place elements before, after, or replace any existing content
- **STYLE PRESETS**: Built-in styling options plus custom CSS classes for unlimited design control
- **ELEMENT MANAGEMENT**: Full visibility control, editing, and deletion of custom elements

### Admin Capabilities
- **Complete Vehicle Management**: Add/Edit/Delete any vehicle through `/admin` interface
- **Photo Management**: Upload and manage vehicle photos via URL links
- **Pricing Control**: Set and modify all vehicle prices and availability
- **Featured Vehicles**: Mark vehicles as featured for homepage display
- **Full Content Control**: Edit all website content, text, and information
- **Independent Operation**: No developer assistance required for any changes
- **Real-time Updates**: All changes appear immediately on the website

### How to Use Your Admin Interface
1. **Access Admin Panel**: Click "Admin" in the top navigation menu
2. **Add New Vehicles**: Use "Add New Vehicle" button to create listings
3. **Edit Existing Vehicles**: Click edit button on any vehicle card
4. **Delete Vehicles**: Use trash button to remove vehicles
5. **Upload Photos**: Upload images directly from your PC or paste URLs
6. **Set Pricing**: Enter prices in euros (€) for accurate local pricing
7. **Featured Status**: Toggle featured status for homepage display

### How to Use Inline Editing (NEW!)
1. **Double-Click Any Text**: On any page, double-click any text to edit it instantly
2. **Edit Everything**: All titles, descriptions, button text, and content is editable
3. **Save Changes**: Click "Save" to apply changes immediately
4. **Cancel Edits**: Click "Cancel" to discard changes
5. **Full Control**: Works on Home, Services, About, and Inventory pages
6. **Rich Editing**: Some sections support rich text formatting and photo management

### Photo Upload Options
- **From Computer**: Click "Upload from PC" to select images from your device
- **From URLs**: Paste image links in the URL field (comma-separated)
- **Multiple Images**: Upload up to 10 images per vehicle
- **File Support**: JPG, PNG, GIF up to 5MB each
- **Live Preview**: See uploaded images immediately with remove option

### SEO & Performance
- Comprehensive meta tags and Open Graph support
- Structured data for automotive business
- Optimized images and lazy loading
- Geographic targeting for Kosovo market

The application is designed for easy deployment on Replit with automatic database provisioning and includes all necessary configurations for a production automotive dealership website.