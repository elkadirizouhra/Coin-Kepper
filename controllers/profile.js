const { pool } = require("../models/dbConfig");

function getprofile(req, res) {
  const userId = req.user.id; // Supposons que l'ID de l'utilisateur soit stocké dans req.user.id après l'authentification

  pool.query(
    'SELECT name, email, password FROM users WHERE id = $1',
    [userId],
    (error, result) => {
      if (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).send('Erreur lors de la récupération des données.');
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("Utilisateur introuvable.");
        } else {
          const profile = result.rows[0];
          res.render('profile', { profile, user: req.user.name });
        }
      }
    }
  );
}

module.exports = {
  getprofile
};
