// Set effect velocity in ms
const velocity: number = 50;

document.addEventListener("DOMContentLoaded", function () {  
  const shuffleElements: NodeListOf<HTMLElement> = document.querySelectorAll(".shuffle");

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

function shuffle (arr: string[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleText (element: HTMLElement, originalText: string) {
  const elementTextArray: string[] = originalText.split("");

  const repeatShuffle = (times: number, index: number): void => {
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
    const shuffleWordElements: NodeListOf<HTMLElement> = document.querySelectorAll(".shuffle-words");

    shuffleWordElements.forEach((element) => {
      let text: string = element.textContent || ""; // Get the text content
      const words: string[] = text.replace(/[^a-zA-Z0-9 ]/g, "")
        ?.split(" ")
        ?.filter((word) => word !== "" && word !== 'title' && word.length > 3 && word !== 'Solutech');

      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];

      // generate random id for span element
      const randomId = Math.random().toString(36).substring(7);

      element.innerHTML = element.innerHTML.replace(randomWord, `<span id="${randomId}"  class="shuffle" style="color: #087E8B; font-family: 'Clash Grotesk'; background: #b4d8dc; padding: 1px 4px; border-radius: 3px;">${randomWord}</span>`);
      const randomWordElement = document.getElementById(randomId);

      if(!randomWordElement) return;

      shuffleText(randomWordElement, randomWordElement.textContent || "");

        setTimeout(() => {
          randomWordElement.outerHTML = randomWord;
        }, 2000);
    });
}