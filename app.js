import "dotenv/config";
import mysql8 from "mysql8";
import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import pagesRouter from "./routes/pages.js";
import authRouter from "./routes/auth.js";

const db = mysql8.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((error) => {
  if (error) console.error(error);
  else console.log(`Connected to database:\t${process.env.DB_NAME}`);
});

const app = express();

app.set("view engine", "hbs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", pagesRouter);
app.use("/auth", authRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port:\t${process.env.SERVER_PORT}`);
});
