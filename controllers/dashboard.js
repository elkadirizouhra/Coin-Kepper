const pool = require('../models/dbConfig');

function getLastTransactions(req, res) {
  // Récupérer les dernières transactions de la table "depense"
  const depenseQuery = "SELECT description, amount, date FROM depense ORDER BY date DESC LIMIT 5";

  // Récupérer les dernières transactions de la table "revenue"
  const revenueQuery = "SELECT description, amount, date FROM revenue ORDER BY date DESC LIMIT 5";

  // Exécution des requêtes et combinaison des résultats
  Promise.all([
    pool.query(depenseQuery),
    pool.query(revenueQuery)
  ])
    .then(results => {
      const depenseTransactions = results[0].rows;
      const revenueTransactions = results[1].rows;

      const allTransactions = [...depenseTransactions, ...revenueTransactions];
      allTransactions.sort((a, b) => b.date - a.date);

      // Passez le tableau "allTransactions" à votre vue pour l'affichage
      res.render('dashboard', { transactions: allTransactions });
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des transactions:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des transactions." });
    });
}

module.exports = {
  getLastTransactions
};
