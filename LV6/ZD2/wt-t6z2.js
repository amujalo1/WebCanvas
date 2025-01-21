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
    const { username, password } = req.body;
    const hashedPassword = hashPassword(password);
    const users = await loadUsers();

    const user = users.find(u => u.username === username && u.password === hashedPassword);

    const timestamp = new Date().toISOString();
    let response = '';

    if (user) {
        // Prijava uspješna
        response = `
        <response>
            <success>true</success>
            <timestamp>${timestamp}</timestamp>
            <user>
                <username>${user.username}</username>
                <name>${user.name}</name>
                <surname>${user.surname}</surname>
                <role>${user.role}</role>
            </user>
        </response>
        `;
    } else {
        // Prijava nije uspješna
        response = `
        <response>
            <success>false</success>
            <timestamp>${timestamp}</timestamp>
            <user>
                <username>${username}</username>
            </user>
        </response>
        `;
    }

    res.set('Content-Type', 'application/xml');
    res.send(response);
});

// Pokretanje servera
app.listen(8080, () => {
    console.log('Server pokrenut na http://localhost:8080');
});
