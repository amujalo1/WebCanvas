const Sequelize = require("sequelize");
const sequelize = new Sequelize("imenikWT", "root", {
    host: "127.0.0.1",
    dialect: "mysql",
    port: 8011
});
sequelize
    .authenticate()
    .then(() => {
        console.log("Uspješno povezivanje s bazom!");
    })
    .catch((error) => {
        console.error("Povezivanje s bazom nije uspjelo:", error);
    });
    
module.exports = sequelize;