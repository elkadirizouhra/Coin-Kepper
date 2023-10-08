const bcrypt = require("bcrypt");
const passport = require("passport");
const { pool } = require("../models/dbConfig");

function getRegister(req, res) {
  res.render("register.ejs");
}



function getLastTransactions(userId) {
  // Récupérer les dernières transactions de la table "depense" pour l'utilisateur connecté
  const depenseQuery = "SELECT description, amount, date FROM depense WHERE user_id = $1 ORDER BY date DESC LIMIT 5";

  // Récupérer les dernières transactions de la table "revenue" pour l'utilisateur connecté
  const revenueQuery = "SELECT description, amount, date FROM revenue WHERE user_id = $1 ORDER BY date DESC LIMIT 5";

  // Exécution des requêtes et combinaison des résultats
  return Promise.all([
    pool.query(depenseQuery, [userId]),
    pool.query(revenueQuery, [userId])
  ])
    .then(results => {
      const depenseTransactions = results[0].rows.map(transaction => ({
        ...transaction,
        type: 'depense'
      }));
      const revenueTransactions = results[1].rows.map(transaction => ({
        ...transaction,
        type: 'revenue'
      }));

      const allTransactions = [...depenseTransactions, ...revenueTransactions];
      allTransactions.sort((a, b) => b.date - a.date);

      return allTransactions;
    });
}

function getDashboard(req, res) {
  const userId = req.user.id; // Assume que l'ID de l'utilisateur est stocké dans req.user.id
  getLastTransactions(userId)
    .then(transactions => {
      // Calculer la somme des revenus
      const totalRevenue = transactions
        .filter(transaction => transaction.type === 'revenue')
        .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

      // Calculer la somme des dépenses
      const totalDepense = transactions
        .filter(transaction => transaction.type === 'depense')
        .reduce((total, transaction) => total + parseFloat(transaction.amount), 0);

      const balance = totalRevenue - totalDepense;

      res.render('dashboard', {
        user: req.user.name,
        transactions: transactions,
        balance: balance.toFixed(2)
      });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des transactions:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des transactions." });
    });
}






function getLogin(req, res) {
  console.log(req.session.flash.error);
  res.render("login.ejs");
}




function logout(req, res) {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.render("index", { message: "You have logged out successfully" });
  });
}

async function postRegister(req, res) {
  let { name, email, password, password2 } = req.body;
  let errors = [];

  console.log({ name, email, password, password2 });

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be at least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (err, results) => {
        if (err) {
          console.log(err);
        }
        console.log(results.rows);

        if (results.rows.length > 0) {
          return res.render("register", {
            message: "Email already registered"
          });
        } else {
          pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, password`,
            [name, email, hashedPassword],
            (err, results) => {
              if (err) {
                throw err;
              }
              console.log(results.rows);
              req.flash("success_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
}

function postLogin(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
}

module.exports = {
  getRegister,
  getLogin,
  getDashboard,
  logout,
  postRegister,
  postLogin
};
