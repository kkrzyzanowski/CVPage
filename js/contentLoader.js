import { ButtonClick, drawSkillsChart, drawPureSkillsChart } from "./skillsChart.js"
import { loadVideoProjectsBehaviour} from "./projects.js"
export function contentLoader(fileIndex) {
    let file = "";
    console.log(fileIndex);
    switch (Number(fileIndex)) {
        case 0:
            file = "../about-me.html"
            break;
        case 1:
            file = "../skills.html"
            break;
        case 2:
            file = "../projects.html"
            break;
    }
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
            if (fileIndex == 1) {
                document.querySelectorAll("div > button").forEach(button => {
                    button.addEventListener("click", () => ButtonClick(button.dataset.direction));
                });
                drawSkillsChart();
                drawPureSkillsChart();
            }
            else if (fileIndex == 2) {
                loadVideoProjectsBehaviour();
            }
        })
        .catch(error => console.error("Failed to load page", error));
}

export function contentDeloader() {
    document.getElementById("content").innerHTML = "";
}

