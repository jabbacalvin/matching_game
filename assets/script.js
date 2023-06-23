let game;

const categoryWrapperEl = document.querySelector('.categories');
const category = document.querySelectorAll('.category');
const gameContainerWrapperEl = document.querySelector('.gameContainer');
const categoryItemsWrapperEl = document.querySelector('.categoryItems');
const categoryItem = document.querySelectorAll('.categoryItem');
let categoryItemImage = null;
const matchingItemsWrapperEl = document.querySelector('.matchingItems');
const matchingItem = document.querySelectorAll('.matchingItem');
const resetBtn = document.querySelector('.resetBtn');

// gameContainerWrapperEl.addEventListener('click', (e) => {
//     if (e.target.tagName.toLowerCase() === 'div') {
//         game.compareValues();
//     }
// });



resetBtn.addEventListener('click', (e) => {
    resetGame();
});

class Categories {
    static categoriesLookup = {
        '0': 'NUMBERS',
        '1': 'LETTERS',
        '2': 'FRUITS',
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
            if (e.target.tagName.toLowerCase() === 'button') {
                resetGame();
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
        this.domElements.forEach((e) => {
            e.innerHTML = '';
            e.style.pointerEvents = 'auto';
            e.removeEventListener('drop', handleDrop);
            e.removeEventListener('dragover', handleDragOver);
            e.removeAttribute('data-id');
        });
    }
    render() {
        const randomizedArr = this.randomize();
        const category = this.category;

        matchingItem.forEach((e) => {
            e.addEventListener('drop', handleDrop);
            e.addEventListener('dragover', handleDragOver);
        });

        this.domElements.forEach((element, index) => {
            if (category !== undefined) {
                if (element.classList.contains('categoryItem')) {
                    element.innerHTML = `<img class="categoryItemImage" src="assets/images/${category}/${randomizedArr[index]}.png" draggable="true" id="${category}${randomizedArr[index]}" data-id="${randomizedArr[index]}">`;
                    
                } else {
                    element.style.pointerEvents = 'auto';
                    element.innerHTML = `<div draggable="false" style="background-image: url('assets/images/${category}/${randomizedArr[index]}.png'); background-size:contain; opacity:0.2; height:100%; pointer-events:none; position:relative;"></div>`;
                }
            } 
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

        // this.render();
    }
    reset() {
        const categoryItemsArray = [...this.categoryItemsWrapperEl.children];
        categoryItemsArray.forEach(e => e.style.display = 'inline-block');
        const matchingItemsArray = [...this.matchingItemsWrapperEl.children];
        matchingItemsArray.forEach(e => e.classList.remove('focusMatchesCorrect'));
    }
}

let draggedItemParent = null;

function handleDragOver(e) {
    e.preventDefault();
    
}
  
function handleDragStart(e) {
    draggedItemParent = document.getElementById(e.target.id).parentElement;
    this.style.opacity = '0.4';
    e.dataTransfer.setData('text', e.target.id);
}

function handleDragEnd(e) {
    this.style.opacity = '1';
  }
  
function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text');
    let id = data.replace(/\D/g, '');

    if (e.target.getAttribute('data-id') === id) {
        e.target.appendChild(document.getElementById(data));
        e.target.classList.add('focusMatchesCorrect');
        draggedItemParent.style.display = 'none';
        this.style.pointerEvents = 'none';
        for (const child of this.children) {
            child.style.pointerEvents = 'none';
        }
    } else {
        e.target.classList.add('focusMatchesWrong');
        setTimeout(function () { 
            e.target.classList.remove('focusMatchesWrong');
        }, 1000);
    }
}

function handleMouseDown(e) {
    window.getSelection().removeAllRanges();
}

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
        categoryItemImage = document.querySelectorAll('.categoryItemImage');
        categoryItemImage.forEach((e) => {
            e.addEventListener('dragstart', handleDragStart);
            e.addEventListener('dragend', handleDragEnd);
            e.addEventListener('mousedown', handleMouseDown);
        });
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