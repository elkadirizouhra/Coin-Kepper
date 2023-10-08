function getComptes(req, res) {
  res.render("Compte", { user: req.user.name });
  }
  function getdepense(req, res) {
    res.render("depense", { user: req.user.name });
    }
    function getrevenue(req, res) {
      res.render("revenue", { user: req.user.name });
      }
 
  module.exports = {

    getComptes,
    getdepense,
    getrevenue
  };
  