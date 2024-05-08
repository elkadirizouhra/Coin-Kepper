const express = require("express");
const router = express.Router();

const registerController = require("../registerController");
const transactionController = require("../transactions");
router.post("/register", registerController.postRegister);
router.post("/login", registerController.postLogin);
router.post("/depense", transactionController.postdepense);
router.post("/revenue", transactionController.postrevenue);

router.get("/logout", registerController.logout);
router.get("/auth", registerController.getAuth);
router.get("/dashboard", transactionController.getDashboardData);
router.get("/revenue", transactionController.getRevenue);
router.get("/depense", transactionController.getDepence);
// router.get("/dashboard/lastTransactions",transactionController.getLastTransactions);

module.exports = router;
