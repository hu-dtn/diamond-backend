const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma/index.js");

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();

// Configure CORS to only allow specific origins
app.use(
  cors({
    origin: ["http://localhost:3000", "https://dtn-site.vercel.app"],
  })
);

// Use Express's built-in JSON middleware to parse incoming requests
app.use(express.json());

// A simple welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Diamonds API!");
});

// Main /diamonds endpoint with all filters and sorting
app.get("/diamonds", async (req, res) => {
  try {
    const {
      shape,
      caratMin,
      caratMax,
      color,
      clarity,
      cut,
      priceMin,
      priceMax,
      lab,
      availability,
      sortBy,
      order,
    } = req.query;

    const filters = {};

    if (shape) filters.shape = { equals: shape };
    if (color) filters.color = { equals: color };
    if (clarity) filters.clarity = { equals: clarity };
    if (cut) filters.cut = { equals: cut };
    if (lab) filters.lab = { equals: lab };
    if (availability) filters.availability = { equals: availability };

    if (caratMin || caratMax) {
      filters.carat = {};
      if (caratMin) filters.carat.gte = parseFloat(caratMin);
      if (caratMax) filters.carat.lte = parseFloat(caratMax);
    }

    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.gte = parseFloat(priceMin);
      if (priceMax) filters.price.lte = parseFloat(priceMax);
    }

    const diamonds = await prisma.diamond.findMany({
      where: filters,
      orderBy: sortBy
        ? { [sortBy]: order === "desc" ? "desc" : "asc" }
        : { carat: "asc" },
    });

    res.json(diamonds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch diamonds" });
  }
});

// get one diamond by stockId
app.get("/diamonds/:stockId", async (req, res) => {
  try {
    const diamond = await prisma.diamond.findUnique({
      where: { stockId: req.params.stockId },
    });
    if (diamond) {
      res.json(diamond);
    } else {
      res.status(404).json({ error: "Diamond not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
  }
});

// add diamond
app.post("/diamonds", async (req, res) => {
  try {
    const diamond = await prisma.diamond.create({ data: req.body });
    res.json(diamond);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add diamond" });
  }
});

// friendly base route
app.get("/", (req, res) => {
  res.send("✅ DTN API is running. Try /health and /diamonds");
});

// lightweight health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "production",
    version: process.env.npm_package_version || "0.0.0",
  });
});

// optional: DB health (proves Prisma ↔ Supabase)
app.get("/health/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
