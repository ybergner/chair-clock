const clock = document.getElementById("clock");
const totalTimeInput = document.getElementById("totalTime");
const yellowTimeInput = document.getElementById("yellowTime");
const redTimeInput = document.getElementById("redTime");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

let countdown;
let remainingTime;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(
      (registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      },
      (error) => {
        console.log("Service Worker registration failed:", error);
      }
    );
  });
}

function hideFullScreenButtonIfIOSPWA() {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isInStandaloneMode =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && window.navigator.standalone);

  if (isIOS && isInStandaloneMode) {
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    if (fullscreenBtn) {
      fullscreenBtn.style.display = "none";
    }
  }
}

hideFullScreenButtonIfIOSPWA();

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateClock() {
  clock.textContent = formatTime(remainingTime);
}

function startCountdown() {
  clearInterval(countdown);
  countdown = setInterval(() => {
    remainingTime--;
    updateClock();
    updateClockColor();
    if (remainingTime < 0) {
      clearInterval(countdown);
      countdown = setInterval(updateClockColor, 250); // Move this line
    }
  }, 1000);
}

function stopCountdown() {
  clearInterval(countdown);
}

function parseTime(input) {
  const [minutes, seconds] = input.split(":").map(Number);
  return minutes * 60 + seconds;
}

function resetCountdown() {
  stopCountdown();
  remainingTime = parseTime(totalTimeInput.value); // Update this line
  updateClock();
  updateClockColor();
}

function updateClockColor() {
  if (remainingTime <= 0) {
    clock.style.color = clock.style.color === "red" ? "black" : "red";
  } else if (remainingTime <= parseTime(redTimeInput.value)) {
    clock.style.color = remainingTime % 2 === 0 ? "red" : "white";
  } else if (remainingTime <= parseTime(yellowTimeInput.value)) {
    clock.style.color = "yellow";
  } else {
    clock.style.color = "green";
  }
}

function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

startButton.addEventListener("click", startCountdown);
stopButton.addEventListener("click", stopCountdown);
resetButton.addEventListener("click", resetCountdown);

resetCountdown();
