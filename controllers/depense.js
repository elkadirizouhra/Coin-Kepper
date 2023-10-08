const { pool } = require("../models/dbConfig");

function getdepense(req, res) {
  const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user.id
  
  pool.query(
    'SELECT description, amount, date, category FROM depense WHERE user_id = $1',
    [userId],
    (error, result) => {
      if (error) {
        console.error('Erreur lors de la récupération des dépenses:', error);
        res.status(500).send('Erreur lors de la récupération des dépenses.');
      } else {
        const Depense = result.rows;
        res.render('depense', { Depense, user: req.user.name });
        // Rendre la vue "depense.ejs" avec les données des dépenses de l'utilisateur connecté
      }
    }
  );
}

function postdepense(req, res) {
  const { Description, montant, date, icon } = req.body;
  const userId = req.user.id; // Supposons que l'ID de l'utilisateur est stocké dans req.user.id

  console.log({ Description, montant, date, userId, icon });

  pool.query(
    `INSERT INTO depense (description, amount, date, user_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING id, description, amount`,
    [Description, montant, date, userId, icon],
    (error, result) => {
      if (error) {
        console.error('Erreur lors de l\'insertion de la dépense:', error);
        res.status(500).json({ message: 'Erreur lors de l\'insertion de la dépense.' });
      } else {
        console.log('Dépense insérée avec succès:', result.rows[0]);
        res.status(200).json({ message: 'Dépense insérée avec succès !' });
      }
    }
  );
}

async function deleteDepense(req, res) {
  const depenseId = req.params.description;
  try {
    const deleteQueryResult = await pool.query(
      "DELETE FROM depense WHERE description = $1",
      [depenseId]
    );

    res.status(200).json({ message: "Dépense supprimée avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la dépense:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de la dépense." });
  }
}

module.exports = {
  postdepense,
  getdepense,
  deleteDepense,
};
