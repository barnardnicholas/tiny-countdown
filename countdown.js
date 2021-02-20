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

// Assemble time object from MS
const timeFromMS = (ms) => {
  try {
    let weeks = Math.floor(ms / cdData.weeks.ms);
    let weeksRem = ms % cdData.weeks.ms;
    let days = Math.floor(weeksRem / cdData.days.ms);
    let daysRem = weeksRem % cdData.days.ms;
    let hours = Math.floor(daysRem / cdData.hours.ms);
    let hoursRem = daysRem % cdData.hours.ms;
    let mins = Math.floor(hoursRem / cdData.mins.ms);
    let minsRem = hoursRem % cdData.mins.ms;
    let secs = Math.floor(minsRem / cdData.secs.ms);
    return { weeks, days, hours, mins, secs };
  } catch (e) {
    console.error(e);
  }
};

// Define now
const now = new Date();

// Data for DOM Elements
const cdData = {
  years: {
    sect: null,
    num: null,
    lab: null,
    ms: 31557600000,
    sing: "year",
    plur: "years"
  },
  months: {
    sect: null,
    num: null,
    lab: null,
    ms: 2592000000,
    sing: "month",
    plur: "months"
  },
  weeks: {
    sect: null,
    num: null,
    lab: null,
    ms: 604800000,
    sing: "week",
    plur: "weeks"
  },
  days: {
    sect: null,
    num: null,
    lab: null,
    ms: 86400000,
    sing: "day",
    plur: "days"
  },
  hours: {
    sect: null,
    num: null,
    lab: null,
    ms: 3600000,
    sing: "hour",
    plur: "hours"
  },
  mins: {
    sect: null,
    num: null,
    lab: null,
    ms: 60000,
    sing: "minute",
    plur: "minutes"
  },
  secs: {
    sect: null,
    num: null,
    lab: null,
    ms: 1000,
    sing: "second",
    plur: "seconds"
  },
};

// cdData keys for iteration
const keys = Object.keys(cdData) || [];

// Form input elements
const form = document.getElementById("cd-form");
const formDate = document.getElementById("cd-form-date");
const formTime = document.getElementById("cd-form-time");

// Form values - defaults to 1 year in the future
let formValues = {
  year: now.getFullYear() + 1,
  month: now.getMonth() + 1,
  day: now.getDate(),
  hour: now.getHours(),
  min: now.getMinutes()
}

// Set form input 'min' attributes
formDate.setAttribute("min", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`)
// formTime.setAttribute("min", `${now.getHours()}:${now.getMinutes()}`)

// Change handler for form inputs - store to varaibles
const updateFormValues = (e) => {
  console.log(e);
  try {
    const [year, month, day] = formDate.value.split("-");
    const [hour, min] = formTime.value.split(":");
    formValues = { year: year || formValues.year, month: month || formValues.month, day: day || formValues.day, hour: hour || formValues.hour, min: min || formValues.min };
    console.log(formValues)
  } catch(err) {
    console.error(err);
  }
};

const validateForm = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!formDate.value || !formTime.value) reject({error: "All fields must be filled out."})
      const { year, month, day, hour, min } = formValues;
      const targetDate = new Date(year, month - 1, day, hour, min).getTime();
      const rightNow = new Date().getTime();
      if (targetDate - rightNow <= 0) reject({error: "Target date must be in the future."})
      else resolve({targetDate})
    } catch(e) {
      console.error(e)
      reject({error: e})
    }
  })
}

const handleFormSubmit = (e) => {
  e.preventDefault();
  validateForm()
  .then((res) => {
    console.log(res)
    window.location.assign(`?t=${res.targetDate}`)
  }).catch((res) => {
    console.log(res)
  });
}

// Assign DOM elements to cdData
const initCdData = () => {
  keys.forEach((key) => {
    cdData[key].sect = document.getElementById(`cd-sect-${key}`);
    cdData[key].num = document.getElementById(`cd-num-${key}`);
    cdData[key].lab = document.getElementById(`cd-lab-${key}`);
  });
};

const updateCountdown = () => {
  const now = new Date();
  let timeOffset = ezQuery().t - now.getTime();
  const time = timeFromMS(timeOffset);

  keys.forEach(key => {
    try {
      if (time[key] || timeOffset > cdData[key]["ms"]) {
        cdData[key]["sect"]["style"]["display"] = "initial";
        cdData[key]["num"]["innerText"] = time[key];
        if (time[key] > 1) cdData[key]["lab"]["innerText"] = cdData[key]["plur"];
        else cdData[key]["lab"]["innerText"] = cdData[key]["sing"];
      } else {
        cdData[key]["sect"]["style"]["display"] = "none";
      } 
    } catch {
      return;
    }
  })
};

const handleToggleForm = (e) => {
  if (formContainer.classList.contains("toggle-on")) {
    formContainer.style.height = "0";
    formContainer.classList.remove("toggle-on")
    floatingActionButton.innerText = "+"
  }
  else {
    formContainer.style.height = "unset"; 
    formContainer.classList.add("toggle-on")
    floatingActionButton.innerText = "-"
  }
}

initCdData();

// MS UTC
// console.log(now.getTime());
// console.log(new Date(now.getTime()));
// console.log(now.toLocaleTimeString());

// Timezone offset in minutes
// console.log(now.getTimezoneOffset());

// On window load
document.onLoad = (e) => {};

const testTime = now.getTime() + 86400000;
// console.log(`Test time (MS): ${testTime}`);
const transTestTime = timeFromMS(testTime);
// console.log(`Translated:`);
// console.dir(transTestTime);

const debugLink = document.getElementById("debug-link-cd");
debugLink.href = `/?t=${now.getTime() + 86400000}`


let timeOffset = ezQuery().t - now.getTime();

updateViewport();

const formContainer = document.getElementById("cd-form-container");
const floatingActionButton = document.getElementById("floating-action-button");
floatingActionButton.addEventListener("click", handleToggleForm);

formDate.addEventListener("change", updateFormValues);
formTime.addEventListener("change", updateFormValues);
form.addEventListener("submit", handleFormSubmit)


updateCountdown();

setInterval(() => {
  updateCountdown();
}, 1000);
