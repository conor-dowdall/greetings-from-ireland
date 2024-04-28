import express from "express";
import { isLoggedIn } from "../controllers/auth-controller.mjs";
import {
  subscribeEmail,
  getProducts,
  buyProduct,
} from "../controllers/pages-controller.mjs";

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  if (req.user) res.render("home", { user: req.user });
  else res.render("home");
});

router.post("/subscribe", subscribeEmail);

router.get("/register", isLoggedIn, (req, res) => {
  if (req.user) res.redirect("/profile");
  else res.render("register");
});

router.get("/login", isLoggedIn, (req, res) => {
  if (req.user) res.redirect("/profile");
  else res.render("login");
});

router.get("/profile", isLoggedIn, getProducts, (req, res) => {
  if (req.user)
    res.render("profile", { user: req.user, products: req.products });
  else res.redirect("/login");
});

router.post("/profile", isLoggedIn, buyProduct, (req, res) => {
  if (req.user) res.redirect("/profile");
  else res.redirect("/login");
});

export default router;
