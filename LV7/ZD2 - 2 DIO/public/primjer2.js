function ispisi(error, token) {
    if (!error) {
        console.log(token);
        listRepositories(null, token); // Poziv funkcije za listanje repozitorija
    }
}

function getAccessToken(proslijedi) {
    let ajax = new XMLHttpRequest();

    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4) {
            if (ajax.status == 200) {
                proslijedi(null, JSON.parse(ajax.responseText).access_token);
            } else {
                console.error("Greška kod dobivanja access tokena:", ajax.responseText);
                proslijedi(ajax.status, null);
            }
        }
    };

    ajax.open("POST", "https://bitbucket.org/site/oauth2/access_token", true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.setRequestHeader(
        "Authorization",
        "Basic " + btoa("6EXmGMyxGT9ZXaUJF7:FVxz3cGCEGXGk5Qecv3nwAwJxqMKHrYc")
    );
    ajax.send("grant_type=" + encodeURIComponent("client_credentials"));
}

function listRepositories(error, token) {
    if (error) throw error;
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            let podaci = JSON.parse(ajax.responseText);
            let tabelaDiv = document.getElementById("tabela");

            // Kreiranje tabele
            let tabela = document.createElement("table");
            tabela.style.borderCollapse = "collapse";
            tabela.style.width = "100%";

            // Dodavanje zaglavlja
            let thead = tabela.createTHead();
            let headerRow = thead.insertRow();
            ["Repozitorij", "Vlasnik"].forEach((text) => {
                let th = document.createElement("th");
                th.style.border = "1px solid black";
                th.style.padding = "8px";
                th.style.backgroundColor = "#f2f2f2";
                th.textContent = text;
                headerRow.appendChild(th);
            });

            // Dodavanje podataka u tabelu
            let tbody = tabela.createTBody();
            podaci.values.forEach((repo) => {
                let row = tbody.insertRow();
                [repo.name, repo.owner.username].forEach((value) => {
                    let cell = row.insertCell();
                    cell.style.border = "1px solid black";
                    cell.style.padding = "8px";
                    cell.textContent = value;
                });
            });

            tabelaDiv.innerHTML = ""; // Čišćenje starog sadržaja
            tabelaDiv.appendChild(tabela);
        } else if (ajax.readyState == 4) {
            console.error("Greška pri dobijanju repozitorija:", ajax.status);
        }
    };
    ajax.open("GET", "https://api.bitbucket.org/2.0/repositories?role=member", true);
    ajax.setRequestHeader("Authorization", "Bearer " + token);
    ajax.send();
}

getAccessToken(ispisi);
