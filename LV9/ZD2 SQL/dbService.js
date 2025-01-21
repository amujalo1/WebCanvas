const mysql = require('mysql')
const dotenv = require('dotenv');
const { response } = require('express');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.user,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err)=>{
    if(err){
        console.log(err.message);
    }
    console.log('db '+ connection.state);
});

class dbService {
    static getDbServiceInstance(){
        return instance ? instance : new dbService();
    }

    async getAllData(){
        try{
            const res = await new Promise((resolve, reject) => {
                const query = "select * from imenik;";
                connection.query(query, (err,results) => {
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            console.log(res);
            return res;
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = dbService;