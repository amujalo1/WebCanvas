const express = require('express');
const app = express();
const path = require('path');

const indexPath = path.join(__dirname, 'index.html');

app.use(express.static(__dirname));

app.get('/index', (req, res) => {
    res.sendFile(indexPath);
});

app.listen(3000, () => {
  console.log('Server pokrenut na http://localhost:3000/index');
});
