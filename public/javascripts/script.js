async function logOut() {
    try {
        const response = await fetch(window.location.origin + '/logout', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            }
        })
        // await response.json();
        return window.location.reload();
    } catch (err) {
        alert(err.message);
    }
};