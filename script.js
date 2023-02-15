const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');
const popup = document.getElementById('popup-container');
const popupBox = document.querySelector('.popup');
const notifications = document.getElementById('notification-container');
const finalMessage = document.getElementById('final-message');
const figureParts = document.querySelectorAll('.figure-parts');

let correctLetters = [];
let wrongLetters = [];

async function getWord() {
  const wordData = await fetch('https://random-word-api.herokuapp.com/word');
  const parsedWordData = await wordData.json();
  return parsedWordData[0];
}

function pullWord() {
  getWord().then((res) => {
    for (let char of res) {
      let letter = document.createElement('span');
      letter.classList.add('letter');
      letter.classList.add('hidden-letter');
      setTimeout(() => letter.classList.add('letter-border'), 10);
      letter.textContent = char;
      wordEl.appendChild(letter);
    }
    console.log(res);
  });
}

pullWord();

window.addEventListener('keydown', (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90 && !e.metaKey) {
    checkCorrect(e.key);
    checkComplete();
  }
  if (e.key == 'Enter' && finalMessage.textContent != '') {
    location.reload();
  }
});

function checkCorrect(letter) {
  let letterStatus = false;
  //   Searching to see if the entered letter is in the word
  for (let char of [...wordEl.children]) {
    if (char.textContent == letter) {
      console.log('letter match');
      char.classList.remove('hidden-letter');
      correctLetters.push(letter);
      letterStatus = true;
    }
  }

  //   Checking letterStatus to see if a letter was found in the word
  //   if the letter was not found, adding it to the list of incorrect letters
  if (!letterStatus && !wrongLetters.includes(letter)) {
    wrongLetters.push(letter);
    let wrongLet = document.createElement('p');
    wrongLet.textContent = letter;
    wrongLettersEl.firstElementChild.appendChild(wrongLet);
    document
      .querySelectorAll('.figure-part')[0]
      .classList.remove('figure-part');
  } else if (wrongLetters.includes(letter)) {
    notifications.classList.toggle('show');
    setTimeout(() => {
      notifications.classList.toggle('show');
    }, 1000);
  }

  checkLost(document.querySelectorAll('.figure-part').length);
}

//   Checking if all of the hangman parts are displayed to see if the player has lost
function checkLost(length) {
  if (length == 0) {
    console.log('you lost!');
    showFinalMessage('You Lost 😢');
  }
}

// Checking if the word is complete by cycling through the letter elements to see if
// none of them still have the hidden-letter class. If none of them have that class,
// then the word is complete.
function checkComplete() {
  for (let char of [...wordEl.children]) {
    if (char.classList.contains('hidden-letter')) {
      return false;
    }
  }
  showFinalMessage('You Won! 😎');
}

function showFinalMessage(status) {
  setTimeout(() => (popupBox.style.opacity = '1'), 100);
  finalMessage.textContent = status;
  popup.style.display = 'flex';
}

playAgainBtn.addEventListener('click', (e) => {
  console.log('I would like to play again!');
  location.reload();
  //   pullWord();
});
