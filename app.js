const clock = document.getElementById("clock");
const totalTimeInput = document.getElementById("totalTime");
const yellowTimeInput = document.getElementById("yellowTime");
const redTimeInput = document.getElementById("redTime");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const resetButton = document.getElementById("reset");

let countdown;
let remainingTime;

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
    clock.style.color = remainingTime % 2 === 0 ? "red" : "orange";
    // clock.style.color =
    //   Math.floor(remainingTime * 2) % 2 === 0 ? "red" : "white";
  } else if (remainingTime <= parseTime(yellowTimeInput.value)) {
    clock.style.color = "yellow";
  } else {
    clock.style.color = "green";
  }
}

startButton.addEventListener("click", startCountdown);
stopButton.addEventListener("click", stopCountdown);
resetButton.addEventListener("click", resetCountdown);

resetCountdown();
