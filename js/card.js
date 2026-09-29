import { waitForAnimation } from './promiseWrapper.js';

export class Card {
    isActive = false;
    isHidden = false;
    card = null;
    textWrapper = null;
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

const textAnimations = this.textElement
    .getAnimations()
    .filter(animation => animation.animationName === "text-off");

        textAnimations.forEach(animation => animation.reverse());
        await Promise.allSettled(textAnimations.map(animation => animation.finished));

        this.card.classList.remove("default-perspective");
        void this.card.offsetWidth;
        this.card.classList.add("real-perspective");

        this.card.classList.remove("maximize");
        const cardAnimation = waitForAnimation(this.card);
        this.card.classList.add("minimize");
        const animationStyle = getComputedStyle(this.card);
        const animationDuration = parseFloat(animationStyle.animationDuration) * 1000;
        const animationDelay = parseFloat(animationStyle.animationDelay) * 1000;
        const animationTimeout = animationDuration + animationDelay + 100;
        await Promise.race([
            cardAnimation,
            new Promise(resolve => setTimeout(resolve, animationTimeout))
        ]);

        this.waitForForMenuResize();
    }

    async StartActiveCardAnimationAfter() {
        this.resolveMenuResize();
        this.card.classList.add("hoverCard");
        this.textWrapper.classList.remove("maximized");
        void this.textWrapper.offsetWidth;
        this.textWrapper.classList.add("minimized");

        this.textElement.classList.remove("maximizeText");
        this.textElement.classList.add("minimizeText");
        await new Promise(resolve => {
            const handler = async () => {

                $(this.textElement).off('animationend', handler);
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
        this.card.classList.remove("front");
        this.card.classList.add("hidden");
        await this.waitForActiveCard();
        this.card.classList.add("back");
    }

    async BackTextToDefault(){
        let backButton = this.card.querySelector(".back-button");
        backButton.classList.remove("active");

        this.card.classList.remove("real-perspective");
        void this.card.offsetWidth;
        this.card.classList.add("default-perspective");

        this.textElement.classList.remove("minimizeText");
        void this.textElement.offsetWidth;
        const maximizeTextAnimation = waitForAnimation(this.textElement, 'animationend');
        this.textElement.classList.add("maximizeText");
        await Promise.all([
            this.MaximizeCard(),
            await maximizeTextAnimation
        ]);
    }
    
    MaximizeCard(){
        new Promise(resolve => setTimeout(resolve, 1000));
        this.textWrapper.classList.remove("minimized");
        void this.textWrapper.offsetWidth;
        this.textWrapper.classList.add("maximized");
    }

    async BackActiveCardToDefault() {
        this.card.classList.remove("hoverCard");
        this.textElement.classList.remove("maximizeText");
        
        this.card.classList.remove("minimize");
        void this.card.offsetWidth;
        this.card.classList.add("maximize");
        
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

    async BackHiddenCardToDefault() {
        this.card.classList.remove("back");
        this.card.classList.add("front");
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.card.classList.remove("hoverCard");

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

    waitForForMenuResize() {
        return new Promise(resolve => {
            document.addEventListener("menuResizeDone", resolve, { once: true });
        });
    }

    resolveMenuResize() {
        document.dispatchEvent(new Event("menuResizeDone"))
    }

    ActiveBackButton() {
        let backButton = this.card.querySelector(".back-button");
        backButton.classList.add("active");
    }

    constructor(id) {
        this.card = document.getElementById(id);
        this.textWrapper = this.card.firstElementChild;
        this.textElement = this.textWrapper.firstElementChild;
        this.startCardPos = this.card.getBoundingClientRect();
        this.currentCardPos = this.startCardPos;
        this.initializeCardVariables(id);

        window.addEventListener('resize', () => this.initializeCardVariables(id));
    }

    initializeCardVariables(id) {
        const moveX = this.card.offsetLeft;
        this.card.style.setProperty('--move', `${moveX}px`);
        const time = 0.5 + 1.0 * Number(id);
        this.card.style.setProperty('--translateXTime', `${time}s`);
        const angle = (Number(id) * 1.5 - 1.5) * -10.0;
        this.card.style.setProperty('--rotateY', `${angle}deg`);
        const scale = Math.abs((Number(id) * 1.5 - 1.5)) * 0.04 + 0.9;
        this.card.style.setProperty('--scale', `${scale}`);
    }
}