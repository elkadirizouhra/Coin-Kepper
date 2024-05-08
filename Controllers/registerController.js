const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../Models/db-postgress");

async function postRegister(req, res) {
  const { name, email, password } = req.body;
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (existingUser.rows.length > 0) {
    req.session.errorMessage = "Email already registered";
    return res.redirect("/auth"); // Retourner ici pour éviter d'envoyer une autre réponse
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insérer le nouvel utilisateur dans la base de données
  try {
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    req.session.successMessage = "User registered successfully";
    return res.redirect("/auth"); // Retourner ici pour éviter d'envoyer une autre réponse
  } catch (error) {
    req.session.errorMessage = "Error registering user";
    return res.redirect("/auth"); // Retourner ici pour éviter d'envoyer une autre réponse
  }
}

async function postLogin(req, res) {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe dans la base de données
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (user.rows.length === 0) {
    req.session.errorMessage = "Incorrect email or password";
    return res.redirect("/auth");
  }

  // Vérifier si le mot de passe est correct
  const hashedPassword = user.rows[0].password;
  const passwordMatch = await bcrypt.compare(password, hashedPassword);
  if (!passwordMatch) {
    req.session.errorMessage = "Incorrect email or password";
    return res.redirect("/auth");
  }

  // Si l'authentification réussit, rediriger vers le tableau de bord
  req.session.userId = user.rows[0].id; // Stocker l'ID de l'utilisateur dans la session
  req.session.successMessage = "Login successful";
  res.redirect("/dashboard");
}

function getDashboard(req, res) {
  const errorMessage = req.session.errorMessage;
  const successMessage = req.session.successMessage;

  // Effacer les messages de la session après les avoir récupérés
  req.session.errorMessage = undefined;
  req.session.successMessage = undefined;
  res.render("dashboard", { errorMessage, successMessage });
}

function getAuth(req, res) {
  const errorMessage = req.session.errorMessage;
  const successMessage = req.session.successMessage;

  // Effacer les messages de la session après les avoir récupérés
  req.session.errorMessage = undefined;
  req.session.successMessage = undefined;

  res.render("auth", { errorMessage, successMessage });
}

function logout(req, res) {
  res.render("index");
}
module.exports = {
  getAuth,
  getDashboard,
  postRegister,
  postLogin,
  logout,
};
