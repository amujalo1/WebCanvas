const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(
    session({
        secret: 'neka tajna sifra',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/pogodiBroj.html");
});

app.post('/', function (req, res) {
    let broj, broj_pokusaja, poruka = "";
    if (req.session.broj != null) {
        broj = req.session.broj;
        broj_pokusaja = req.session.broj_pokusaja;
    } else {
        broj = Math.floor((Math.random() * 100) + 1);
        broj_pokusaja = 10;
        req.session.broj = broj;
        req.session.broj_pokusaja = broj_pokusaja;
        poruka = "Pogodite broj!";

        res.json({ pokusaj: { broj_pokusaja: broj_pokusaja, poruka: poruka } });
        return;
    }

    if (broj_pokusaja > 0 && poruka.length == 0) {
        broj_pokusaja--;
        req.session.broj_pokusaja = broj_pokusaja;

        if (req.body['pokusaj'] == broj) {
            poruka = "Pogodili ste broj!";
        } else if (req.body['pokusaj'] > broj) {
            poruka = "Broj je manji!";
        } else {
            poruka = "Broj je veći!";
        }
    } else {
        poruka = "Game over!";
        req.session.broj = null;
    }

    res.json({ pokusaj: { broj_pokusaja: broj_pokusaja, poruka: poruka } });
});

// Middleware za ignorisanje svih GET zahtjeva osim za početnu stranicu
app.use(function (req, res, next) {
    if (req.method === 'GET' && req.url !== '/') {
        res.status(204).end(); // Bez sadržaja
    } else {
        next();
    }
});

app.listen(3000, () => {
    console.log("Aplikacija pokrenuta na http://localhost:3000");
});
