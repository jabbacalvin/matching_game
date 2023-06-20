let game;

const categoryWrapperEl = document.querySelector('.categories');
const categoryBtns = document.querySelectorAll('.categoryBtns');
const itemBtns = document.querySelectorAll('.itemBtns');
const matchingBtns = document.querySelectorAll('.matchingBtns');
const resetBtn = document.querySelector('.resetBtn');

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
            this.category = e.target.innerText.toLowerCase();
            new Options(itemBtns, this.category);
            new Options(matchingBtns, this.category);
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
    constructor(itemBtns, matchingBtns) {

    }
    play() {

    }
    render() {
        
    }
}

initialize();

function initialize() {
    const categories = new Categories(categoryBtns, categoryWrapperEl);
}