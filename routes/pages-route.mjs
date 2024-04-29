import express from "express";
import {
  getProducts,
  buyProduct,
  subscribeEmail,
} from "../controllers/pages-controller.mjs";
import { isLoggedIn } from "../controllers/auth-controller.mjs";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", { user: req.user });
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

router
  .route("/profile")
  .get(isLoggedIn, getProducts, (req, res) => {
    if (req.user)
      res.render("profile", { user: req.user, products: req.products });
    else res.redirect("/login");
  })
  .post(isLoggedIn, buyProduct, (req, res) => {
    if (req.user) res.redirect("/profile");
    else res.redirect("/login");
  });

export default router;
