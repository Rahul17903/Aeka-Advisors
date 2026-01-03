# 📝 Smart ToDo API

A secure and scalable RESTful backend API for task management built using **Node.js, Express, and MongoDB**.  
This project supports **JWT-based authentication** and **user-specific task CRUD operations**.

---

## 🚀 Features

- User Registration & Login (JWT Authentication)
- Access Token & Refresh Token
- User-specific task management
- Create, Read, Update & Delete tasks
- Protected routes with authentication middleware
- Centralized error handling
- Input validation
- Rate limiting & CORS enabled

---

## 🧰 Tech Stack

- Node.js
- Express.js
- MongoDB (NoSQL)
- Mongoose
- JWT (Authentication)
- bcrypt
- express-validator
- CORS


---

## 📁 Project Structure

Smart-ToDo-API/
│
├── config/
│ └── db.js
│
├── controllers/
│ ├── auth.controller.js
│ └── task.controller.js
│
├── middleware/
│ ├── auth.middleware.js
│ ├── error.middleware.js
│ └── validate.middleware.js
│
├── models/
│ ├── User.model.js
│ └── Task.model.js
│
├── routes/
│ ├── auth.routes.js
│ └── task.routes.js
│
├── .env
├── server.js
└── package.json

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_access_token_secret
- JWT_REFRESH_SECRET=your_refresh_token_secret


---

## 📦 Installation & Setup

# Clone the repository
git clone https://github.com/Rahul17903/Aeka-Advisors.git

# Navigate to project folder
cd smart-todo-api

# Install dependencies
npm install

# Start the server
npm run start

---

## 📡 API Endpoints

# 🔐 Authentication
| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register a new user  |
| POST   | `/api/auth/login`    | Login user           |
| POST   | `/api/auth/refresh`  | Refresh access token |

# 📝 Tasks (Protected Routes)
| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| POST   | `/api/tasks`     | Create a task |
| GET    | `/api/tasks`     | Get all tasks |
| PUT    | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

# 📌 Authorization Header Required
Authorization: Bearer <access_token>

---

## 🧪 API Testing
All endpoints were tested using Postman.

# Testing Flow:
1. Register user
2. Login and receive JWT tokens
3. Access protected task routes
4. Perform CRUD operations on tasks

---

## 🛡 Security Practices

- Password hashing using bcrypt
- JWT-based authentication
- Refresh token implementation
- Input validation using middleware
- Rate limiting to prevent abuse
- Centralized error handling
- Environment variable protection

---

## 🧠 Project Summary

This project demonstrates a real-world backend REST API with authentication, authorization, and database integration using Node.js and MongoDB.

---

## 📦 Postman Collection

A Postman collection is included in this repository to test all API endpoints.
Import the collection into Postman and run the requests.

---

## 👨‍💻 Author

Rahul Ghosh
NodeJs Developer / Full-Stack Developer

* GitHub: [https://github.com/Rahul17903](https://github.com/Rahul17903)
* Portfolio: [https://rahulghosh.me](https://rahulghosh.me)