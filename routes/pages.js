import express from "express";
import { isLoggedIn } from "../controllers/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

export default router;
