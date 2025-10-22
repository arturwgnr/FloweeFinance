import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";
import { authenticate } from "./middleware/authenticate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

console.log("JWT SECRET:", process.env.JWT_SECRET);

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

//GET
app.get("/", (req, res) => {
  res.send("💸 I have everything that I need in order to succeed!");
});

app.get("/protected", authenticate, async (req, res) => {
  try {
    res.json({ message: `Access granted to user ${req.user.email}` });
  } catch (error) {
    res.status(401).json({ message: "⛔ Access denied", error: error });
    console.log(error);
  }
});

app.get("/profiles", async (req, res) => {
  try {
    const profiles = await prisma.user.findMany();

    res.status(200).json({ profiles: profiles });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//POST
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(500).json({ message: "Invalid username" });
    }

    const newProfile = await prisma.user.create({
      data: { username, email, password: hashPassword },
    });

    res.status(201).json({ message: "User created successfully", newProfile });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(500).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = await jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...safeUser } = existingUser;

    res
      .status(200)
      .json({ message: "Login successfull", user: safeUser, token: token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//-- TRANSACTIONS --
//GET
app.get("/transactions", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const transaction = await prisma.transaction.findMany({
      where: { userId },
    });

    if (transaction.length === 0) {
      res.status(401).json({ message: "💸 No transactions yet..." });
    }
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

//POST
app.post("/transactions", authenticate, async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    console.log("USER AUTH:", req.user);
    const { title, amount, type, category } = req.body;

    const userId = req.user.id;

    const transaction = await prisma.transaction.create({
      data: {
        title,
        amount: parseFloat(amount),
        type,
        category,
        userId,
      },
    });

    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

//PUT
app.put("/transactions/:id", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);
    const { title, amount, type, category } = req.body;

    //check
    const existing = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existing || existing.userId !== userId) {
      return res
        .status(403)
        .json({ message: "⛔ Not authorized to edit this transaction" });
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: { title, amount, type, category },
    });

    res.status(200).json({ message: "✅ Transaction updated", updated });
  } catch (error) {
    res.status(401).json({ error: error });
  }
});

//DELETE
app.delete("/transactions/:id", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    const existing = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!existing || existing.userId !== userId) {
      return res
        .status(403)
        .json({ message: "⛔ Not authorized or transaction not found" });
    }

    const updated = await prisma.transaction.delete({
      where: { id: transactionId },
    });

    res.status(200).json({ message: "✅ Transaction deleted", updated });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

//server
app.listen(3000, () => {
  console.log("🔥 Selvagem! Server is on: http://localhost:3000");
});

//I have everything that I need in order to succeed!
