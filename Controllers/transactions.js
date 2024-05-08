const pool = require("../Models/db-postgress");

///functions utils
const formatDate = (date) => {
  const formattedDate = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return formattedDate.toLocaleDateString("fr-FR", options);
};



//////depenses///////////
async function postdepense(req, res) {
  const { Description, montant, date, category } = req.body;

  if (!req.session.userId) {
    return res.redirect("/auth");
  }

  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `INSERT INTO depenses (user_id, description, amount, date,category) VALUES ($1, $2, $3, $4,
        $5) RETURNING id, description, amount`,
      [userId, Description, montant, date, category]
    );
    req.session.successMessage = "Dépense insérée avec succès";
    return res.redirect("/depense");
  } catch (error) {
    req.session.errorMessage = "Erreur lors de l'insertion de la dépense:";
    return res.redirect("/depense");
  }
}
async function getDepence(req, res) {
  const errorMessage = req.session.errorMessage || ""; // Définir un message d'erreur par défaut si non défini
  const successMessage = req.session.successMessage || "";

  // Effacer les messages de la session après les avoir récupérés
  req.session.errorMessage = undefined;
  req.session.successMessage = undefined;

  if (!req.session.userId) {
    return res.redirect("/auth");
  }

  const userId = req.session.userId; // L'utilisateur connecté

  try {
    const result = await pool.query(
      "SELECT description, amount, date, category FROM depenses WHERE user_id = $1",
      [userId]
    );
    const Depense = result.rows.map((depense) => ({
      ...depense,
      date: formatDate(depense.date),
    }));
    res.render("depenses", { Depense }); //
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.redirect("/depense");
  }
}

/////////////Revenue

async function postrevenue(req, res) {
  const { Description, montant, date, category } = req.body;

  if (!req.session.userId) {
    return res.redirect("/auth");
  }

  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `INSERT INTO revenues (user_id, description, amount, date,category) VALUES ($1, $2, $3, $4,
        $5) RETURNING id, description, amount`,
      [userId, Description, montant, date, category]
    );
    req.session.successMessage = "revenue insérée avec succès";
    return res.redirect("/revenue");
  } catch (error) {
    req.session.errorMessage = "Erreur lors de l'insertion de la dépense:";
    return res.redirect("/revenue");
  }
}
async function getRevenue(req, res) {
  const errorMessage = req.session.errorMessage || ""; // Définir un message d'erreur par défaut si non défini
  const successMessage = req.session.successMessage || "";

  // Effacer les messages de la session après les avoir récupérés
  req.session.errorMessage = undefined;
  req.session.successMessage = undefined;

  if (!req.session.userId) {
    return res.redirect("/auth");
  }

  const userId = req.session.userId; // L'utilisateur connecté

  try {
    const result = await pool.query(
      "SELECT description, amount, date, category FROM revenues WHERE user_id = $1",
      [userId]
    );
    const Revenue = result.rows.map((revenue) => ({
      ...revenue,
      date: formatDate(revenue.date),
    }));
    res.render("revenue", { Revenue }); //
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.redirect("/revenue");
  }
}

function getLastTransactions(userId) {
  // Récupérer les dernières transactions de la table "depense" pour l'utilisateur connecté
  const depenseQuery =
    "SELECT description, amount, date,category FROM depenses WHERE user_id = $1 ORDER BY date DESC LIMIT 5";

  // Récupérer les dernières transactions de la table "revenue" pour l'utilisateur connecté
  const revenueQuery =
    "SELECT description, amount, date,category FROM revenues WHERE user_id = $1 ORDER BY date DESC LIMIT 5";

  // Exécution des requêtes et combinaison des résultats
  return Promise.all([
    pool.query(depenseQuery, [userId]),
    pool.query(revenueQuery, [userId]),
  ]).then((results) => {
    const depenseTransactions = results[0].rows.map((transaction) => ({
      ...transaction,
      type: "depense",
      date: formatDate(transaction.date),
    }));

    const revenueTransactions = results[1].rows.map((transaction) => ({
      ...transaction,
      type: "revenue",
      date: formatDate(transaction.date), // Formatage de la date
    }));

    const allTransactions = [...depenseTransactions, ...revenueTransactions];
    allTransactions.sort((a, b) => b.date - a.date);

    return allTransactions;
  });
}
async function getDashboardData(req, res) {
  const userId = req.session.userId; // L'utilisateur connecté

  try {
    // Récupérer les dépenses de l'utilisateur
    const expensesResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total_expenses FROM depenses WHERE user_id = $1",
      [userId]
    );

    // Récupérer les revenus de l'utilisateur
    const revenueResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) AS total_revenues FROM revenues WHERE user_id = $1",
      [userId]
    );

    // Calculer la somme des dépenses
    const totalExpenses = expensesResult.rows[0].total_expenses || 0;

    // Calculer la somme des revenus
    const totalRevenue = revenueResult.rows[0].total_revenues || 0;

    // Calculer le solde actuel
    const currentBalance = totalRevenue - totalExpenses;

    // Récupérer les 10 dernières transactions de dépenses et de revenus

    const lastTransactions = await getLastTransactions(userId);

    res.render("dashboard", {
      totalExpenses,
      totalRevenue,
      currentBalance,
      lastTransactions,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.redirect("/dashboard");
  }
}

module.exports = {
  getRevenue,
  getDepence,
  postdepense,
  postrevenue,
  getDashboardData,

  // getLastTransactions
};
