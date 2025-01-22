document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/imenik')
        .then(res => res.json())
        .then(data => {
            loadHTMLTable(data['data']);
        })
        .catch(err => console.error('Greška prilikom dohvata podataka:', err));
});

const addBtn = document.querySelector('#add-name-btn');

addBtn.onclick = function () {
    const imeInput = document.querySelector('#name-input');
    const ime = imeInput.value;
    imeInput.value = '';

    const adresaInput = document.querySelector('#adres-input');
    const adresa = adresaInput.value;
    adresaInput.value = '';

    const brTelefonaInput = document.querySelector('#brTelefona-input');
    const brTelefona = brTelefonaInput.value;
    brTelefonaInput.value = '';

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            ime: ime,
            adresa: adresa,
            brTelefona: brTelefona,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                insertRowIntoTable(data.data);
            } else {
                console.error('Greška prilikom unosa podataka:', data.error);
            }
        })
        .catch(err => console.error('Greška prilikom unosa podataka:', err));
};

function insertRowIntoTable(data) {
    const table = document.querySelector('#table tbody');
    const row = table.insertRow();

    row.innerHTML = `
        <td>${data.ime}</td>
        <td>${data.adresa}</td>
        <td>${data.brojTelefona}</td>
    `;
}

function loadHTMLTable(data) {
    const table = document.querySelector('#table tbody');

    if (!data || data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='3'>Nema dostupnih podataka</td></tr>";
        return;
    }

    let tableHTML = '';

    data.forEach(({ ime, adresa, brojTelefona }) => {
        tableHTML += `
            <tr>
                <td>${ime}</td>
                <td>${adresa}</td>
                <td>${brojTelefona}</td>
            </tr>
        `;
    });

    table.innerHTML = tableHTML;
}
