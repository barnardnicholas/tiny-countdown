// Values LUT
const msVals = {
  // year: 0,
  // month: 0,
  week: 604800000,
  day: 86400000,
  hour: 3600000,
  min: 60000,
  sec: 1000,
};

// Define VH Unit correctly (mobile bug)
const updateViewport = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

const timeFromMS = (ms) => {
  try {
    let weeks = Math.floor(ms / msVals.week);
    let weeksRem = ms % msVals.week;
    let days = Math.floor(weeksRem / msVals.day);
    let daysRem = weeksRem % msVals.day;
    let hours = Math.floor(daysRem / msVals.hour);
    let hoursRem = daysRem % msVals.hour;
    let mins = Math.floor(hoursRem / msVals.min);
    let minsRem = hoursRem % msVals.min;
    let secs = Math.floor(minsRem / msVals.sec);
    return { weeks, days, hours, mins, secs };
  } catch (e) {
    console.error(e);
  }
};

// const cdYears = document.getElementById("cd-num-years");
// const cdMonths = document.getElementById("cd-num-months");
const cdWeeks = document.getElementById("cd-num-weeks");
const cdDays = document.getElementById("cd-num-days");
const cdHours = document.getElementById("cd-num-hours");
const cdMins = document.getElementById("cd-num-mins");
const cdSecs = document.getElementById("cd-num-secs");

// const cdSectYears = document.getElementById("cd-sect-years");
// const cdSectMonths = document.getElementById("cd-sect-months");
const cdSectWeeks = document.getElementById("cd-sect-weeks");
const cdSectDays = document.getElementById("cd-sect-days");
const cdSectHours = document.getElementById("cd-sect-hours");
const cdSectMins = document.getElementById("cd-sect-mins");
const cdSectSecs = document.getElementById("cd-sect-secs");

const testTime = 1612377349733 + 86400000;
console.log(`Test time (MS): ${testTime}`);
const transTestTime = timeFromMS(testTime);
console.log(`Translated:`);
console.dir(transTestTime);

const updateCountdown = (ms) => {
  const time = timeFromMS(ms);
  // const years = dateToShow.getYear() || "00";
  // const months = dateToShow.getMonth() + 1 || "00";
  const weeks = time.weeks || 0;
  const days = time.days || 0;
  const hours = time.hours || 0;
  const mins = time.mins || 0;
  const secs = time.secs || 0;

  if (weeks || ms > msVals.week) {
    cdSectWeeks.style.display = "initial";
    cdWeeks.innerText = weeks;
  } else {
    cdSectWeeks.style.display = "none";
  }

  if (days || ms > msVals.day) {
    cdSectDays.style.display = "initial";
    cdDays.innerText = days;
  } else {
    cdSectDays.style.display = "none";
  }

  if (hours || ms > msVals.hour) {
    cdSectHours.style.display = "initial";
    cdHours.innerText = hours;
  } else {
    cdSectHours.style.display = "none";
  }

  if (mins || ms > msVals.min) {
    cdSectMins.style.display = "initial";
    cdMins.innerText = mins;
  } else {
    cdSectMins.style.display = "none";
  }

  if (secs || ms > msVals.sec) {
    cdSectSecs.style.display = "initial";
    cdSecs.innerText = secs;
  } else {
    cdSectSecs.style.display = "none";
  }

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
updateCountdown(msVals.day * 8);
