import "dotenv/config";
import mysql8 from "mysql8";
import express from "express";
import handlebars from "hbs";
import path from "path";
import serveFavicon from "serve-favicon";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import pagesRouter from "./routes/pages.mjs";
import authRouter from "./routes/auth.mjs";

// create a database connection using .env file info
const db = mysql8.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// connect to the databsae
db.connect((error) => {
  if (error) console.error(error);
  else console.log(`Connected to database:\t${process.env.DB_NAME}`);
});

// create an express app
const app = express();

// use handlebars for templating
app.set("view engine", "hbs");

// create a handlebars helper to display a number in a currency format
// e.g. 1.5 -> 1.50; 10 -> 10.00
handlebars.registerHelper("toCurrency", function (number) {
  return number.toFixed(2);
});

// serve the favicon
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(serveFavicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));

// tell express what we will be using
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// add some Routers to express
app.use("/", pagesRouter);
app.use("/auth", authRouter);

// start the server listening on the port defined in .env
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server started on port:\t${process.env.SERVER_PORT}`);
});
