import express from "express";
import {
  getProducts,
  purchaseProduct,
  subscribeEmail,
} from "../controllers/pages-controller.mjs";
import { getLoggedInUser } from "../controllers/auth-controller.mjs";

const router = express.Router();

router.get("/", getLoggedInUser, (req, res) => {
  res.render("home", { user: req.user });
});

router.post("/subscribe", subscribeEmail);

router.get("/register", getLoggedInUser, (req, res) => {
  if (req.user) res.redirect("/profile");
  else res.render("register");
});

router.get("/login", getLoggedInUser, (req, res) => {
  if (req.user) res.redirect("/profile");
  else res.render("login");
});

router
  .route("/profile")
  .get(getLoggedInUser, getProducts, (req, res) => {
    if (req.user)
      res.render("profile", { user: req.user, products: req.products });
    else res.redirect("/login");
  })
  .post(getLoggedInUser, purchaseProduct, (req, res) => {
    if (req.user) res.redirect("/profile");
    else res.redirect("/login");
  });

export default router;
