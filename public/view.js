document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const slug = window.location.pathname.split('/').pop(); // Extract the slug from the URL

    // Set the video source to the path where the server serves the video files
    videoSource.src = `/uploads/${slug}`;
    videoPlayer.load(); // Load the new video source

    // Optionally, automatically play the video when it's ready
    videoPlayer.oncanplaythrough = function() {
        videoPlayer.play();
    };
});

