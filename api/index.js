const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const Transaction = require('./models/Transaction,js');
const { default: mongoose } = require('mongoose');


app.get('/api/test', (req, res) => {
    res.json({ body: 'test ok' });
});

app.post('/api/transaction',(req, res) => {
    const {name,description,datetime} = req.body
    mongoose.connect
    res.json(req.body)
})

const port = 4040;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
