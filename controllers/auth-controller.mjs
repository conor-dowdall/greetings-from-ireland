import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { promisify } from "util";
import {
  mysqlGetUserById,
  mysqlGetUserByEmail,
  mysqlAddUser,
} from "./mysql-pool-controller.mjs";

async function decodeCookie(cookieToken) {
  const decodedCookie = await promisify(jwt.verify)(
    cookieToken,
    process.env.JWT_SECRET
  );
  return decodedCookie;
}

async function getLoggedInUser(req, res, next) {
  const cookieToken = req.cookies?.greetings_login_token;
  if (cookieToken) {
    const decodedCookie = await decodeCookie(cookieToken);
    const userId = decodedCookie.userId;
    const user = await mysqlGetUserById(userId);
    if (user) req.user = user;
  }
  next();
}

function logout(req, res, next) {
  res.cookie("greetings_login_token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).redirect("/");
}

async function login(req, res) {
  const { email, password } = req.body;

  if (password === "" || email === "")
    return res.status(401).render("login", { message: "c'mon ye eejit" });

  const user = await mysqlGetUserByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    const userId = user.user_id;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES)),
      httpOnly: true,
    };

    res.cookie("greetings_login_token", token, cookieOptions);

    return res.redirect("/profile");
  }

  res.status(401).render("login", { message: "somethin's wrong there now" });
}

async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  const user = await mysqlGetUserByEmail(email);

  if (user)
    return res.status(401).render("register", {
      name,
      message:
        "oh Jaysus, that email is already in use - would you have another one?",
    });

  if (password !== confirmPassword)
    return res.status(401).render("register", {
      name,
      email,
      message: "ye eejit - those passwords don't match",
    });

  const saltyHash = await bcrypt.hash(password, 10);
  await mysqlAddUser(name, email, saltyHash);
  res.status(201).render("login", { name, email });
}

export { getLoggedInUser, logout, login, register };
