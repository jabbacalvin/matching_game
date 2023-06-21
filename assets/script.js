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

resetBtn.addEventListener('click', (e) => {
    initializeGame();
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

                initializeOptions(itemBtns, this.category);
                initializeOptions(matchingItemBtns, this.category);
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

                if (e.target.classList.contains('itemBtns')) {
                    this.itemBtnValue = dataId;
                } else {
                    this.matchingItemBtnValue = dataId;
                }

                if(this.itemBtnValue !== null && this.matchingItemBtnValue !== null) {
                    if(this.compareValues()) {
                        this.itemBtnValue = null;
                        this.matchingItemBtnValue = null;
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
                            if (e.classList.contains('focusMatches') || e.classList.contains('focusMatchesCorrect')) {
                                e.classList.remove('focusMatches');
                                e.classList.remove('focusMatchesCorrect');
                                e.classList.add('focusMatchesWrong');
                            }
                        });
                    }
                }
            }
        });
    }
    compareValues() {      
        if (this.itemBtnValue === this.matchingItemBtnValue 
            && this.matchingItemBtnValue === this.itemBtnValue) {
            return true;
        } else {
            return false;
        }
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

initializeGame();

function initializeGame() {
    const categories = new Categories(categoryBtns, categoryWrapperEl);
    game = new MatchingGame(categoryItemsWrapperEl, matchingItemsWrapperEl);
}

function initializeOptions(bottons, category) {
    new Options(bottons, category);
}