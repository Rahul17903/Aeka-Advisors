# 🎨 Creative Showcase — MERN Stack Application

## Project Overview

A full-stack Creative Showcase Platform where artists can upload, manage, and showcase their digital artwork, discover other creators, and build an online portfolio.
Built with modern MERN stack best practices, clean architecture, and production-ready features.

---

## 🚀 Live Features

### 👤 Authentication & Users
* Secure user authentication (JWT + HTTP-only cookies)
* User profiles (private dashboard & public profile)
* Protected routes for authenticated users

### 🖼 Artwork Management
* Upload artwork with image and metadata
* Edit & delete artworks
* View counts, likes, and engagement tracking
* Featured artworks on landing page

### 🔍 Discovery & Browsing
* Browse artworks by category
* Featured & trending artworks
* Sorting (newest, popular, most liked)
* Responsive artwork grid & list views

### 📊 Dashboard Analytics
* Total uploads
* Total views
* Total likes
* Engagement rate calculation

### 🎨 UI & UX
* Fully responsive design
* Tailwind CSS styling
* Modern landing page & dashboard UI
* Reusable components & clean layouts

---

## 🛠 Tech Stack
 
### Frontend (Client)
* React (Vite)
* Tailwind CSS
* React Router
* Context API
* Axios
* Heroicons

### Backend (Server)
* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* CLOUDINARY
* CORS & Security Middleware

---

## 📁 Project Structure
```
Creative-showcase/
│
├── client/                     # Frontend (Vite + React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Node + Express)
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── env.local
│   ├── server.js
│   └── package.json
│
└── README.md
```
---

## ⚙️ Environment Variables
### Client (client/.env)

```
VITE_API_URL=http://localhost:5000
```
### Server (server/.env)
```
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/creative-showcase
JWT_SECRET=rahul

# Cloudinary
CLOUDINARY_CLOUD_NAME=CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=CLOUDINARY_API_SECRET

# Client
REACT_APP_API_URL=http://localhost:5173
```
---

## Getting Started (Local Setup)
### 1️⃣ Clone the Repository
```
git clone https://github.com/Rahul17903/Aeka-Advisors.git
cd creative-showcase
```
### 2️⃣ Install Dependencies
**Frontend**
```
cd client
npm install
```
** Backend **
``` 
cd server
npm install
```
### 3️⃣ Run the Application
**Start Backend**
``` cd server
npm run dev
```
**Start Frontend**
```
cd client
npm run dev
```
Frontend runs on:
👉 http://localhost:5173  
Backend runs on:
👉 http://localhost:5000

---

## 🔐 API Architecture (Highlights)
* RESTful API structure
* Centralized error handling
* MVC pattern (Models, Routes, Middleware)
* Secure cookies & CORS configuration
* Clean separation of concerns

---

## 👨‍💻 About the Developer
**Rahul Ghosh**  
MERN Stack Developer/ Node.Js Developer

* GitHub: [https://github.com/Rahul17903](https://github.com/Rahul17903)
* Portfolio: [https://rahulghosh.me](https://rahulghosh.me)
