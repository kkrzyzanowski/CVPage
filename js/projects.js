let currentInput = 2;
let inputs = 4
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

    loadEventsForProjects();
};

function loadEventsForProjects(){
    document.querySelectorAll(".projects > button").forEach(button =>{
        button.addEventListener("click",() => ButtonProjectClick(button.dataset.direction))
    });

    document.querySelectorAll("input[name='project-nav']").forEach(button =>{
        button.addEventListener("click",() => InputClick())
    });
}

function ButtonProjectClick(direction){
    console.log(`Button clicked with direction: ${direction}`);
    let move = 1;
    if(direction === "left")
        move = -1;
    currentInput += move;
    if(currentInput < 1)
        currentInput = 1;
    else if(currentInput > inputs)
        currentInput = inputs;
    var input = document.querySelector('input[name="project-nav"]:checked');
    input.checked = false;
    var currInput = document.getElementById(`pos${currentInput}`);
    currInput.checked = true;
}

function InputClick(){
    var id = document.querySelector('input[name="project-nav"]:checked').id;
    var tabNubmer = id[id.length - 1];
    console.log(tabNubmer);
    currentInput = parseInt(tabNubmer);
}