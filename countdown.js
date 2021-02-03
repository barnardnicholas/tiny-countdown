// Define VH Unit correctly (mobile bug)
const updateViewport = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

const cdYears = document.getElementById("cd-num-years");
const cdMonths = document.getElementById("cd-num-months");
const cdWeeks = document.getElementById("cd-num-weeks");
const cdDays = document.getElementById("cd-num-days");
const cdHours = document.getElementById("cd-num-hours");
const cdMins = document.getElementById("cd-num-mins");
const cdSecs = document.getElementById("cd-num-secs");
// const timeElements = [cdYears, cdMonths, cdWeeks, cdDays, cdHours, cdMinutes, cdSecs];

const updateCountdown = (dateMS) => {
  const dateToShow = new Date(dateMS);
  const years = dateToShow.getYear() || "00";
  const months = dateToShow.getMonth() + 1 || "00";
  const weeks = "00";
  const days = dateToShow.getDay() || "00";
  const hours = dateToShow.getHours() || "00";
  const mins = dateToShow.getMinutes() || "00";
  const secs = dateToShow.getSeconds() || "00";

  console.log(years);
  cdYears.innerText = years;
  cdMonths.innerText = months;
  cdWeeks.innerText = weeks;
  cdDays.innerText = days;
  cdHours.innerText = hours;
  cdMins.innerText = mins;
  cdSecs.innerText = secs;
};

const now = new Date();
// MS UTC
console.log(now.getTime());
console.log(new Date(now.getTime()));
console.log(now.toLocaleTimeString());

// Timezone offset in minutes
console.log(now.getTimezoneOffset());

// On window load
window.onLoad = (event) => {};

updateViewport();
updateCountdown(now.getTime());
