"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const colors = ['#119DA4', '#c8d5bb', '#47585c', '#c8d5bb', '#119DA4'];
const animation_on = true;
function colorRandomLetters(id) {
    var _a;
    // get random letter between 1 - 9
    const rand = Math.floor(Math.random() * 5) + 1;
    // get the banner ids inside element
    const text = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.innerHTML;
    if (!text)
        return;
    // color one random letter in the banner
    const randomLetter = Math.floor(Math.random() * 12);
    // get the random letter
    const letter = text.charAt(randomLetter);
    // get one color from arrays color
    const color = colors[Math.floor(Math.random() * colors.length)];
    // replace the random letter with a span with the letter
    const newText = text.replace(letter, `<span style="color: ${color}">${letter}</span>`);
    // set the new text
    const bannerElement = document.getElementById('banner__' + rand);
    if (bannerElement) {
        bannerElement.innerHTML = newText;
        // reset the banner
        setTimeout(() => {
            bannerElement.innerHTML = text;
        }, 1500);
    }
    setTimeout(() => {
        if (!animation_on)
            colorRandomLetters(id);
    }, 2000);
}
function setBanners(i) {
    return __awaiter(this, void 0, void 0, function* () {
        const intervalId = setInterval(function () {
            const banner = document.getElementById(`banner__${i}`);
            if (banner == null)
                return;
            if (i % 2 === 0) {
                banner.classList.add("animate-scroll-right");
            }
            else {
                banner.classList.add("animate-scroll-left");
            }
            i++;
            if (i > 10) {
                clearInterval(intervalId); // Stop the interval when all banners are animated
            }
        }, 300);
    });
}
window.onload = function () {
    for (let i = 1; i <= 5; i++) {
        setBanners(i);
    }
    colorRandomLetters('banner');
};
