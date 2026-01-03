import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import errorHandler from "./middleware/error.middleware.js";

dotenv.config();
connectDB();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

// Parse JSON body
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "*", // replace with frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

// Rate Limiting (anti-abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: "Too many requests, please try again later"
});

app.use(limiter);

/* -------------------- ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Smart ToDo API is running");
});

/* -------------------- ERROR HANDLER -------------------- */

// Must be LAST middleware
app.use(errorHandler);

/* -------------------- SERVER -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
