let game;

let count = 0; // count number of matches each game
let randomizedAlphabetsArr;
let curCategory;
let draggedItemId;
let draggedItemParent;

const headerEl = document.querySelector('header');
const categoryWrapperEl = document.querySelector('.categories');
const categoryEl = document.querySelectorAll('.category');
const gameContainerWrapperEl = document.querySelector('.gameContainer');
const gameBoardContainerWrapperEl = document.querySelector('.gameBoardContainer');
const popupWrapperEl = document.getElementById('popup');
const messageEl = document.getElementById('message');
const categoryItemsWrapperEl = document.querySelector('.categoryItems');
const categoryItemEl = document.querySelectorAll('.categoryItem');
let categoryItemImageEl;
const matchingItemsWrapperEl = document.querySelector('.matchingItems');
const matchingItemEl = document.querySelectorAll('.matchingItem');
const audioEl = document.getElementById('myAudio');
const resetBtn = document.querySelector('.resetBtn');

resetBtn.addEventListener('click', (e) => {
    resetBoard(false);
});

class Categories {
    static categoriesLookup = {
        '0': 'NUMBERS',
        '1': 'ALPHABETS',
        '2': 'FRUITS',
        '3': 'SHAPES',
        '4': 'ANIMALS',
        '5': 'VEHICLES',
        '6': 'BABY SHARK',
        '7': 'PINKFONG WONDERSTAR',
        '8': 'ELMO & FRIENDS'
        // TODO: BLUEY, POKEMON
    }
    constructor(domElements, domWrapperEl) {
        this.domElements = domElements;
        this.domWrapperEl = domWrapperEl;
        this.domWrapperEl.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'button') {
                resetBoard(true);

                curCategory = e.target.innerText.toLowerCase();
                this.category = curCategory;

                myAudio.volume = '0.2';
                myAudio.src = `assets/sounds/${this.category}.mp3`;

                categoryEl.forEach(e => e.classList.remove('focusCategory'));
                e.target.classList.toggle('focusCategory');

                initializeOptions(categoryItemEl, this.category);
                initializeOptions(matchingItemEl, this.category);
            }
        });
        this.render();
    }
    reset() {
        categoryEl.forEach(e => e.classList.remove('focusCategory'));
    }
    render() {
        let rgb;
        rgb = getRandomRgb();
        headerEl.style.textShadow = '0.5vmin 0.5vmin 0.5vmin ' + rgb;
        categoryWrapperEl.style.borderColor = rgb;
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
    randomize(array) {
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
    initialize() {
        const category = null;
        randomizedAlphabetsArr = null;
        this.domElements.forEach((e) => {
            e.innerHTML = '';
            myAudio.innerHTML = 'Your browser does not support the audio element.';
            e.style.pointerEvents = 'auto';
            e.removeEventListener('drop', handleDrop);
            e.removeEventListener('dragover', handleDragOver);
            e.removeEventListener('dragenter', handleDragEnter);
            e.removeEventListener('dragleave', handleDragLeave);
            e.removeEventListener('dragstart', handleDragStart);
            e.removeEventListener('dragend', handleDragEnd);
            e.removeEventListener('mousedown', handleMouseDown);
            e.removeAttribute('data-id');
        });
    }
    render() {
        let randomizedArr;
        let array;
        const category = this.category;
        
        if (category === "alphabets") {
            array = Array.from({length: 26}, (_, i) => i + 1);
            randomizedArr = this.randomize(array);
            if (randomizedAlphabetsArr === null) {
                randomizedAlphabetsArr = randomizedArr;
            }
        } else {
            array = Array.from({length: 9}, (_, i) => i + 1);
            randomizedArr = this.randomize(array);
        }

        matchingItemEl.forEach((e) => {
            e.addEventListener('drop', handleDrop);
            e.addEventListener('dragover', handleDragOver);
            e.addEventListener('dragenter', handleDragEnter);
            e.addEventListener('dragleave', handleDragLeave);
        });

        this.domElements.forEach((element, index) => {
            if (category !== undefined) {
                if (category === "alphabets") {
                    if (element.classList.contains('categoryItem')) {
                        element.innerHTML = `<img class="categoryItemImage" src="assets/images/${category}/${randomizedAlphabetsArr[index]}.png" draggable="true" id="${category}${randomizedAlphabetsArr[index]}" data-id="${randomizedAlphabetsArr[index]}">`;
                        
                    } else {
                        element.style.pointerEvents = 'auto';
                        element.innerHTML = `<div draggable="false" style="background-image: url('assets/images/${category}/${randomizedAlphabetsArr[index]}.png'); background-size:contain; opacity:0.2; height:100%; pointer-events:none; position:relative;"></div>`;
                    }
                    element.setAttribute('data-id', randomizedAlphabetsArr[index]);
                } else {
                    if (element.classList.contains('categoryItem')) {
                        element.innerHTML = `<img class="categoryItemImage" src="assets/images/${category}/${randomizedArr[index]}.png" draggable="true" id="${category}${randomizedArr[index]}" data-id="${randomizedArr[index]}">`;
                        
                    } else {
                        element.style.pointerEvents = 'auto';
                        element.innerHTML = `<div draggable="false" style="background-image: url('assets/images/${category}/${randomizedArr[index]}.png'); background-size:contain; opacity:0.2; height:100%; pointer-events:none; position:relative;"></div>`;
                    }
                    element.setAttribute('data-id', randomizedArr[index]);
                }
            } 
        });
    }
}

class MatchingGame {
    constructor(categoryItemsWrapperEl, matchingItemsWrapperEl) {
        this.categoryItemsWrapperEl = categoryItemsWrapperEl;
        this.matchingItemsWrapperEl = matchingItemsWrapperEl;
        this.categoryItemValue = null;
        this.matchingItemValue = null;
    }
    reset() {
        const categoryItemsArray = [...this.categoryItemsWrapperEl.children];
        categoryItemsArray.forEach(e => e.style.display = 'inline-block');
        const matchingItemsArray = [...this.matchingItemsWrapperEl.children];
        matchingItemsArray.forEach(e => e.classList.remove('focusMatchesCorrect', 'focusMatches'));
    }
}

function getRandomRgb(opacity = 1) {
    const num = Math.round(0xffffff * Math.random());
    const r = num >> 16;
    const g = num >> 8 & 255;
    const b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    this.classList.add('focusMatches');
}

function handleDragLeave(e) {
    this.classList.remove('focusMatches');
}
  
function handleDragStart(e) {
    draggedItemParent = document.getElementById(e.target.id).parentElement;
    this.style.opacity = '0.4';
    // e.dataTransfer.setData('text', e.target.id);
    draggedItemId = e.target.id;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
  }
  
function handleDrop(e) {
    e.preventDefault();
    // const data = e.dataTransfer.getData('text');
    const data = draggedItemId;
    let id = data.replace(/\D/g, '');

    if (e.target.getAttribute('data-id') === id) {
        e.target.appendChild(document.getElementById(data));
        e.target.classList.add('focusMatchesCorrect');
        draggedItemParent.style.display = 'none';
        this.style.pointerEvents = 'none';
        for (const child of this.children) {
            child.style.pointerEvents = 'none';
        }
        count++;
    } else {
        let oof = new Audio('/assets/sounds/oof.mp3');
        oof.volume = 0.2;
        oof.play();
        e.target.classList.add('focusMatchesWrong');
        setTimeout(() => { 
            e.target.classList.remove('focusMatchesWrong');
        }, 1000);
    }

    if (count === 9) {
        const winningMessage = ["YOU WIN!!", "YAY!!", "WOOHOO!", "YOU DID IT!", "GOOD JOB!"];
        // TODO: add clapping sound
        const random = Math.floor(Math.random() * winningMessage.length);
        messageEl.innerHTML = `<span id="winningMessage">${winningMessage[random]}</span>`;
        popupWrapperEl.style.display = 'block';
        setTimeout(() => {
            popupWrapperEl.style.display = 'none';
        }, 1500);

        let clapping = new Audio('/assets/sounds/clapping.mp3');
        clapping.volume = 0.2;
        clapping.play();
    }
}

function handleMouseDown(e) {
    window.getSelection().removeAllRanges();
}

initializeGame();

function initializeGame() {
    gameContainerWrapperEl.style.visibility = 'hidden';
    const categories = new Categories(categoryEl, categoryWrapperEl);
    game = new MatchingGame(categoryItemsWrapperEl, matchingItemsWrapperEl);
}

function resetCategories(buttons, domWrapperEl) {
    new Categories(buttons, domWrapperEl).reset();
}

function initializeOptions(buttons, category) {
    const options = new Options(buttons, category);
    if (category != null) {
        options;
        categoryItemImageEl = document.querySelectorAll('.categoryItemImage');
        categoryItemImageEl.forEach((e) => {
            e.addEventListener('dragstart', handleDragStart);
            e.addEventListener('dragend', handleDragEnd);
            e.addEventListener('mousedown', handleMouseDown);
        });
    } else {
        options.initialize();
    }
}

function resetBoard(introMessage) {
    gameContainerWrapperEl.style.visibility = 'visible';

    if(introMessage) {
        messageEl.innerHTML = '<span id="introMessage">Drag & Drop</span><br/><br/><img id="arrow" src="assets/images/arrow.png"">';
        popupWrapperEl.style.display = 'block';
        setTimeout(() => {
            popupWrapperEl.style.display = 'none';
        }, 1500);
    }

    count = 0;
    randomizedAlphabetsArr = null;
    // resetCategories(categoryEl, categoryWrapperEl);
    initializeOptions(categoryItemEl, curCategory);
    initializeOptions(matchingItemEl, curCategory);
    game.reset();
}