document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('upload-form');
    const progressBar = document.getElementById('upload-progress'); // Assuming you have a progress bar element

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        const url = '/upload'; // The URL where the server handles the upload

        progressBar.classList.remove('hidden'); // Show the progress bar

        // Monitor the progress of the upload
        xhr.upload.addEventListener('progress', function(e) {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                progressBar.value = percentComplete; // Update the progress bar value
                // Optionally, display the percentage to the user
                progressBar.textContent = percentComplete.toFixed(2) + '%';
            }
        }, false);

        xhr.open('POST', url, true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                    // The request has been completed successfully
                    const data = JSON.parse(xhr.responseText);
                    if (data.success) {
                        // Handle success, such as redirecting to the new video URL
                        window.location.href = `/${data.slug}`;
                    } else {
                        // Handle failure, such as displaying an error message
                        alert(data.message);
                    }
                } else {
                    // Handle errors
                    console.error('Error:', xhr.statusText);
                    alert(xhr.statusText);
                }
            }
        };

        xhr.send(formData);
    });
});

