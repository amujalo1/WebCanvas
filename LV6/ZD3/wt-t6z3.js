const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Funkcija za hashiranje password-a
function hashPassword(password) {
    return password.split('').map(char => String.fromCharCode((char.charCodeAt(0) % 16) + 55)).join('');
}

// Učitavanje korisnika iz CSV datoteke
function loadUsers() {
    return new Promise((resolve, reject) => {
        const users = [];
        fs.createReadStream('users.csv')
            .pipe(csv())
            .on('data', (data) => users.push(data))
            .on('end', () => resolve(users))
            .on('error', (err) => reject(err));
    });
}

// Ruta za obradu prijave
app.post('/login', async (req, res) => {
    const { username, password, val1, val2 } = req.body;
    const hashedPassword = hashPassword(password);
    const users = await loadUsers();

    const user = users.find(u => u.username === username && u.password === hashedPassword);

    const timestamp = new Date().toISOString();

    if (user) {
        // Prijava uspješna
        if (val1 || val2) {
            // Obrada dodatnih parametara
            const response = {};
            if (val1 === 'name') response.name = user.name;
            if (val2 === 'surname') response.surname = user.surname;

            return res.json(response);
        } else {
            // Standardni JSON odgovor
            const response = {
                success: true,
                timestamp: timestamp,
                user: {
                    username: user.username,
                    name: user.name,
                    surname: user.surname,
                    role: user.role
                }
            };

            res.set('Content-Type', 'application/json');
            return res.json(response);
        }
    } else {
        // Prijava nije uspješna
        const response = {
            success: false,
            timestamp: timestamp,
            user: {
                username: username
            }
        };

        res.set('Content-Type', 'application/json');
        return res.json(response);
    }
});

// Pokretanje servera
app.listen(8080, () => {
    console.log('Server pokrenut na http://localhost:8080');
});
