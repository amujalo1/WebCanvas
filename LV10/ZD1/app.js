const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./baza.js');
const Imenik = require('./imenik.js')(sequelize); // Model iz imenik.js
const app = express();

app.use(bodyParser.json()); // Middleware za parsiranje JSON-a

// Sinhronizacija modela s bazom
Imenik.sync()
    .then(() => console.log('Tabela "Imenik" je uspješno kreirana!'))
    .catch((err) => console.error('Greška pri kreiranju tabele:', err));

// 1. Dodavanje novog zapisa
app.post('/insert', async (req, res) => {
    const { ime, prezime, adresa, brojTelefona } = req.body;

    try {
        const noviUnos = await Imenik.create({
            ime,
            prezime,
            adresa,
            brojTelefona,
            datumDodavanja: new Date(),
        });
        res.status(201).json({ message: 'Unos je uspješno kreiran!', data: noviUnos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. Dohvaćanje svih zapisa
app.get('/imenik', async (req, res) => {
    try {
        const sviZapisi = await Imenik.findAll();
        res.status(200).json(sviZapisi);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Dohvaćanje zapisa po ID-u
app.get('/imenik/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const zapis = await Imenik.findByPk(id);
        if (!zapis) {
            return res.status(404).json({ message: 'Zapis nije pronađen.' });
        }
        res.status(200).json(zapis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Ažuriranje zapisa
app.put('/imenik/:id', async (req, res) => {
    const { id } = req.params;
    const { ime, prezime, adresa, brojTelefona } = req.body;

    try {
        const zapis = await Imenik.findByPk(id);
        if (!zapis) {
            return res.status(404).json({ message: 'Zapis nije pronađen.' });
        }
        await zapis.update({ ime, prezime, adresa, brojTelefona });
        res.status(200).json({ message: 'Zapis je uspješno ažuriran!', data: zapis });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 5. Brisanje zapisa
app.delete('/imenik/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const zapis = await Imenik.findByPk(id);
        if (!zapis) {
            return res.status(404).json({ message: 'Zapis nije pronađen.' });
        }
        await zapis.destroy();
        res.status(200).json({ message: 'Zapis je uspješno obrisan!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pokretanje servera
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
});
