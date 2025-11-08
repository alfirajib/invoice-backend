const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ payments: "auth", message: "working 🚀" });
});

module.exports = router;
