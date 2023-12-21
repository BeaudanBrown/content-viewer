document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const url = '/upload'; // The URL where the server handles the upload

        fetch(url, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Handle success, such as redirecting to the new video URL
                window.location.href = `/${data.slug}`;
            } else {
                // Handle failure, such as displaying an error message
                alert(data.message);
            }
        })
        .catch(error => {
            // Handle network errors
            console.error('Error:', error);
            alert(error);
        });
    });
});

