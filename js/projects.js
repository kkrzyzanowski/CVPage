export function loadVideoProjectsBehaviour() {
    const modal = document.getElementById("videoModal");
    const videoPlayer = document.getElementById("videoPlayer");
    const videoSource = document.getElementById("videoSource");
    const closeBtn = document.querySelector(".close");

    document.querySelectorAll(".project-tab img").forEach(img => {
        img.addEventListener("click", function () {
            const videoSrc = this.getAttribute("data-video");
            const extension = videoSrc.split('.').pop().toLowerCase();
            let type = "video/mp4";
            videoSource.src = videoSrc;
            videoSource.type = type;
            videoPlayer.load();
            videoPlayer.play();
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
        });

        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.style.display = "none";
                videoPlayer.pause();
                videoPlayer.currentTime = 0;
            }
        });
    });
};