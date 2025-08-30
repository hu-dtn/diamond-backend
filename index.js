import express from "express";
import cors from "cors";
import { PrismaClient } from './generated/prisma/index.js';

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

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

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));