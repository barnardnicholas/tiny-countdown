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

// Queries
const ezQuery = () => {
  // Get URL query
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);

  // Utils
  // Convert to integer if necessary
  const detectInteger = (item) => {
    if (Number.isInteger(parseInt(item))) return parseInt(item);
    else return item;
  };

  // Assemble Query Object
  const queryObj = {};
  for (let pair of urlParams.entries()) {
    const key = pair[0];
    let value = pair[1];
    if (value.split(",").length > 1) {
      value = value.split(",").map(detectInteger);
    } else {
      value = detectInteger(value);
    }
    queryObj[key] = value;
  }
  return queryObj;
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

// const cdSectYears = document.getElementById("cd-sect-years");
// const cdSectMonths = document.getElementById("cd-sect-months");
const cdSectWeeks = document.getElementById("cd-sect-weeks");
const cdSectDays = document.getElementById("cd-sect-days");
const cdSectHours = document.getElementById("cd-sect-hours");
const cdSectMins = document.getElementById("cd-sect-mins");
const cdSectSecs = document.getElementById("cd-sect-secs");

// const cdYears = document.getElementById("cd-num-years");
// const cdMonths = document.getElementById("cd-num-months");
const cdWeeks = document.getElementById("cd-num-weeks");
const cdDays = document.getElementById("cd-num-days");
const cdHours = document.getElementById("cd-num-hours");
const cdMins = document.getElementById("cd-num-mins");
const cdSecs = document.getElementById("cd-num-secs");

// const cdLabYears = document.getElementById("cd-lab-years");
// const cdSectMonths = document.getElementById("cd-lab-months");
const cdLabWeeks = document.getElementById("cd-lab-weeks");
const cdLabDays = document.getElementById("cd-lab-days");
const cdLabHours = document.getElementById("cd-lab-hours");
const cdLabMins = document.getElementById("cd-lab-mins");
const cdLabSecs = document.getElementById("cd-lab-secs");

const updateCountdown = () => {
  const now = new Date();
  let timeOffset = ezQuery().t - now.getTime();
  const time = timeFromMS(timeOffset);
  // const years = dateToShow.getYear() || "00";
  // const months = dateToShow.getMonth() + 1 || "00";
  const weeks = time.weeks || 0;
  const days = time.days || 0;
  const hours = time.hours || 0;
  const mins = time.mins || 0;
  const secs = time.secs || 0;

  if (weeks || timeOffset > msVals.week) {
    cdSectWeeks.style.display = "initial";
    cdWeeks.innerText = weeks;
    if (weeks > 1) cdLabWeeks.innerText = "weeks";
    else cdLabWeeks.innerText = "week";
  } else {
    cdSectWeeks.style.display = "none";
  }

  if (days || timeOffset > msVals.day) {
    cdSectDays.style.display = "initial";
    cdDays.innerText = days;
    if (days > 1) cdLabDays.innerText = "days";
    else cdLabDays.innerText = "day";
  } else {
    cdSectDays.style.display = "none";
  }

  if (hours || timeOffset > msVals.hour) {
    cdSectHours.style.display = "initial";
    cdHours.innerText = hours;
    if (hours > 1) cdLabHours.innerText = "hours";
    else cdLabHours.innerText = "hour";
  } else {
    cdSectHours.style.display = "none";
  }

  if (mins || timeOffset > msVals.min) {
    cdSectMins.style.display = "initial";
    cdMins.innerText = mins;
    if (mins > 1) cdLabMins.innerText = "minutes";
    else cdLabMins.innerText = "minute";
  } else {
    cdSectMins.style.display = "none";
  }

  if (secs || timeOffset > msVals.sec) {
    cdSectSecs.style.display = "initial";
    cdSecs.innerText = secs;
    if (secs > 1) cdLabSecs.innerText = "seconds";
    else cdLabSecs.innerText = "second";
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

const testTime = 1612377349733 + 86400000;
console.log(`Test time (MS): ${testTime}`);
const transTestTime = timeFromMS(testTime);
console.log(`Translated:`);
console.dir(transTestTime);

let timeOffset = ezQuery().t - now.getTime();

updateViewport();

updateCountdown();
setInterval(() => {
  updateCountdown();
}, 1000);
