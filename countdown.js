// Variables - global scope
let countdownActive = false;
let countdown;
const now = new Date();

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

const validateQuery = () => {
  return new Promise((resolve, reject) => {
    if (ezQuery().hasOwnProperty("t")) {
      try {
        // Test query is integer
        let _qInt = parseInt(exQuery().t);
        // Is query in the future?
        const now = new Date().getTime();
        if (ezQuery().t - now > 0) {
          // Time is valid and in the future - resolve with timestamp
          countdownActive = true;
          resolve({targetDate: ezQuery().t})
        } else {
          // Time is valid but is in the past - resolve with zero
          resolve({targetDate: 0})
        }
      } catch(e) {
        // Error - Reject
        countdownActive = false;
        reject(null)
      }
    } else {
      countdownActive = false;
      reject(null);
    }
  })
}

// Assemble time object from MS
const timeFromMS = (ms) => {
  try {
    let years = Math.floor(ms / cdData.years.ms);
    let yearsRem = ms % cdData.years.ms;
    let months = Math.floor(yearsRem / cdData.months.ms);
    let monthsRem = yearsRem % cdData.months.ms;
    let weeks = Math.floor(monthsRem / cdData.weeks.ms);
    let weeksRem = monthsRem % cdData.weeks.ms;
    let days = Math.floor(weeksRem / cdData.days.ms);
    let daysRem = weeksRem % cdData.days.ms;
    let hours = Math.floor(daysRem / cdData.hours.ms);
    let hoursRem = daysRem % cdData.hours.ms;
    let mins = Math.floor(hoursRem / cdData.mins.ms);
    let minsRem = hoursRem % cdData.mins.ms;
    let secs = Math.floor(minsRem / cdData.secs.ms);
    return { years, months, weeks, days, hours, mins, secs };
  } catch (e) {
    console.error(e);
  }
};

// Form values - defaults to 1 year in the future
let formValues = {
  year: now.getFullYear() + 1,
  month: now.getMonth() + 1,
  day: now.getDate(),
  hour: now.getHours(),
  min: now.getMinutes()
}

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

// Define page elements
const floatingActionButton = document.getElementById("floating-action-button");
const formContainer = document.getElementById("cd-form-container");
const form = document.getElementById("cd-form");
const formDate = document.getElementById("cd-form-date");
const formTime = document.getElementById("cd-form-time");
const formFeedback = document.getElementById("cd-form-feedback");
const endSect = document.getElementById("cd-sect-end");
const endText = document.getElementById("cd-num-end");
const endLab = document.getElementById("cd-lab-end");
const debugLink = document.getElementById("debug-link-cd");
const cdSectTitle = document.getElementById("cd-sect-title");
const footer = document.getElementById("footer");

// Assign DOM elements to cdData
const initCdData = () => {
  keys.forEach((key) => {
    cdData[key].sect = document.getElementById(`cd-sect-${key}`);
    cdData[key].num = document.getElementById(`cd-num-${key}`);
    cdData[key].lab = document.getElementById(`cd-lab-${key}`);
  });
};

// Set form input 'min' attributes
formDate.setAttribute("min", `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`)
// formTime.setAttribute("min", `${now.getHours()}:${now.getMinutes()}`)

// Change handler for form inputs - store to varaibles
const updateFormValues = () => {
  try {
    const [year, month, day] = formDate.value.split("-");
    const [hour, min] = formTime.value.split(":");
    formValues = { year: year || formValues.year, month: month || formValues.month, day: day || formValues.day, hour: hour || formValues.hour, min: min || formValues.min };
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
  // Prevent default form behaviour
  e.preventDefault();
  // Form validation
  validateForm()
  .then((res) => {
    console.log(res)
    formFeedback.style.display = "none";
    window.location.assign(`?t=${res.targetDate}`)
  }).catch((res) => {
    console.warn(res)
    formFeedback.innerText = res.error;
    formFeedback.style.display = "initial";
  });
}

const updateCountdown = () => {
  // Define variables
  const now = new Date();
  let timeOffset = ezQuery().t - now.getTime();
  const time = timeFromMS(timeOffset);
  // Update countdown clock
  keys.forEach(key => {
    try {
      if (time[key] || timeOffset > cdData[key]["ms"]) {
        cdData[key]["sect"]["style"]["display"] = "initial";
        cdData[key]["num"]["innerText"] = time[key];
        if (time[key] !== 1) cdData[key]["lab"]["innerText"] = cdData[key]["plur"];
        else cdData[key]["lab"]["innerText"] = cdData[key]["sing"];
      } else {
        cdData[key]["sect"]["style"]["display"] = "none";
      } 
    } catch {
      return;
    }
  })
  // Update ending text if necessary
  if (timeOffset <= 1000) endSect.style.display = "initial";
  else endSect.style.display = "none";
};

const endCountdown = () => {
  // Cancel countdown tick
  countdown = null;
  // Hide countdown numbers
  keys.forEach(key => {
    try {
        cdData[key]["sect"]["style"]["display"] = "none";
    } catch {
      return;
    }
  })
  // Show end text
    endSect.style.display = "initial";
}

const handleToggleForm = (e) => {
  if (formContainer.classList.contains("toggle-on")) {
    footer.style.padding = "0";
    formContainer.style.height = "0";
    formContainer.classList.remove("toggle-on")
    // floatingActionButton.innerText = "+"
  }
  else {
    footer.style.padding = "1rem";
    formContainer.style.height = "unset";
    formContainer.classList.add("toggle-on")
    // floatingActionButton.innerText = "-"
  }
}

// On window load
document.addEventListener("DOMContentLoaded", () => {
    // Debug
    debugLink.href = `/?t=${now.getTime() + 86400000}`;

    // Assign variables to countdown object
    initCdData();

    // Add listeners
    floatingActionButton.addEventListener("click", handleToggleForm);
    formDate.addEventListener("change", updateFormValues);
    formTime.addEventListener("change", updateFormValues);
    form.addEventListener("submit", handleFormSubmit);

    // Define VH units
    updateViewport();

    // Display countdown
    updateCountdown();

    // Start countdown tick, show/hide title if necessary
    if (ezQuery().hasOwnProperty("t")) {
      // Show/hide title if necessary
      cdSectTitle.style.display = "none"
      countdown = setInterval(() => {
        const now = new Date();
        let timeOffset = ezQuery().t - now.getTime();
        if (timeOffset > 0) updateCountdown();
        else endCountdown();
    }, 1000);
    } else {
      cdSectTitle.style.display = "initial"
    }
    
});






