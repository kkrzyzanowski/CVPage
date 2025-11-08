export class Card {
    isActive = false;
    isHidden = false;
    card = null;
    textElement = null;
    previousStyleState = null;
    startCardPos = null;
    currentCardPos = null;

    OnClick(activate) {
        isActive = activate;
        isHidden = !this.isActive;
    }

    OnDefaut() {
        this.isActive = false;
        this.isHidden = false;
    }

    async StartActiveCardAnimation() {

        $(this.textElement).off('animationend');
        this.card.classList.add("active");
        this.card.classList.add("hoverCard");
        this.card.classList.remove("maximize");
        void this.card.offsetWidth;
        this.card.classList.add("minimize");
        setTimeout(() => {
            this.textElement.classList.add("minimizeText");
        }, 500);
        await new Promise(resolve => {
            const handler = () => {
            
                $(this.textElement).off('animationend', handler);
                this.textElement.classList.remove("minimizeText");
                this.textElement.style.transform = "translate(-50%, -50%) scale(0.2) rotate(-90deg)";
    
                this.resolveHiddenCard();
                resolve();
            };
            $(this.textElement).on('animationend', handler);
            
        });
    }

    async StartHideCardAnimation() {


        this.card.classList.add("hoverCard");
        this.card.classList.remove("show");
        void this.card.offsetWidth;
        this.card.classList.add("hidden");

        await this.waitForActiveCard();

        this.card.classList.add("inactive");
    }

    async BackActiveCardToDefault() {

        let backButton = this.card.querySelector(".back-button");
        backButton.classList.remove("active");

        this.card.classList.remove("minimize");
        void this.card.offsetWidth;
        this.card.classList.add("maximize");


        this.textElement.classList.remove("minimizeText");
        this.textElement.style.transform = "translate(-50%, -50%) scale(0.2) rotate(-90deg)"
        void this.textElement.offsetWidth;


        await new Promise(resolve => setTimeout(resolve, 1000));
        this.textElement.classList.add("maximizeText");


        await new Promise(resolve => {
            //$(this.textElement).off('animationend');
            $(this.textElement).on('animationend', () => {

                this.textElement.classList.remove("maximizeText");
                this.textElement.style.transform = "translate(0, 0) scale(1) rotate(-90deg)"
                this.card.classList.remove("hoverCard");
                resolve();
            });
        })

        await new Promise(resolve => {
            
            this.card.classList.remove("active");
            this.currentCardPos = this.card.getBoundingClientRect();
            const deltaX = this.startCardPos.left - this.currentCardPos.left;
            const deltaY = this.startCardPos.top - this.currentCardPos.top;
            this.card.style.transition = "transform 1s ease";
            this.card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            this.card.addEventListener("transitionend", function handler() {
                this.removeEventListener("transitionend", handler); // Usuwamy event po pierwszym wywołaniu
                resolve(); // Teraz Promise się kończy dopiero po animacji
            });
        })

        this.isActive = false;

    }

    BackDefaultCardPosition(){
        this.card.style.transition = "";
        this.card.style.transform = "translate(0, 0)";  
    }

    HiddenCardsShow(){
        this.card.classList.add("show");
    }

    async BackHiddenCardToDefault() {
        await new Promise(resolve => setTimeout(resolve), 1000);
        
        this.card.classList.remove("inactive");
        this.card.classList.remove("hoverCard");
        this.card.classList.remove("hidden");
        void this.card.offsetWidth;
        this.resolveRemoveTranslation();
       
    }

    waitForRemoveTranslation(){
        return new Promise(resolve => {
            document.addEventListener("translationDone", resolve, { once: true });
        }); 
    }

    resolveRemoveTranslation(){
        document.dispatchEvent(new Event("translationDone"))
    }
    waitForActiveCard() {
        return new Promise(resolve => {
            document.addEventListener("activeCardDone", resolve, { once: true });
        });
    }
    resolveHiddenCard() {
        document.dispatchEvent(new Event("activeCardDone"));
    }

    ActiveBackButton(){
        let backButton = this.card.querySelector(".back-button");
        backButton.classList.add("active");
    }


    constructor(id) {
        this.card = document.getElementById(id);
        this.textElement = this.card.firstElementChild;
        this.startCardPos = this.card.getBoundingClientRect();
        this.currentCardPos = this.startCardPos;
    }
}