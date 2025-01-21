const http = require('http');
const fs = require('fs');

const PORT = 8080;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('imenik.txt', 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Greška pri čitanju datoteke.' }));
                return;
            }

            // Obrada CSV podataka u JSON format
            const rows = data.split('\n').filter(row => row.trim() !== '');
            const jsonResult = rows.map(row => {
                const [ime, prezime, adresa, broj_telefona] = row.split(',');
                return {
                    ime: ime.trim(),
                    prezime: prezime.trim(),
                    adresa: adresa.trim(),
                    broj_telefona: broj_telefona.trim(),
                };
            });

            // Slanje JSON odgovora
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(jsonResult, null, 2));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Stranica nije pronađena.' }));
    }
});

// Pokretanje servera
server.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
