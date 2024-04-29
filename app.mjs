import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth-route.mjs";
import pagesRouter from "./routes/pages-route.mjs";

const app = express();

app.set("view engine", "hbs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use("/", pagesRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("oh Jaysus, something went wrong!");
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port ${process.env.SERVER_PORT}`);
  console.log(`http://127.0.0.1:${process.env.SERVER_PORT}`);
});
