console.log("Content script injected and running!");
// Add all the useless features here
let bulbVisible = false;
let pinContainerVisible = false;
let annoyingPopupVisible = false;

function showBulb() {
  const bulb = document.createElement('div');
  bulb.classList.add('bulb');
  bulb.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  bulb.style.top = Math.random() * (window.innerHeight - 50) + 'px';
  bulb.addEventListener('click', showPinContainer);
  document.body.appendChild(bulb);
  bulbVisible = true;
}

function showPinContainer() {
  const pinContainer = document.createElement('div');
  pinContainer.classList.add('pin-container');

  const pinInput = document.createElement('input');
  pinInput.classList.add('pin-input');
  pinInput.maxLength = 4;
  pinInput.readOnly = true;

  const eyeIcon = document.createElement('div');
  eyeIcon.classList.add('eye-icon');
  eyeIcon.textContent = '👁️';
  eyeIcon.addEventListener('click', togglePinVisibility);

  pinContainer.appendChild(pinInput);
  pinContainer.appendChild(eyeIcon);
  document.body.appendChild(pinContainer);

  let pin = Math.floor(1000 + Math.random() * 9000);
  let pinArray = pin.toString().split('');
  let shuffledPinArray = [...pinArray];

  function shufflePinArray() {
    for (let i = shuffledPinArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPinArray[i], shuffledPinArray[j]] = [shuffledPinArray[j], shuffledPinArray[i]];
    }
  }

  function updatePinInput() {
    pinInput.value = shuffledPinArray.join('');
  }

  function togglePinVisibility() {
    if (pinInput.type === 'text') {
      pinInput.type = 'password';
      eyeIcon.textContent = '👁️‍🗨️';
    } else {
      pinInput.type = 'text';
      eyeIcon.textContent = '👁️';
    }
  }

  setInterval(shufflePinArray, 1000);
  setInterval(updatePinInput, 100);

  pinContainerVisible = true;
}

function showConfetti() {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  confetti.style.left = Math.random() * window.innerWidth + 'px';
  confetti.style.top = '-10px';
  document.body.appendChild(confetti);
}

function showLoadingScreen() {
  const loadingScreen = document.createElement('div');
  loadingScreen.classList.add('loading-screen');

  const loadingSpinner = document.createElement('div');
  loadingSpinner.classList.add('loading-spinner');

  loadingScreen.appendChild(loadingSpinner);
  document.body.appendChild(loadingScreen);

  setTimeout(() => {
    loadingScreen.style.display = 'none';
  }, Math.random() * 10000 + 5000);
}

function showAnnoyingPopup() {
  const annoyingPopup = document.createElement('div');
  annoyingPopup.classList.add('annoying-popup');

  const popupTitle = document.createElement('h2');
  popupTitle.textContent = "You've been chosen!";

  const popupText = document.createElement('p');
  popupText.textContent = "Congratulations, you've been selected to participate in our exclusive survey!";

  const closeButton = document.createElement('button');
  closeButton.textContent = "Close";
  closeButton.addEventListener('click', () => {
    annoyingPopup.style.display = 'none';
    annoyingPopupVisible = false;
  });

  annoyingPopup.appendChild(popupTitle);
  annoyingPopup.appendChild(popupText);
  annoyingPopup.appendChild(closeButton);
  document.body.appendChild(annoyingPopup);

  annoyingPopupVisible = true;
}

function playAnnoyingMusic() {
  const backgroundMusic = document.createElement('div');
  backgroundMusic.classList.add('background-music');

  const audioElement = document.createElement('audio');
  audioElement.setAttribute('src', 'annoying-music.mp3');
  audioElement.setAttribute('controls', '');
  audioElement.setAttribute('loop', '');

  backgroundMusic.appendChild(audioElement);
  document.body.appendChild(backgroundMusic);
}

setInterval(showBulb, 2000);
setInterval(showConfetti, 100);
setInterval(showAnnoyingPopup, 30000);
playAnnoyingMusic();
