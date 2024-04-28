import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import pagesRouter from "./routes/pages.mjs";
import authRouter from "./routes/auth.mjs";

const app = express();

app.set("view engine", "hbs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/", pagesRouter);
app.use("/auth", authRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port:\t${process.env.SERVER_PORT}`);
  console.log(`http://localhost:${process.env.SERVER_PORT}`);
});
