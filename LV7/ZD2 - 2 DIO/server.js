const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(8085, () => {
    console.log("Server is running at http://localhost:8085/");
});
