const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const Transaction = require('./models/transaction.js');
const { default: mongoose } = require('mongoose');


app.get('/api/test', (req, res) => {
    res.json({ body: 'test ok' });
});

app.post('/api/transaction', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const { name, description, datetime, price } = req.body;
        const transaction = await Transaction.create({ name, description, datetime, price });
        res.json(transaction);
        console.log("Transaction created:", transaction);
    } catch (error) {
        console.error("Error creating transaction:", error);
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

app.get('/api/transactions',async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find({});
    res.json(transactions)
});

const port = 4040;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
