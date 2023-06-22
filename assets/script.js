let game;

const categoryWrapperEl = document.querySelector('.categories');
const category = document.querySelectorAll('.category');
const gameContainerWrapperEl = document.querySelector('.gameContainer');
const categoryItemsWrapperEl = document.querySelector('.categoryItems');
const categoryItem = document.querySelectorAll('.categoryItem');
const matchingItemsWrapperEl = document.querySelector('.matchingItems');
const matchingItem = document.querySelectorAll('.matchingItem');
const resetBtn = document.querySelector('.resetBtn');

gameContainerWrapperEl.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
        game.compareValues();
    }
});

resetBtn.addEventListener('click', (e) => {
    resetGame();
});

class Categories {
    static categoriesLookup = {
        '0': 'NUMBERS',
        '1': 'LETTERS',
        '2': 'COLORS',
        '3': 'SHAPES',
        '4': 'ANIMALS',
        '5': 'TRANSPORTATIONS',
        '6': 'BABY SHARK',
        '7': 'PINKFONG WONDERSTAR',
        '8': 'ELMO & FRIENDS'
    }
    constructor(domElements, domWrapperEl) {
        this.domElements = domElements;
        this.render();
        this.domWrapperEl = domWrapperEl;
        this.domWrapperEl.addEventListener('click', (e) => {
            resetGame();
            if (e.target.tagName.toLowerCase() === 'button') {
                this.category = e.target.innerText.toLowerCase();
                category.forEach(e => e.classList.remove('focusCategory'));
                e.target.classList.toggle('focusCategory');

                initializeOptions(categoryItem, this.category);
                initializeOptions(matchingItem, this.category);
            }
        });
    }
    reset() {
        category.forEach(e => e.classList.remove('focusCategory'));
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
    reset() {
        const category = null;
        this.domElements.forEach((element, index) => {
            element.style.backgroundImage = "";
            element.removeAttribute('data-id');
        });
    }
    render() {
        const randomizedArr = this.randomize();
        const category = this.category;
        this.domElements.forEach((element, index) => {
            element.style.backgroundImage = `url("assets/images/${category}/${randomizedArr[index]}.png")`;
            element.setAttribute('data-id', randomizedArr[index]);
        });
    }
}

class MatchingGame {
    constructor(categoryItemsWrapperEl, matchingItemsWrapperEl) {
        this.categoryItemsWrapperEl = categoryItemsWrapperEl;
        this.matchingItemsWrapperEl = matchingItemsWrapperEl;
        this.categoryItemValue = null;
        this.matchingItemValue = null;

        this.render();
    }
    displayClick(domWrapperEl) {
        domWrapperEl.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'button' && e.target.hasAttribute('data-id')) {
                const domWrapperElName = domWrapperEl.classList.value;
                const listArray = [...domWrapperEl.children];
                
                let oppositeDomWrapperEl = null;
                let oppositeDomWrapperElName = null;                
                let oppositeListArray = null;

                if (e.target.parentNode.classList.contains('categoryItems')) {
                    oppositeDomWrapperEl = e.target.closest('.gameContainer').querySelector('.matchingItems');
                    oppositeListArray = [...oppositeDomWrapperEl.children];
                    oppositeDomWrapperElName = oppositeDomWrapperEl.classList.value;
                } else {
                    oppositeDomWrapperEl = e.target.closest('.gameContainer').querySelector('.categoryItems');
                    oppositeListArray = [...oppositeDomWrapperEl.children];
                    oppositeDomWrapperElName = oppositeDomWrapperEl.classList.value;
                }

                listArray.forEach(e => e.classList.remove('focusMatches', 'focusMatchesWrong'));
                e.target.classList.add('focusMatches');

                const dataId = e.target.getAttribute('data-id');

                if (e.target.classList.contains('categoryItem')) {
                    this.categoryItemValue = dataId;
                } else {
                    this.matchingItemValue = dataId;
                }

                if(this.categoryItemValue !== null && this.matchingItemValue !== null) {
                    if(this.compareValues()) {
                        this.categoryItemValue = null;
                        this.matchingItemValue = null;
                        e.target.classList.remove('focusMatches');
                        e.target.classList.add('focusMatchesCorrect');

                        oppositeListArray.forEach(e => {
                            if (e.classList.contains('focusMatches') || e.classList.contains('focusMatchesWrong')) {
                                e.classList.remove('focusMatches');
                                e.classList.remove('focusMatchesWrong');
                                e.classList.add('focusMatchesCorrect');
                            }
                        });
                        
                        if (domWrapperElName === "categoryItems") {
                            listArray.forEach(e => {
                                if (e.classList.contains('focusMatchesCorrect')) {
                                    e.style.display = "none";
                                    e.classList.remove('focusMatchesCorrect');
                                }
                            });
                        } else if (oppositeDomWrapperElName === "categoryItems") {
                            oppositeListArray.forEach(e => {
                                if (e.classList.contains('focusMatchesCorrect')) {
                                    e.style.display = "none";
                                    e.classList.remove('focusMatchesCorrect');
                                }
                            });
                        }
                    } else {
                        listArray.forEach(e => e.classList.remove('focusMatchesWrong'));
                        e.target.classList.add('focusMatchesWrong');
                        
                        oppositeListArray.forEach(e => {
                            if (e.classList.contains('focusMatches')) {
                                e.classList.remove('focusMatches');
                                e.classList.remove('focusMatchesCorrect');
                                
                                e.classList.add('focusMatchesWrong');
                            }

                            if (e.classList.contains('focusMatchesWrong')) {
                                e.classList.remove('focusMatchesWrong');
                                setTimeout(() => {
                                    e.classList.add('focusMatchesWrong');
                                }); 
                            }
                        });
                    }
                }
            }
        });
    }
    compareValues() {      
        if (this.categoryItemValue === this.matchingItemValue 
            && this.matchingItemValue === this.categoryItemValue) {
            return true;
        } else {
            return false;
        }
    }
    reset() {
        const categoryItemsArray = [...this.categoryItemsWrapperEl.children];
        categoryItemsArray.forEach(e => e.classList.remove('focusMatches', 'focusMatchesWrong', 'focusMatchesCorrect'));
        categoryItemsArray.forEach(e => e.style.display = "inline-block");
        const matchingItemsArray = [...this.matchingItemsWrapperEl.children];
        matchingItemsArray.forEach(e => e.classList.remove('focusMatches', 'focusMatchesWrong', 'focusMatchesCorrect'));

    }
    render() {
        this.displayClick(this.categoryItemsWrapperEl);
        this.displayClick(this.matchingItemsWrapperEl);
    }
}

categoryItemsWrapperEl.addEventListener('click', (e) => {

})

initializeGame();

function initializeGame() {
    const categories = new Categories(category, categoryWrapperEl);
    game = new MatchingGame(categoryItemsWrapperEl, matchingItemsWrapperEl);
}

function resetCategories(buttons, domWrapperEl) {
    new Categories(buttons, domWrapperEl).reset();
}

function initializeOptions(bottons, category) {
    if (category != null) {
        new Options(bottons, category);
    } else {
        new Options(bottons, category).reset();
    }
}

function resetGame() {
    resetCategories(category, categoryWrapperEl);
    initializeOptions(categoryItem);
    initializeOptions(matchingItem);
    game.reset();
}