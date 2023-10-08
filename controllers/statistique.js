const { pool } = require("../models/dbConfig");

function getstatistique(req, res) {
  pool.query(
    "SELECT SUM(amount) AS totalRevenue FROM revenue",
    (error, result) => {
      if (error) {
        console.error("Erreur lors de la récupération des revenus:", error);
        res.status(500).send("Erreur lors de la récupération des revenus.");
      } else {
        const totalRevenue = result.rows[0].totalrevenue;

        pool.query(
          "SELECT description, amount, category FROM depense",
          (error, result) => {
            if (error) {
              console.error("Erreur lors de la récupération des dépenses:", error);
              res.status(500).send("Erreur lors de la récupération des dépenses.");
            } else {
              const depenses = result.rows;

              const categories = {};
              for (let i = 0; i < depenses.length; i++) {
                const category = depenses[i].category;
                if (!categories[category]) {
                  categories[category] = 0;
                }
                categories[category] += (depenses[i].amount * 100) / totalRevenue;
              }

              // Calculate the total percentage
              const totalPercentage = Object.values(categories).reduce((sum, percentage) => sum + percentage, 0);

              const categoryNames = Object.keys(categories);
              const percentages = Object.values(categories);

              res.render("Statistique", {
                user: req.user.name,
                depenses: depenses,
                totalRevenue: totalRevenue,
                categories: categoryNames,
                percentages: percentages,
                totalPercentage: totalPercentage, // Include the totalPercentage here
              });
            }
          }
        );
      }
    }
  );
}

module.exports = {
  getstatistique,
};
