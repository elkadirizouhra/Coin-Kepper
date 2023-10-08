const { pool } = require("../models/dbConfig");
function getrevenue(req, res) {
  const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user.id
  
  pool.query(
    'SELECT description, amount FROM revenue WHERE user_id = $1',
    [userId],
    (error, result) => {
      if (error) {
        console.error('Erreur lors de la récupération des revenus:', error);
        res.status(500).send('Erreur lors de la récupération des revenus.');
      } else {
        const revenues = result.rows;
        res.render('revenue', { revenues, user: req.user.name });
        // Rendre la vue "revenue.ejs" avec les données des recettes
      }
    }
  );
}

function postrevenue(req, res) {
  let { Description, montant, date } = req.body;
  const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user.id
  
  console.log({ Description, montant, date });
  pool.query(
    `INSERT INTO revenue (user_id, description, amount, date) VALUES ($1, $2, $3, $4) RETURNING id, description, amount, date`,
    [userId, Description, montant, date],
    (error, result) => {
      if (error) {
        console.error("Erreur lors de l'insertion de la recette:", error);
        res.status(500).json({ message: "Erreur lors de l'insertion de la recette." });
      } else {
        console.log("rEVENUE insérée avec succès:", result.rows[0]);
        res.status(200).json({ message: "Recette insérée avec succès !" });
      }
    }
  );
}

    async function deleterevenue(req, res) {
      const depenseId = req.params.description;
      try {
        const deleteQueryResult = await pool.query(
          "DELETE FROM revenue WHERE description = $1",
          [depenseId]
        );
    
        res.status(200).json({ message: "revenue supprimée avec succès !" });
      } catch (error) {
        console.error("Erreur lors de la suppression de la revenue:", error);
        res.status(500).json({ message: "Erreur lors de la suppression de la revenue." });
      }
    }
   
    
         
    module.exports = {
    postrevenue,
  getrevenue,
deleterevenue};