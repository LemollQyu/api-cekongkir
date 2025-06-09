require("dotenv").config();
const express = require("express");
const destinationRoutes = require("./routes/destination");
const shippingRoute = require("./routes/shipping");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware agar bisa baca req.body dari JSON dan x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.use("/api/shipping", shippingRoute);
app.use("/api/destination", destinationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
