const express = require("express");
const axios = require("axios");
const router = express.Router();
const qs = require("qs");

const BASE_URL = process.env.BASE_PRODUCTION_URL_RAJA_ONGKIR.replace(/\/$/, "");
const API_KEY = process.env.RAJA_ONGKIR_SHIPPING_COST;
let lastCalculatedShipping = []; // simpan hasil terakhir

// POST cek jasa kirim
router.post("/calculate", async (req, res) => {
  const { origin, destination, weight, courier, price = "lowest" } = req.body;

  if (!origin || !destination || !weight || !courier) {
    return res.status(400).json({
      error: "origin, destination, weight, and courier wajib diisi",
    });
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/calculate/domestic-cost`,
      qs.stringify({ origin, destination, weight, courier, price }),
      {
        headers: {
          key: API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    lastCalculatedShipping = response.data?.data || [];

    res.json({ data: lastCalculatedShipping });
  } catch (error) {
    console.error(
      "Error kalkulasi jasa kirim:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Gagal kalkulasi jasa kirim" });
  }
});

// data jasa kirim

router.get("/last", (req, res) => {
  if (!lastCalculatedShipping || lastCalculatedShipping.length === 0) {
    return res.status(404).json({ message: "Tidak ada data dari jasa kirim" });
  }

  res.json({ data: lastCalculatedShipping });
});

// pilih jasa kirimnya
router.post("/select", (req, res) => {
  const { courier_code, service } = req.body;

  if (!courier_code || !service) {
    return res
      .status(400)
      .json({ error: "courier_code and service Wajib diisi" });
  }

  if (!lastCalculatedShipping || lastCalculatedShipping.length === 0) {
    return res
      .status(404)
      .json({ error: "Kalkulasi pengiriman tidak ditemukan" });
  }

  const selected = lastCalculatedShipping.find(
    (item) =>
      item.code.toLowerCase() === courier_code.toLowerCase() &&
      item.service.toUpperCase() === service.toUpperCase()
  );

  if (!selected) {
    return res.status(404).json({
      error: "Courier and service tidak ditemukan di data jasa kirim",
    });
  }

  res.json({ selected });
});

module.exports = router;
