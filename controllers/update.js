const { pool } = require("../models/dbConfig");
function getupdate(req, res) {
    res.render("updatedepense", { user: req.user.name });
    }
    function postupdatedepense(req, res) {
      let { ID, Description, montant, date } = req.body;
    
      // Vérifier si l'entrée avec l'ID spécifié existe
      pool.query(
        "SELECT id FROM depense WHERE id = $1",
        [ID],
        (error, result) => {
          if (error) {
            console.error("Erreur lors de la vérification de l'ID:", error);
            res.status(500).json({ message: "Erreur lors de la vérification de l'ID." });
          } else {
            if (result.rows.length === 0) {
              res.status(404).json({ message: "Aucune entrée avec cet ID n'a été trouvée." });
            } else {
              // L'entrée avec l'ID spécifié existe, exécuter la mise à jour
              pool.query(
                `UPDATE depense SET description = $1, amount = $2, date = $3 WHERE id = $4`,
                [Description, montant, date, ID],
                (updateError, updateResult) => {
                  if (updateError) {
                    console.error("Erreur lors de la modification:", updateError);
                    res.status(500).json({ message: "Erreur lors de la modification de la dépense." });
                  } else {
                    console.log("Dépense modifiée avec succès:", updateResult.rows[0]);
                    res.status(200).json({ message: "Dépense modifiée avec succès !" });
                  }
                }
              );
            }
          }
        }
      );
    }
    
      module.exports = {
        getupdate,
        postupdatedepense
      };
      