document.addEventListener('DOMContentLoaded', function() {
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const slug = window.location.pathname.split('/').pop(); // Extract the slug from the URL
    document.title = slug;

    // Append '.mp4' to the slug to construct the file path
    videoSource.src = `/uploads/${slug}.mp4`;
    videoPlayer.load(); // Load the new video source

    // Optionally, automatically play the video when it's ready
    videoPlayer.oncanplaythrough = function() {
        videoPlayer.style.display = 'block';
        videoPlayer.play();
    };
});
