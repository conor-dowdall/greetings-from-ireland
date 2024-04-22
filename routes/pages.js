import express from "express";
import { isLoggedIn, getProducts, buyProduct } from "../controllers/auth.js";

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

router.post("/profile", isLoggedIn, buyProduct, getProducts, (req, res) => {
  if (req.user) res.redirect("/profile");
  else res.redirect("/login");
});

export default router;
