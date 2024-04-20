import express from "express";
import { isLoggedIn, getProducts } from "../controllers/auth.js";

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  if (req.user) res.render("home", { user: req.user });
  else res.render("home");
});

router.get("/login", isLoggedIn, (req, res) => {
  if (req.user) res.render("profile", { user: req.user });
  else res.render("login");
});

router.get("/register", isLoggedIn, (req, res) => {
  if (req.user) res.render("profile", { user: req.user });
  else res.render("register");
});

router.get("/profile", isLoggedIn, getProducts, (req, res) => {
  if (req.user)
    res.render("profile", { user: req.user, products: req.products });
  else res.redirect("/login");
});

export default router;
