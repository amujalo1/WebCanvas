document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:5000/imenik')
        .then(res => res.json())
        .then(data => {
            loadHTMLTable(data['data']);
        })
        .catch(err => console.error('Greška prilikom dohvata podataka:', err));
});


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
