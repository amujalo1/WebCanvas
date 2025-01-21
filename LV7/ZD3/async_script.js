async function updateTask(event) {
    event.preventDefault(); 

    const id = document.getElementById('update-id').value.trim();
    const naziv = document.getElementById('update-naziv').value.trim();
    const opis = document.getElementById('update-opis').value.trim();

    if (!id || !naziv || !opis) {
        alert("Sva polja su obavezna!");
        return;
    }

    try {
        const response = await fetch(`/zadatak/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ naziv, opis }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.status);
        } else {
            alert(`Greška: ${data.status}`);
        }
    } catch (error) {
        alert(`Došlo je do greške: ${error.message}`);
    }
}
