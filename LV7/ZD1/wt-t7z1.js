const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/unos', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'forma.html'));
});

app.post('/', function (req, res) {
    let tijelo = req.body;
    let novaLinija = tijelo['ime'] + "," + tijelo['prezime'] +
        "," + tijelo['adresa'] + "," + tijelo['broj_telefona'];

    fs.appendFile('imenik.txt', novaLinija + "\r\n", function (err) {
        if (err)  {
            res.status(500).send('Došlo je do greške pri dodavanju podataka.');
            return;
        }

        fs.readFile('imenik.txt', 'utf8', function (err, data) {
            if (err) {
                res.status(500).send('Došlo je do greške pri čitanju podataka.');
                return;
            }

            let zapisi = data.trim().split("\r\n").map(red => red.split(","));
            let tabela = `
                <table border="1">
                    <tr><th>Ime</th><th>Prezime</th><th>Adresa</th><th>Broj telefona</th></tr>
                    ${zapisi.map(z => `<tr><td>${z[0]}</td><td>${z[1]}</td><td>${z[2]}</td><td>${z[3]}</td></tr>`).join('')}
                </table>
            `;

            res.send(`
                <html>
                    <body>
                        <h2>Podaci su uspješno dodani!</h2>
                        ${tabela}
                    </body>
                </html>
            `);
        });
    });
});

// Pokretanje servera
app.listen(8085, () => {
    console.log('Server pokrenut na http://localhost:8085');
});
