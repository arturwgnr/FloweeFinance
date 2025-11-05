import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

//Routes
//GET
app.get("/", (req, res) => {
  res.send("🔮 I have all that I need in order to succeed!");
});

//Transactions
app.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await prisma.transaction.findMany({
      where: { userId: Number(userId) },
    });

    if (transactions.length === 0) {
      res
        .status(400)
        .json({ message: `No transactions for user [${userId}] available.` });
    }

    res.status(200).json({ transactions: transactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//POST
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already registered!" });
    }

    const newUser = await prisma.user.create({
      data: { name, email, password: hashPassword },
    });

    res.status(201).json({ message: "User create successfully!", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User not registered!" });
    }

    const matchingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!matchingPassword) {
      return res.status(401).json({ message: "Passwords must match!" });
    }

    res.status(200).json({ message: "Login Successfull!", existingUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Transactions
app.post("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, category, type, amount } = req.body;

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        category,
        type,
        amount: parseFloat(amount),
        userId: Number(userId),
      },
    });

    res.status(201).json({ message: "Transaction added", newTransaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Put
app.put("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.transaction.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res
      .status(200)
      .json({ message: "Transaction updated successfully", updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete
app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.transaction.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Deleted Successfully", deleted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/transactions/user/:userId", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAll = await prisma.transaction.deleteMany({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "All transactions deleted!", deleteAll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Server
app.listen(5000, () => {
  console.log("Selvagem! Server is running on: http://localhost:5000");
});
