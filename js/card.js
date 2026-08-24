import { waitForAnimation } from './promiseWrapper.js';

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

        await new Promise(resolve => {
            const handler = async () => {
                $(this.textElement).off('animationend', handler);
                resolve();
            }
            this.card.classList.remove("default-perspective");
                void this.card.offsetWidth;
                this.card.classList.add("real-perspective");
                this.card.classList.remove("maximize");
                void this.card.offsetWidth;
                this.card.classList.add("minimize");
        });
    }

    async StartActiveCardAnimationAfter() {
        this.card.classList.add("hoverCard");
        this.textElement.classList.remove("maximized");
        this.textElement.classList.remove("maximizeText");

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

        this.card.classList.remove("real-perspective");
        void this.card.offsetWidth;
        this.card.classList.add("real-perspective");

        await new Promise(resolve => setTimeout(resolve, 2001));
        this.textElement.classList.remove("minimizeText");
        void this.textElement.offsetWidth;
        this.textElement.classList.remove("minimized");

        const maximizeTextAnimation = waitForAnimation(this.textElement, 'animationend');
        this.textElement.classList.add("maximizeText");
        await maximizeTextAnimation;
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.textElement.classList.add("maximized");
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
        this.textElement = this.card.firstElementChild;
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