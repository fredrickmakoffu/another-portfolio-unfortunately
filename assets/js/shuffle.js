"use strict";
// Set effect velocity in ms
const velocity = 50;
document.addEventListener("DOMContentLoaded", function () {
    const shuffleElements = document.querySelectorAll(".shuffle");
    shuffleElements.forEach((item) => {
        item.dataset.text = item.textContent || "";
    });
    shuffleElements.forEach((element) => {
        element.addEventListener("mouseenter", function () {
            shuffleText(this, this.dataset.text || "");
        });
    });
    // call chooseRandomWord function every 5 seconds
    setInterval(chooseRandomWord, 4000);
});
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function shuffleText(element, originalText) {
    const elementTextArray = originalText.split("");
    const repeatShuffle = (times, index) => {
        if (index === times) {
            element.textContent = originalText;
            return;
        }
        setTimeout(() => {
            let randomText = shuffle([...elementTextArray]);
            for (let i = 0; i < index; i++) {
                randomText[i] = originalText[i];
            }
            element.textContent = randomText.join("");
            repeatShuffle(times, index + 1);
        }, velocity);
    };
    repeatShuffle(originalText.length, 0);
}
function chooseRandomWord() {
    const shuffleWordElements = document.querySelectorAll(".shuffle-words");
    shuffleWordElements.forEach((element) => {
        var _a, _b;
        let text = element.textContent || ""; // Get the text content
        const words = (_b = (_a = text.replace(/[^a-zA-Z0-9 ]/g, "")) === null || _a === void 0 ? void 0 : _a.split(" ")) === null || _b === void 0 ? void 0 : _b.filter((word) => word !== "" && word !== 'title' && word.length > 3 && word !== 'Solutech');
        const randomIndex = Math.floor(Math.random() * words.length);
        const randomWord = words[randomIndex];
        // generate random id for span element
        const randomId = Math.random().toString(36).substring(7);
        element.innerHTML = element.innerHTML.replace(randomWord, `<span id="${randomId}"  class="shuffle" style="color: #087E8B; font-family: 'Clash Grotesk'; background: #b4d8dc; padding: 1px 4px; border-radius: 3px;">${randomWord}</span>`);
        const randomWordElement = document.getElementById(randomId);
        if (!randomWordElement)
            return;
        shuffleText(randomWordElement, randomWordElement.textContent || "");
        setTimeout(() => {
            randomWordElement.outerHTML = randomWord;
        }, 2000);
    });
}
