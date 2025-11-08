const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ route: "auth", message: "working 🚀" });
});

module.exports = router;
