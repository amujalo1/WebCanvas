const { response } = require("express");

document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/imenik')
        .then(res => res.json())
        .then(data => {
            console.log(data);
            loadHTMLTable(data['data']);
        })
        .catch(err => console.error("Greška prilikom dohvata podataka:", err));
});

const addBtn = document.querySelector('#add-name-btn');

addBtn.onClick = function(){
    const imeInput = document = document.querySelector('#name-input');
    const ime = imeInput.value;
    imeInput.value="";
    const adresaInput = document = document.querySelector('#adres-input');
    const adresa = adresaInput.value;
    adresaInput.value="";
    const brTelefonaInput = document = document.querySelector('#brTelefona-input');
    const brTelefona = brTelefonaInput.value;
    brTelefonaInput.value="";

    fetch('https://localhost:5000/insert',{
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            ime:ime,
            adresa:adresa,
            brTelefona:brTelefona
        })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']))
    })
}

function insertRowIntoTable(data){
    
}
function loadHTMLTable(data) {
    const table = document.querySelector("#table tbody");
    console.log(data);
    if (!data || data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>Nema dostupnih podataka</td></tr>";
        return;
    }

    let tableHTML = "";

    

    table.innerHTML = tableHTML;
}
