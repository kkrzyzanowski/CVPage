let skillPage = 1;
let previousSkillPage = skillPage;
let maxSkillPages = 2;

export function drawSkillsChart(){
const ctx = document.getElementById('skillsChart').getContext('2d');

new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Frontend', 'Backend', 'Graphics', 'Optimization', 'Game Dev', 'Lazyness'],
        datasets: [{
            label: 'My Skills',
            data: [10, 70, 85, 90, 75, 100], // Twoje "statystyki"
            backgroundColor: 'rgba(255, 255, 255, 0.53)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        }]
    },
    options: {
        scales: {
            r: { // "r" = radial scale, bo radar chart jest kołowy
                angleLines: { color: "rgba(255, 255, 255, 0.3)" }, // Linie promieniowe
                grid: { color: "rgba(255, 255, 255, 0.2)" }, // Linia okręgów
                pointLabels: { 
                    color: "white", 
                    font: { size: 16, family: "Arial, sans-serif" }
                },
                ticks: { 
                    display: false, // Ukrywa liczby na osiach
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    }
});
}

export function drawPureSkillsChart(){
    const ctx = document.getElementById('skillsPureChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['C++', 'C#', 'TypeSript', 'Python', 'Angular', 'test'],
            datasets: [{
                label: 'My Skills',
                data: [10, 70, 85, 90, 75, 100], // Twoje "statystyki"
                backgroundColor: 'rgba(255, 255, 255, 0.53)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: { // "r" = radial scale, bo radar chart jest kołowy
                    angleLines: { color: "rgba(255, 255, 255, 0.3)" }, // Linie promieniowe
                    grid: { color: "rgba(255, 255, 255, 0.2)" }, // Linia okręgów
                    pointLabels: { 
                        color: "white", 
                        font: { size: 16, family: "Arial, sans-serif" }
                    },
                    ticks: { 
                        display: false, // Ukrywa liczby na osiach
                        beginAtZero: true,
                        max: 100
                    }
                }
            },
        }
    });
    }

export async function ButtonClick(direction){
    previousSkillPage = skillPage;
    let dirMultiplier = (direction == "right") ? 1 : -1;
        if(direction === "right"){
            skillPage++;
            if(skillPage > maxSkillPages){
                skillPage = 1;
             }
        }
        else if(direction === "left"){
            skillPage--;
            if(skillPage < 1){
                skillPage = maxSkillPages;
            }
        }
    await new Promise(resolve => setTimeout(resolve, 100));

    var previousTab = document.getElementById(`skill-tab-${previousSkillPage}`);
    var currentTab = document.getElementById(`skill-tab-${skillPage}`);

    currentTab.style.transition = "none"; // Najpierw wyłączamy animację
    currentTab.style.transform = `translateX(${dirMultiplier * -100}%)`; // Ustawiamy go w odpowiednie miejsce

    await new Promise(resolve => setTimeout(resolve, 50)); // Krótka pauza na przetworzenie zmian

    currentTab.style.transition = "transform 0.5s ease-in-out";
    previousTab.style.transition = "transform 0.5s ease-in-out";


 //  document.documentElement.style.setProperty('--skills-transition', `${dirMultiplier * 100}%`);

    previousTab.style.transform = `translateX(${dirMultiplier * 100}%)`;
    previousTab.classList.remove("skill-active");
    previousTab.classList.add("skill-inactive");

    await new Promise(resolve => setTimeout(resolve, 50));
        currentTab.classList.remove("skill-inactive");
        currentTab.classList.add("skill-active");
        currentTab.style.removeProperty("transform");
}
