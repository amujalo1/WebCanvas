const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class dbService {
    static getDbServiceInstance() {
        return instance ? instance : new dbService();
    }

    async getAllData() {
        try {
            const res = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM imenik;';
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return res;
        } catch (err) {
            console.log(err);
        }
    }

    async insertNewRecord(ime, adresa, brTelefona) {
        try {
            const res = await new Promise((resolve, reject) => {
                const query = 'INSERT INTO imenik (ime, adresa, brojTelefona) VALUES (?, ?, ?);';
                connection.query(query, [ime, adresa, brTelefona], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                });
            });
            return {
                id: res.insertId,
                ime,
                adresa,
                brojTelefona: brTelefona,
            };
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = dbService;
