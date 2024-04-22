import express from "express";
import {
  subscribeEmail,
  isLoggedIn,
  getProducts,
  buyProduct,
} from "../controllers/auth.js";

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  // if a user is logged in, req.user is present
  //   pass that info to the home page, to be displayed
  if (req.user) res.render("home", { user: req.user });
  else res.render("home");
});

router.post("/subscribe", subscribeEmail);

router.get("/login", isLoggedIn, (req, res) => {
  // if a user is logged in, req.user is present
  //   pass that info to the profile page, so the
  //   relevant user profile can be displayed
  // otherwise, show the login page
  if (req.user) res.redirect("/profile");
  else res.render("login");
});

router.get("/register", isLoggedIn, (req, res) => {
  // if a user is logged in, req.user is present
  //   pass that info to the profile page, so the
  //   relevant user profile can be displayed
  // otherwise, show the login page
  if (req.user) res.redirect("/profile");
  else res.render("register");
});

router.get("/profile", isLoggedIn, getProducts, (req, res) => {
  // if a user is logged in, req.user is present
  //   we then get the user's products/purchases info
  //   and pass that info to the profile page, so the
  //   relevant user profile with purchasable/purchased products
  // otherwise, show the login page
  if (req.user)
    res.render("profile", { user: req.user, products: req.products });
  else res.redirect("/login");
});

router.post("/profile", isLoggedIn, buyProduct, (req, res) => {
  // if a user is logged in, req.user is present
  //   we can then buy the selected greeting
  //   by updating the orders table in the database
  //   then reload the profile page, which will update the
  //   greetings list, allowing the purchased greeting to be played
  //   instead of purchased
  // otherwise, show the login page
  if (req.user) res.redirect("/profile");
  else res.redirect("/login");
});

export default router;
