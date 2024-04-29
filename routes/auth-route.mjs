import express from "express";
import { login, register, logout } from "../controllers/auth-controller.mjs";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", logout);

export default router;
