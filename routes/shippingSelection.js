const express = require("express");
const router = express.Router();

router.post("/select", (req, res) => {
  const { courier_code, service } = req.body;

  if (!courier_code || !service) {
    return res.status(400).json({
      error: "courier_code and service are required",
    });
  }

  if (!lastCalculatedShipping.length) {
    return res.status(500).json({
      error: "No calculated shipping data available. Please calculate first.",
    });
  }

  const selected = lastCalculatedShipping.find(
    (item) =>
      item.code.toLowerCase() === courier_code.toLowerCase() &&
      item.service.toUpperCase() === service.toUpperCase()
  );

  if (!selected) {
    return res.status(404).json({ error: "Courier service not found" });
  }

  res.json({ selected });
});

module.exports = router;
