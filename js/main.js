import { contentDeloader, contentLoader } from "./contentLoader.js";
import { Card } from "./card.js";

let isContentRunned = false;
let cards = [];
let elementsCount = 0;
let menu = null;
let content = null;

export async function runAnimation($event){
    isContentRunned = !isContentRunned;
    for(var i = 0; i<elementsCount;i++)
    {
        var card = cards.find(x => x.card.id == i);
        if(card)
        {   
            card.isActive = $event == i ? true : false;
            card.isHidden = $event != i ? true : false;
        }
    }
    var hideCards = cards.filter(x => { 
        if(x.isHidden == true)
            return x});
    var activeCard = cards.find(x => x.isActive === true);;
    if(isContentRunned)
    {
        hideCards.forEach(x => x.StartHideCardAnimation());
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        await new Promise(resolve => {
            activeCard.StartActiveCardAnimation();
            $(activeCard.textElement).on('animationend', function handler() {
                $(activeCard.textElement).off('animationend', handler);
                resolve();
            });
        });
        
        await runContent($event);
        activeCard.ActiveBackButton();
    }
    else
    {
        hideContent();
        await activeCard.BackActiveCardToDefault();
        await Promise.all(hideCards.map(x => x.BackHiddenCardToDefault()));
        activeCard.BackDefaultCardPosition();
        hideCards.map(x => x.HiddenCardsShow())
    }
}

function runContent(index){
    return new Promise(resolve => {
    content.classList.add("show");
    menu.classList.remove("show");
    menu.classList.add("hide");
    setTimeout(() => {
        contentLoader(index);
        Promise.resolve().then(resolve);
    }, 5000); // to calculate
});
        
}

async function hideContent(){

    await new Promise (resolve => {
        content.classList.remove("show");
        void content.offsetWidth;
        content.classList.add("hide");
        setTimeout(() => {
            content.classList.remove("hide");
            contentDeloader();
            resolve();
        
        }, 1600);
    });
   
    //document.documentElement.style.setProperty('--menu-transition-delay', '4s');

    menu.classList.remove("hide");
    //void menu.offsetWidth;
    menu.classList.add("show");
    // setTimeout(() => {
    //     menu.classList.remove("show");
    // }, 3100);
}

export function InitializeClick(){

    document.querySelectorAll("#list > li").forEach(item => {
        item.addEventListener("click", () => runAnimation(item.id));
    });

    elementsCount = document.getElementById("list").
    querySelectorAll("#list>li").length;
    for(var i =0; i<elementsCount; ++i)
    {
        cards.push(new Card(i));
    }
    content = document.getElementById("content");          
    menu = document.getElementById("menu");  
}


document.addEventListener("DOMContentLoaded", InitializeClick);
