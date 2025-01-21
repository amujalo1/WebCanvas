const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neka tajna sifra',
    resave: true,
    saveUninitialized: true
}));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get('/', function (req, res) {
    if (req.session.broj == null) {
        req.session.broj = Math.floor((Math.random() * 100) + 1);
        req.session.broj_pokusaja = 10;
    }
    res.render("pogodiBroj", {
        pokusaj: { broj_pokusaja: req.session.broj_pokusaja, poruka: "Pogodite broj" }
    });
});

app.post('/', function (req, res) {
    let broj = req.session.broj;
    let broj_pokusaja = req.session.broj_pokusaja;

    if (broj_pokusaja > 0) {
        broj_pokusaja--;
        req.session.broj_pokusaja = broj_pokusaja;

        if (parseInt(req.body['pokusaj']) === broj) {
            poruka = "Pogodili ste broj!";
        } else if (parseInt(req.body['pokusaj']) > broj) {
            poruka = "Broj je manji!";
        } else {
            poruka = "Broj je veći!";
        }
    } else {
        poruka = "Game over!";
        req.session.broj = null;
    }

    res.render("pogodiBroj", {
        pokusaj: { broj_pokusaja: broj_pokusaja, poruka: poruka }
    });
});

app.listen(3000, () => {
    console.log("Aplikacija pokrenuta na http://localhost:3000");
});
