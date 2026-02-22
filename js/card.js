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
        this.card.classList.add("hoverCard");
        this.textElement.classList.remove("maximized");
        this.textElement.classList.remove("maximizeText");
        this.card.classList.remove("maximize");
        void this.card.offsetWidth;
        this.card.classList.add("minimize");
        
        this.textElement.classList.add("minimizeText");
        await new Promise(resolve => {
            const handler = async () => {
                
                $(this.textElement).off('animationend', handler);
                this.resolveHiddenCard();
                resolve();
            };
            $(this.textElement).on('animationend', handler);
            this.textElement.classList.add("minimized");
            
        });
    }

    async StartHideCardAnimation() {

        this.card.classList.add("hoverCard");
        this.card.classList.remove("show");
        void this.card.offsetWidth;
        this.card.classList.remove("front");
        this.card.classList.add("hidden");
        await this.waitForActiveCard();
        this.card.classList.add("back");
    }

    async BackActiveCardToDefault() {

        let backButton = this.card.querySelector(".back-button");
        backButton.classList.remove("active");


        this.card.classList.remove("minimize");
        void this.card.offsetWidth;

        // uruchom maksymalizację karty i poczekaj stały czas (tu 2000ms + mały bufor)
        this.card.classList.add("maximize");
        await new Promise(resolve => setTimeout(resolve, 2100)); // dopasuj jeśli zmienisz CSS

        // teraz tekst

        this.textElement.classList.remove("minimizeText");
        void this.textElement.offsetWidth;

        // uruchom maksymalizację tekstu i poczekaj jego czas (tu 1000ms + buffer)
        this.textElement.classList.remove("minimized");
        this.textElement.classList.add("maximizeText");
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.textElement.classList.add("maximized");
        this.isActive = false;
    }

    async moveToZero() {
        return new Promise(resolve => {
            const list = document.getElementById('list');
            const curr = this.card.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();
            // przesunięcie żeby karty dotarła do lewej krawędzi list, biorąc pod uwagę margin
            const deltaX = listRect.left - curr.left;

            this.card.style.transition = "transform 600ms ease";
            void this.card.offsetWidth;
            this.card.style.transform = `translateX(${deltaX}px)`;

            const handler = (e) => {
                if (e.propertyName === 'transform') {
                    this.card.removeEventListener('transitionend', handler);
                    resolve();
                }
            };
            this.card.addEventListener('transitionend', handler);
        });
    }

    async moveBack() {
        return new Promise(resolve => {
            // przywróć oryginalną pozycję (przed przesunięciem)
            this.card.style.transition = "transform 600ms ease";
            void this.card.offsetWidth;
            this.card.style.transform = "";

            const handler = (e) => {
                if (e.propertyName === 'transform') {
                    this.card.removeEventListener('transitionend', handler);
                    this.card.style.transition = "";
                    resolve();
                }
            };
            this.card.addEventListener('transitionend', handler);
        });
    }

    BackDefaultCardPosition() {
        this.card.style.transition = "";
        this.card.style.transform = "translate(0, 0)";
    }

    HiddenCardsShow() {

    }

    async BackHiddenCardToDefault() {
        this.card.classList.remove("back");
        this.card.classList.add("front");
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.card.classList.remove("hoverCard");
        
        // NIE usuwaj hidden - po prostu dodaj show
        // Element jest już w stanie końcowym hidden, teraz animuj show od tego miejsca
        this.card.classList.remove("hidden");
        void this.card.offsetWidth;
        this.card.classList.add("show");

        this.resolveRemoveTranslation();

    }

    waitForRemoveTranslation() {
        return new Promise(resolve => {
            document.addEventListener("translationDone", resolve, { once: true });
        });
    }

    resolveRemoveTranslation() {
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

    ActiveBackButton() {
        let backButton = this.card.querySelector(".back-button");
        backButton.classList.add("active");
    }


    constructor(id) {
        this.card = document.getElementById(id);
        this.textElement = this.card.firstElementChild;
        this.startCardPos = this.card.getBoundingClientRect();
        this.currentCardPos = this.startCardPos;
        // initialize per-card move variable so keyframes using var(--move) work
        this.updateMoveVar();
        // keep --move updated on resize
        window.addEventListener('resize', () => this.updateMoveVar());
    }

    updateMoveVar() {
        // move the card to the container left (0) by translating it by -offsetLeft
        const moveX = this.card.offsetLeft;
        this.card.style.setProperty('--move', `${moveX}px`);
    }
}