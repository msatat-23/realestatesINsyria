# RealEstate Web Application

A full-stack real estate platform built with **Next.js**, **Prisma**, and **PostgreSQL**, featuring authentication, property management, search, subscriptions, real-time notifications, and a full admin dashboard.

---

## Table of Contents

- [Features](#features)
  - [Authentication](#authentication)
  - [Property Management](#property-management)
  - [Search and Filtering](#search-and-filtering)
  - [User Profile](#user-profile)
  - [Dashboard](#dashboard)
  - [Advanced Features](#advanced-features)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Features

### Authentication

- Sign up with first name, last name, username, phone, email, and password with confirmation.
- Email confirmation using a token.
- Passwords encrypted with **bcrypt**.
- Login with email and password using **NextAuth**.
- Optional **2FA** code verification.
- Forgot password feature using email token to reset password.

### Property Management

- Users can add properties via a multi-step form:
  - Title, description, type, status, purpose.
  - Exact location (governorate, city, region, street).
  - Images and video upload.
  - Amenities selection.
  - Validation on all fields.
- Notifications for property review and acceptance/refusal.
- Users can update, delete, or save properties.
- Users can subscribe for additional features.

### Search and Filtering

- Text search for properties.
- Filter by type, status, price, area, and other options.
- Advanced search by multiple filters simultaneously.
- **Pagination** implemented for search results.

### User Profile

- Edit personal info: name, username, phone, password, profile image.
- View added properties.
- Profile settings: change password, privacy settings, enable 2FA, sign out, delete account.
- Communication with platform administration.

### Dashboard

The dashboard supports **three roles**: **User**, **Admin**, and **SuperAdmin**.

- **User**: regular platform user.
- **Admin**: can manage almost all dashboard features.
- **SuperAdmin**: can add/remove admins in addition to all admin features.

#### Dashboard Sections:

1. **Main Page**: platform statistics (properties, users, complaints, subscriptions, branches).
2. **Users Section**: view user details, properties, remove user, alter subscriptions.
3. **Properties Section**: accept/refuse property, view property details, delete property.
4. **Location Management**: view/add/remove governorates, regions, cities, with filters.
5. **Subscriptions & Complaints**: manage user subscriptions and complaints.
6. **SuperAdmin Exclusive**: add user, admin, or superadmin with role assignment.
7. **Pagination** applied to all dashboard lists (users, properties, complaints, subscriptions, locations).

**Dashboard images are located in:** `/public/assets/images/dashboard_images`

---

### Advanced Features

- **WebSocket Real-Time Notifications**:
  - Users and Admins receive real-time updates when properties are added, updated, deleted, or when subscriptions/complaints/users change.
  - Admin notifications secured with **JWT authentication**.
  - WebSocket server hosted on **Railway**.

- **Cloudinary Media Upload**:
  - Upload images and videos to Cloudinary.
  - Supports deletion and updates of media files when properties are modified or deleted.

---

## Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes, ServerActions, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth, bcrypt, 2FA
- **Real-Time Notifications:** WebSocket server (Railway)
- **Media Storage:** Cloudinary
- **Hosting:** Netlify (frontend) / custom backend server

---

## Screenshots

Include important images of your platform (dashboard, property card, property details, etc.). Example:

`![Dashboard Screenshot](./path-to-your-image.png)`  
_Main dashboard showing platform statistics_

`![Property Card](./path-to-your-image.png)`  
_Property card view with basic info_

`![Property Details](./path-to-your-image.png)`  
_Detailed property page with images, video, and amenities_

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/msatat-23/realestatesINsyria.git
cd realestatesINsyria
npm install
npx prisma migrate dev
npm run dev

```
