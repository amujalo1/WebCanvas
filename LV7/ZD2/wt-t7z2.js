const express = require('express')
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;
const filePath = path.join(__dirname, 'zadaci.csv');
const formPath = path.join(__dirname, 'forma.html');

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(formPath);
});

app.get('/zadaci', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) =>{
        if (err) {
            return res.status(500).json({ status: "Greška pri čitanju datoteke!" });
        }
        const tasks = data.split('\n').filter(line => line.trim() !== '').map(line => {
            const [id, naziv, opis] = line.split(',');
            return { id: id.trim(), naziv: naziv.trim(), opis: opis.trim() };
        });

        res.json(tasks);
    })
});

app.post('/zadatak', (req, res) => {
    const { id, naziv, opis } = req.body;
    if (!id || !naziv || !opis) {
        return res.status(400).json({ status: "Sva polja su obavezna!" });
    }
    fs.readFile(filePath,  'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ status: "Greška pri čitanju datoteke!" });
        }
        const lines = data.split('\n');
        const exists = lines.some(line => line.split(',')[0].trim() === id);
        if (exists) {
            return res.status(400).json({ status: "Id već postoji!" });
        }
        const newTask = `\n${id},${naziv},${opis}`;
        fs.appendFile(filePath, newTask, err => {
            if (err) {
                return res.status(500).json({ status: "Greška pri upisivanju zadatka!" });
            }

            res.json({ status: "Zadatak je uspješno dodan!" });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});
