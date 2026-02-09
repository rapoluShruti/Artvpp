require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

/* -------------------- CORS CONFIG -------------------- */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://artvpp-pearl.vercel.app"
    ],
    credentials: true
  })
);

/* -------------------- MIDDLEWARE -------------------- */

app.use(express.json());

/* -------------------- ROUTES -------------------- */

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const artistRoutes = require("./routes/artistRoutes");
const artistProfileRoutes = require("./routes/artistProfileRoutes");
const artistProductRoutes = require("./routes/artistProductRoutes");
const merchandiseRoutes = require("./routes/merchandiseRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cartRoutes = require("./routes/cartRoutes");
const customerRoutes = require("./routes/customerRoutes");
const creativeServicesRoutes = require("./routes/creativeServicesRoutes");
const digitalRoutes = require("./routes/digitalRoutes");

/* -------------------- USE ROUTES -------------------- */

app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/artist-profile", artistProfileRoutes);
app.use("/api/artist-products", artistProductRoutes);
app.use("/api/merchandise", merchandiseRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/creative-services", creativeServicesRoutes);
app.use("/api/digital", digitalRoutes);

/* -------------------- TEST ROUTE -------------------- */

app.get("/", (req, res) => {
  res.json({
    message: "ArtVPP Backend Running",
    port: process.env.PORT
  });
});

/* -------------------- START SERVER -------------------- */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("\n✓ Server running on port", PORT);
});

module.exports = app;
