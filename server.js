const express = require("express");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");
const flash = require("express-flash");
const { pool } = require("./models/dbConfig");
const initializePassport = require("./passportConfig");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new pgSession({
      conString: 'postgres://postgres:zahira 18@localhost:5432/users',
      tableName: 'sessions'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
const userController = require("./controllers/userController");
const Comptes = require("./controllers/Comptes");
const statistique = require("./controllers/statistique");
const depense = require("./controllers/depense");
const revenue = require("./controllers/revenue");
const update= require("./controllers/update");
const profile= require("./controllers/profile");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/users/register", userController.getRegister);

app.get("/users/login", userController.getLogin);

app.get("/users/dashboard", userController.getDashboard);

app.get("/users/logout", userController.logout);

app.post("/users/register", userController.postRegister);

app.post("/users/login", userController.postLogin);
app.get("/users/Compte", Comptes.getComptes);

app.get("/users/depense", depense.getdepense);

app.post("/users/depense", depense.postdepense);
app.get("/users/revenue",revenue.getrevenue);
app.post("/users/revenue",revenue.postrevenue);
app.get("/users/statistique",statistique.getstatistique);
app.get("/users/depense/delete/:description", depense.deleteDepense);
app.get("/users/revenue/delete/:description", revenue.deleterevenue);
app.get("/users/depense/update", update.getupdate);
app.post("/users/updatedepense", update.postupdatedepense);
app.get("/users/profile", profile.getprofile);




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
