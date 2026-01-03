import express from "express";
import { body } from "express-validator";

import validate from "../middleware/validate.middleware.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken
} from "../controllers/auth.controller.js";

const router = express.Router();

/* -------------------- REGISTER -------------------- */
router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  validate,
  registerUser
);

/* -------------------- LOGIN -------------------- */
router.post(
  "/login",
  [
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please provide a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
  ],
  validate,
  loginUser
);

/* -------------------- REFRESH TOKEN -------------------- */
router.post(
  "/refresh",
  [
    body("refreshToken")
      .notEmpty()
      .withMessage("Refresh token is required")
  ],
  validate,
  refreshAccessToken
);

export default router;
