
# Smart Accident Detection System — Frontend

## Overview
A dashboard-heavy, data-dense React frontend for a smart accident detection system with three user roles: **Driver**, **Hospital**, and **Admin**. All API/socket service layers will be built with configurable endpoints ready to connect to your backend — no mock data. Screens show empty states when no data is available.

---

## 1. Authentication & Routing
- **Login page** with email/password form, calling your backend auth endpoint
- **Register page** with role selection (Driver / Hospital)
- **Forgot/Reset password** pages
- **Protected routes** that redirect unauthenticated users to login
- **Role-based routing** — after login, redirect to the appropriate dashboard based on user role

## 2. Shared Layout & Navigation
- **Sidebar navigation** with role-specific menu items (collapsible with icons)
- **Top header** with user avatar, notifications bell, and logout
- **Theme**: Dark/light mode toggle
- **Responsive** — works on desktop and tablet

## 3. Driver Portal
- **Dashboard**: Stats cards (total trips, incidents, active trip status), recent activity feed
- **SOS / Emergency Button**: Large panic button that triggers emergency API call, countdown timer with cancel option
- **Emergency Contacts**: List and manage emergency contacts
- **Active Trip**: Current trip view with Google Maps showing route and location
- **Trip History**: Table of past trips with details view
- **Profile & Settings**: Edit personal info, vehicle info, notification preferences

## 4. Hospital Portal
- **Dashboard**: Stats cards (active incidents, pending responses, ambulances available), live incident feed
- **Incident List**: Filterable/sortable table of all incidents with status badges
- **Incident Details**: Full incident view with map location, driver info, timeline of events
- **Ambulance Management**: List of ambulances with availability status, dispatch controls
- **Responder Management**: Team list, assignment to incidents
- **Analytics**: Charts for response times, incident trends, performance metrics using Recharts

## 5. Admin Portal
- **Dashboard**: System-wide stats (total users, incidents, hospitals, system health)
- **User, ability to view/edit roles
- **System Health**: Status indicators for services (API, socket, database)
- **System Logs**: Searchable log viewer
- **Reports**: Exportable system reports and analytics

## 6. Emergency Flow
- **Alert Screen**: Full-screen emergency alert with incident details, responder tracking on map
- **Safety Instructions**: First aid tips and safety guidelines shown during emergency
- **Responder Tracker**: Real-time map showing ambulance approach (via socket)

## 7. Google Maps Integration
- Map components using Google Maps JavaScript API (you'll provide your API key)
- Incident location markers, ambulance tracking, route visualization
- Map controls for zoom, satellite view

## 8. Service Layer (API-Ready, No Mock Data)
- **Axios instance** with base URL config, auth token interceptor, error handling
- **Service modules**: auth, user, emergency, hospital, trip, location — each with typed methods calling your API endpoints
- **Socket.IO client** setup with connection management, event listeners for real-time emergency alerts and location updates
- All components show proper **empty states** and **loading states** when no backend data is available

## 9. Type System
- Full TypeScript types for User, Incident, Location, Hospital, Trip, Socket events, API responses
- Shared constants for routes, incident statuses, roles, socket events
