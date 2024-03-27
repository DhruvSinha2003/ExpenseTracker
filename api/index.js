const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/transaction.js");
const { default: mongoose } = require("mongoose");
const shortid = require("shortid");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ body: "test ok" });
});

app.post("/api/transaction", async (req, res) => {
  try {
    const { name, description, datetime, price } = req.body;
    const id = shortid.generate().slice(-6);
    const transaction = await Transaction.create({ id, name, description, datetime, price });
    res.json(transaction);
    console.log("Transaction created:", transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

app.get("/api/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ id: req.params.id });
    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

app.put("/api/transaction/:id", async (req, res) => {
  try {
    const { name, description, datetime, price } = req.body;
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { id: req.params.id },
      { name, description, datetime, price },
      { new: true }
    );
    res.json(updatedTransaction);
    console.log("Transaction updated:", updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

app.delete("/api/transaction/:id", async (req, res) => {
    try {
      const deletedTransaction = await Transaction.findOneAndDelete({ id: req.params.id });
      if (!deletedTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      console.log("Transaction deleted:", deletedTransaction);
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

const port = 4040;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});