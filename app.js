const authRoutes = require("./Controllers/Routes/authRoutes");
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const db = require("./Models/db-postgress");
const { query } = require("./Models/db-postgress"); //
require("dotenv").config();

const app = express();
app.use(
  session({
    store: new pgSession({
      pool: db, // Utilisation de la connexion à la base de données PostgreSQL
      tableName: "sessions",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
