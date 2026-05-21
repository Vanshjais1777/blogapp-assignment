# Blog Platform with Authentication, Roles & SEO

A comprehensive, production-ready blog platform built with Node.js, Express, React (Vite), and Next.js. It features a complete role-based admin panel and a highly SEO-optimized frontend.

## 🚀 Features

- **SEO Optimized**: Fully server-side rendered (SSR) public frontend using Next.js with complete meta tags, OpenGraph, Canonical URLs, and JSON-LD structured data.
- **Role-Based Access Control (RBAC)**: Secure multi-tier user authorization.
- **Premium Admin Dashboard**: Built with React, featuring glassmorphism design, Redux state management, and a rich text editor (React-Quill).
- **RESTful API**: Node.js backend using Express and MongoDB.

## 👥 Role Permissions

| Role        | Permissions                                                                 |
| ----------- | --------------------------------------------------------------------------- |
| Super Admin | Full access (manage all users, roles, edit/delete any blogs, system settings) |
| Editor      | Create, edit, and delete any blog posts. Manage SEO configurations.          |
| Author      | Create and manage (edit/delete) only their own blog posts.                  |
| Viewer/User | Read-only access to published public content. Cannot access admin panel.    |

## 🛠️ Setup Steps

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or a MongoDB URI

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/blog-platform
JWT_SECRET=your_jwt_secret_key_here
```
Run backend: `npm run dev` (if nodemon is installed) or `node server.js`

### 2. Admin Panel Setup
```bash
cd admin-panel
npm install
npm run dev
```
Access the admin dashboard at `http://localhost:5173`.
*(Note: Create a super admin user directly via the API or MongoDB, or register a user and update their role via DB for initial access).*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Access the public SEO-optimized blog at `http://localhost:3000`.

## 🧾 SEO Features Implemented

1. **Dynamic Meta Tags**: Automatically generated Title and Description per post.
2. **Open Graph & Twitter Cards**: Native support for rich social media sharing.
3. **Canonical URLs**: Built-in support to prevent duplicate content issues.
4. **Structured Data (JSON-LD)**: Search engines can easily understand the `BlogPosting` schema.
5. **Server-Side Rendering**: Fast delivery and indexable content out of the box with Next.js.
6. **Clean URL Slugs**: Human-readable, SEO-friendly slugs.

## 📡 API Documentation

### Auth & Users
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get JWT token
- `GET /api/users` - Get all users (Super Admin only)
- `PUT /api/users/:id` - Update user role/status (Super Admin only)
- `DELETE /api/users/:id` - Delete user (Super Admin only)

### Blogs
- `GET /api/blogs` - Get all published blogs
- `GET /api/blogs?all=true` - Get all blogs (requires Auth, role-specific logic)
- `GET /api/blogs/:slug` - Get single blog by slug
- `POST /api/blogs` - Create a new blog (Admin, Editor, Author)
- `PUT /api/blogs/:id` - Update blog (Admin, Editor, Author)
- `DELETE /api/blogs/:id` - Delete blog (Admin, Editor, Author)

## 📸 Screenshots

*(To be added - The system features a stunning glassmorphism admin panel and a beautiful dark-mode Next.js frontend reader experience).*
