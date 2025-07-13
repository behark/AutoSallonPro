# ANI Auto Sallon Website Documentation

## Overview
This document provides comprehensive information about the ANI Auto Sallon website, including instructions for managing vehicle listings, using the admin features, and maintaining the website after deployment.

## Table of Contents
1. [Website Structure](#website-structure)
2. [Manual Car Posting Guide](#manual-car-posting-guide)
3. [Social Media Integration](#social-media-integration)
4. [Admin Features](#admin-features)
5. [Deployment Information](#deployment-information)
6. [Monitoring & Analytics](#monitoring-analytics)
7. [Troubleshooting](#troubleshooting)

## Website Structure

The website is built with the following core components:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Styling**: Tailwind CSS with custom components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API for global state
- **Data Storage**: LocalStorage for client-side data persistence
- **API Mocking**: Mock Service Worker (MSW) for simulating API responses
- **Analytics**: Google Analytics for visitor tracking
- **Error Monitoring**: Sentry for error tracking and monitoring

### Main Pages:
- **Home**: Landing page with featured vehicles and services
- **Inventory**: Complete vehicle listing with filtering capabilities
- **VehicleDetails**: Detailed information about a specific vehicle
- **About**: Information about ANI Auto Sallon
- **Contact**: Contact form and dealer information
- **Admin**: Vehicle management interface for adding/editing listings

## Manual Car Posting Guide

### Accessing the Admin Area
1. Navigate to `/admin` in your browser
2. If authentication is required, log in with your admin credentials

### Adding a New Vehicle
1. In the Admin dashboard, click "Add New Vehicle" button
2. Fill out the vehicle details form:
   - **Basic Information**:
     - Brand/Make: Vehicle manufacturer (e.g., BMW, Mercedes)
     - Model: Specific model name
     - Year: Manufacturing year
     - Price: Selling price in Euros
     - VIN: Vehicle identification number (optional)
   
   - **Specifications**:
     - Mileage: Vehicle mileage in km
     - Engine: Engine type and capacity (e.g., "2.0 TDI")
     - Transmission: Type of transmission (e.g., Automatic, Manual)
     - Fuel Type: Type of fuel used (e.g., Diesel, Petrol, Electric)
     - Body Type: Vehicle body style (e.g., Sedan, SUV)
     - Condition: Vehicle condition (e.g., New, Used)
     - Color: Exterior color
     - Interior: Interior material and color

   - **Features**:
     - Select all applicable features from the provided list
     - You can add custom features by typing them and pressing Enter

   - **Description**:
     - Write a detailed description of the vehicle
     - Include any special features or selling points
     - Mention any warranty information

   - **Images**:
     - Upload multiple images of the vehicle
     - First image will be used as the main/featured image
     - Recommended: Include exterior photos from multiple angles, interior shots, and any notable features

3. Click "Save Vehicle" to publish the listing

### Editing an Existing Vehicle
1. In the Admin dashboard, find the vehicle you want to edit
2. Click the "Edit" button next to the vehicle
3. Make your desired changes in the form
4. Click "Update Vehicle" to save your changes

### Deleting a Vehicle
1. In the Admin dashboard, find the vehicle you want to delete
2. Click the "Delete" button next to the vehicle
3. Confirm the deletion when prompted

## Social Media Integration

The website features integration with Instagram and Facebook for automatic car imports:

### Instagram Integration
- Connected to: https://www.instagram.com/aniautosallon/
- Automatically imports vehicles posted on Instagram with proper hashtags
- Required hashtags: #forsale #carforsale #aniautosallon

### Facebook Integration
- Connected to ANI Auto Sallon Facebook page
- Imports vehicles from Facebook Marketplace listings
- Requires Facebook business page to be connected

### Manual Social Media Management
If Meta verification is not possible:
1. Use the manual car posting feature as described above
2. Post vehicles separately to your social media accounts
3. Ensure consistent information across platforms

## Admin Features

### Dashboard Overview
- View key metrics: total vehicles, recent views, inquiries
- Quick access to add/edit vehicles

### User Management
- Add/remove admin users (if applicable)
- Manage permissions

### Website Settings
- Update contact information
- Modify business hours
- Change featured vehicles on homepage

## Deployment Information

### Hosting
- The website is deployed on Netlify
- Domain: aniautosallon.com

### Environment Variables
The following environment variables are used:
- `VITE_GA_MEASUREMENT_ID`: Google Analytics tracking ID
- `VITE_SENTRY_DSN`: Sentry error tracking DSN
- `VITE_API_BASE_URL`: API base URL (if applicable)
- `VITE_ENABLE_DEBUG`: Enable debug features (true/false)
- `VITE_ASSETS_URL`: CDN URL for assets (if applicable)

### Deployment Updates
To deploy updates:
1. Push changes to the main branch of the repository
2. Netlify will automatically build and deploy the changes
3. Verify the deployment in the Netlify dashboard

## Monitoring & Analytics

### Google Analytics
- Access: https://analytics.google.com
- Key metrics to monitor:
  - Page views
  - User engagement
  - Traffic sources
  - Device types
  - User flow

### Sentry Error Monitoring
- Access: https://sentry.io
- Monitors JavaScript errors and exceptions
- Set up alerts for critical errors

## Troubleshooting

### Common Issues

#### Website Not Loading
1. Check Netlify deployment status
2. Verify domain DNS configuration
3. Clear browser cache and reload

#### Car Images Not Displaying
1. Verify image URLs are correct
2. Check for CORS issues
3. Ensure image formats are supported (.jpg, .png, .webp)

#### Social Media Imports Not Working
1. Verify Meta API credentials are valid
2. Check that proper hashtags are being used
3. Ensure posts are public and accessible

#### Admin Access Issues
1. Clear browser cache and cookies
2. Reset admin password if necessary
3. Check browser console for JavaScript errors

### Support Contacts
For technical support:
- Email: [tech support email]
- Phone: [tech support phone]

---

*Last Updated: July 13, 2025*
