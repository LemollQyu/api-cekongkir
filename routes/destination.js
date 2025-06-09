const express = require("express");
const axios = require("axios");
const router = express.Router();

const BASE_URL = process.env.BASE_PRODUCTION_URL_RAJA_ONGKIR;
const API_KEY = process.env.RAJA_ONGKIR_SHIPPING_COST; // ganti sesuai API Key yang benar

// GET /api/destination/search?search=sinduharjo&limit=5&offset=0
router.get("/search", async (req, res) => {
  const { search, limit = 10, offset = 0 } = req.query;

  if (!search) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/destination/domestic-destination`,
      {
        params: { search, limit, offset },
        headers: {
          key: API_KEY, // <--- Bukan x-api-key
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching destination:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch destination" });
  }
});

module.exports = router;
