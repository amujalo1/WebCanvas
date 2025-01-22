const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// READ
app.get('/imenik', (req, res) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    result
        .then(data => res.json({ data }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(process.env.PORT, () => {
    console.log('Aplikacija radi na portu ' + process.env.PORT);
});
