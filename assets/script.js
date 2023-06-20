let game;

const categoryWrapperEl = document.querySelector('.categories');
const categoryBtns = document.querySelectorAll('.categoryBtns');
const gameContainerWrapperEl = document.querySelector('.gameContainer');
const categoryItemsWrapperEl = document.querySelector('.categoryItems');
const itemBtns = document.querySelectorAll('.itemBtns');
const matchingItemsWrapperEl = document.querySelector('.matchingItems');
const matchingItemBtns = document.querySelectorAll('.matchingItemBtns');
const resetBtn = document.querySelector('.resetBtn');

gameContainerWrapperEl.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
        game.compareValues();
    }
});

class Categories {
    static categoriesLookup = {
        '0': 'NUMBERS',
        '1': 'LETTERS',
        '2': 'COLORS',
        '3': 'SHAPES',
        '4': 'ANIMALS',
        '5': 'CARS',
        '6': 'BABY SHARK',
        '7': 'PINKFONG WONDERSTAR',
        '8': 'ELMO & FRIENDS'
    }
    constructor(domElements, domWrapperEl) {
        this.domElements = domElements;
        this.render();
        this.domWrapperEl = domWrapperEl;
        this.domWrapperEl.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'button') {
                this.category = e.target.innerText.toLowerCase();
                
                categoryBtns.forEach(e => e.classList.remove('focusCategory'));
                e.target.classList.toggle('focusCategory');

                new Options(itemBtns, this.category);
                new Options(matchingItemBtns, this.category);
            }
        });
    }
    render() {
        this.domElements.forEach((element, index) => {
            element.innerText = Categories.categoriesLookup[index];
        });
    }
}

class Options {
    constructor(domElements, category) {
        this.domElements = domElements;
        this.category = category;
        this.render();
    }
    randomize() {
        const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let currentIndex = array.length
        let randomIndex;
        while (currentIndex != 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }        
        return array;
    }
    render() {
        const randomizedArr = this.randomize();
        const category = this.category;
        this.domElements.forEach((element, index) => {
            element.style.backgroundImage = `url("assets/images/${category}/${randomizedArr[index]}.png")`
            element.setAttribute('data-id', randomizedArr[index]);
        });
    }
}

class MatchingGame {
    constructor(categoryItemsWrapperEl, matchingItemsWrapperEl) {
        this.categoryItemsWrapperEl = categoryItemsWrapperEl;
        this.matchingItemsWrapperEl = matchingItemsWrapperEl;
        this.itemBtnValue = null;
        this.matchingItemBtnValue = null;

        this.render();
    }
    displayClick(domWrapperEl) {
        domWrapperEl.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'button' && e.target.hasAttribute('data-id')) {
                const listArray = [...domWrapperEl.children];
                listArray.forEach(e => e.classList.remove('focusMatches'));
                e.target.classList.toggle('focusMatches');

                const dataId = e.target.getAttribute('data-id');

                if (e.target.classList.contains('itemBtns')) {
                    this.itemBtnValue = dataId;
                } else {
                    this.matchingItemBtnValue = dataId;
                }
            }
        });
    }
    compareValues() {      
        this.itemBtnValue === this.matchingItemBtnValue ? console.log(true) : console.log(false);
        this.matchingItemBtnValue === this.itemBtnValue ? console.log(true) : console.log(false);
    }
    play() {

    }
    render() {
        this.displayClick(this.categoryItemsWrapperEl);
        this.displayClick(this.matchingItemsWrapperEl);
    }
}

categoryItemsWrapperEl.addEventListener('click', (e) => {

})

initialize();

function initialize() {
    const categories = new Categories(categoryBtns, categoryWrapperEl);
    game = new MatchingGame(categoryItemsWrapperEl, matchingItemsWrapperEl);
}