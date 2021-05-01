// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
const img_input = document.getElementById('image-input');
const top = document.getElementById('text-top');
const bottom = document.getElementById('text-bottom');
const volume = document.getElementsByTagName("img")[0];
const slider = document.querySelector("input[type='range']");
const voice_sel = document.getElementById('voice-selection')
var voices = [];
voices = speechSynthesis.getVoices();

//buttons
const buttons = document.getElementById('button-group');
const generate = document.querySelector("button[type='submit']");
const clear = document.querySelector("button[type='reset']");
const read = document.querySelector("button[type='button']");

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  //toggle relevant buttons
  generate.disabled = false;
  clear.disabled = true;
  read.disabled = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
});

img_input.addEventListener('change', (event) => {
  const imgURL = URL.createObjectURL(img_input.files[0]);
  img.src = imgURL;
  img.alt = img_input.files[0].name;
});

generate.addEventListener('click', (event) => {
  //toggle buttons
  generate.disabled = true;
  clear.disabled = false;
  read.disabled = false;

  ctx.strokeStyle = 'black';
  ctx.fillStyle = 'white';
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'center';
  ctx.strokeText(top.value, canvas.width/2, 50);
  ctx.fillText(top.value, canvas.width/2, 50);
  ctx.strokeText(bottom.value, canvas.width/2, canvas.height - 20);
  ctx.fillText(bottom.value, canvas.width/2, canvas.height - 20);
  event.preventDefault();
});

clear.addEventListener('click', (event) => {
  //toggle buttons
  generate.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

});

slider.addEventListener('input', value => {
  if(Number(slider.value) == 0){volume.src = "icons/volume-level-0.svg"};
  if(Number(slider.value) > 0 && Number(slider.value) < 34){volume.src = "icons/volume-level-1.svg"};
  if(Number(slider.value) > 33 && Number(slider.value) < 67){volume.src = "icons/volume-level-2.svg"};
  if(Number(slider.value) > 66 && Number(slider.value) < 101){volume.src = "icons/volume-level-3.svg"};

});

setTimeout(populateVoiceList, 100);
//Grabbed from Mozilla SpeechSynthesis
function populateVoiceList() {
  voices = speechSynthesis.getVoices();
  voice_sel.remove(0);
  for (var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById('voice-selection').appendChild(option);
  } 

  voice_sel.disabled = false;

}

read.addEventListener('click', (event) => {
  let speechTop = new SpeechSynthesisUtterance(top.value);
  let speechBottom = new SpeechSynthesisUtterance(bottom.value);
  speechTop.volume = slider.value * 0.01;
  speechBottom.volume = slider.value * 0.01;
  var selectedSpeech = voice_sel.selectedOptions[0].getAttribute('data-name');
  for (var i = 0; i < voices.length; i++) {
    if (voices[i].name == selectedSpeech) {
      speechTop.voice = voices[i];
      speechBottom.voice = voices[i];
    }
  }
  speechSynthesis.speak(speechTop);
  speechSynthesis.speak(speechBottom);
});


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
