// OBJECT FOR THE DAY AND MONTH ARRAYS

const arrays = {
  months: [
    `January`,
    `February`,
    `March`,
    `April`,
    `May`,
    `June`,
    `July`,
    `August`,
    `September`,
    `October`,
    `November`,
    `December`,
  ],
  days: [
    `Sunday`,
    `Monday`,
    `Tuesday`,
    `Wednesday`,
    `Thursday`,
    `Friday`,
    `Saturday`,
  ],
};

// BLUEPRINT CLASS FOR CREATING CONTAINER OBJECTS FOR THE REMINDERS FOR EACH DATE

class containerBlueprint {
  constructor(dateString, dateObj) {
    this.dateString = dateString;
    this.reminder = [];
    this.dateObj = dateObj;
  }
}

// GENERATE THE DATE OBJECT THAT WILL BE USED FOR WHATEVER

const generateDateObj = (current) => {
  const date = current.getDate();

  let day = current.getDay();
  day = arrays.days[day];

  let month = current.getMonth();
  month = arrays.months[month];

  const year = current.getFullYear();

  const dateObj = {
    date: date,
    day: day,
    month: month,
    year: year,
  };

  return dateObj;
};

// DELETES REMINDERS OF PAST DATES FROM THE LOCAL STORAGE

const deletePastReminders = (dateObj) => {
  console.log(dateObj);

  let entire = localStorage.getItem(`DevDylanReminder`);
  entire = JSON.parse(entire);
  console.log(entire);

  if (entire) {
    let i = 0;
    for (; i < entire.length; i++) {
      const selected = entire[i];
      const selectedDateObj = selected.dateObj;

      const presentDateObj = new Date();

      if (presentDateObj.year >= selectedDateObj.year) {
        const presentMonthIndex = arrays.months.indexOf(presentDateObj.month);
        const selectedMonthIndex = arrays.months.indexOf(selectedDateObj.month);

        if (presentMonthIndex >= selectedMonthIndex) {
          if (presentDateObj.date > selectedDateObj.date) {
            entire.splice(i, 1);

            entire = JSON.stringify(entire);

            localStorage.setItem(`DevDylanReminder`, entire);
          }
        }
      }
    }
  }
};

// DISPLAYS THE DATE AND DAY AT THE TOP

const displayDateAndDay = (dateObj) => {
  const date = document.querySelector(`#current-date`);
  const day = document.querySelector(`#current-day`);

  date.textContent = dateObj.date;
  day.textContent = dateObj.day;
};

// CREATES THE LIST OF MONTHS AS OPTIONS AND THEN DISPLAYS THE SELECTED MONTH AT THE TOP

const displayMonth = (dateObj) => {
  const month = document.querySelector(`#months`);

  const monthsLength = arrays.months.length;

  let i = 0;
  for (; i < monthsLength; i++) {
    const option = document.createElement(`option`);
    option.value = arrays.months[i];
    option.textContent = arrays.months[i];
    month.append(option);
  }

  month.value = dateObj.month;
};

// CREATES THE LIST OF YEARS (100 YEARS BACK AND 100 YEARS FROM PRESENT YEAR) AS OPTIONS AND THEN DISPLAYS THE SELECTED YEAR AT THE TOP

const displayYear = (dateObj) => {
  const year = document.querySelector(`#year`);

  const present = new Date();
  const presentYear = present.getFullYear();

  const firstYear = presentYear - 100;
  const lastYear = presentYear + 100;

  for (i = firstYear; i <= lastYear; i++) {
    const option = document.createElement(`option`);
    option.value = i;
    option.textContent = i;
    year.append(option);
  }

  year.value = dateObj.year;
};

// DISPLAYS THE CORRECT CALENDAR STRUCTURE

const displayCalendar = (dateObj) => {
  const dates = document.querySelectorAll(`.dates`);

  const { day, month, year } = dateObj;

  const monthIndex = arrays.months.indexOf(month);

  const calendarMonth = new Date(year, monthIndex, 1);

  let firstDayOfMonth = calendarMonth.getDay();

  let lastDay;
  if (month == `February`) {
    lastDay = 28;
  } else if (
    month == `September` ||
    month == `April` ||
    month == `June` ||
    month == `November`
  ) {
    lastDay = 30;
  } else {
    lastDay = 31;
  }

  let num = 1;
  dates.forEach((e, i) => {
    if (i >= firstDayOfMonth && num <= lastDay) {
      e.textContent = num;
      e.classList.add(`hasDate`);
      num++;
    }
  });
};

// HIGLIGHTS THE SELECTED DATE

const highlightDate = (dateObj) => {
  const allDates = document.querySelectorAll(`.hasDate`);
  const allSpaces = document.querySelectorAll(`.dates`);

  let date = dateObj.date;
  date = date - 1;

  allSpaces.forEach((e) => {
    e.classList.remove(`selected`);
  });

  const selectedDate = allDates[date];
  selectedDate.classList.add(`selected`);
};

// ALLOWS USER TO CHANGE THE SELECTED MONTH AND THEN GETS THE APPROPRIATE DATE WITH ONLY THE MONTH CHANGED

const userChangeMonth = (dateObj) => {
  const month = document.querySelector(`#months`);
  const allDates = document.querySelectorAll(`.dates`);

  month.oninput = () => {
    allDates.forEach((e) => {
      e.classList.remove(`hasDate`);
      e.textContent = ``;
    });

    const selectedMonth = month.value;
    const monthIndex = arrays.months.indexOf(selectedMonth);

    let newDate = new Date(dateObj.year, monthIndex, dateObj.date);

    newDate = generateDateObj(newDate);
    initApp(newDate);
  };
};

// ALLOWS USER TO CHANGE THE SELECTED YEAR AND THEN GETS THE APPROPRIATE DATE WITH ONLY THE YAR CHANGED

const userChangeYear = (dateObj) => {
  const year = document.querySelector(`#year`);
  const allDates = document.querySelectorAll(`.hasDate`);

  year.oninput = () => {
    allDates.forEach((e) => {
      e.classList.remove(`hasDate`);
      e.textContent = ``;
    });

    const selectedYear = year.value;
    const monthIndex = arrays.months.indexOf(dateObj.month);

    let newDate = new Date(selectedYear, monthIndex, dateObj.date);

    newDate = generateDateObj(newDate);

    initApp(newDate);
  };
};

// ALLOWS THE USER TO CHANGE THE DATE THAT IS BEING FOCUSED ON AND HIGHLIGHTS THE SELECTED DATE

const userChangeDate = (dateObj) => {
  const allDates = document.querySelectorAll(`.hasDate`);

  allDates.forEach((date) => {
    date.onclick = () => {
      const selectedDate = parseInt(date.textContent);

      const monthIndex = arrays.months.indexOf(dateObj.month);

      let newDate = new Date(dateObj.year, monthIndex, selectedDate);

      newDate = generateDateObj(newDate);
      initApp(newDate);
    };
  });
};

// DISPLAYS A WARNING IF THE SELECTED DATE IS PAST

const displayPastDateWarning = (dateObj) => {
  const presentDate = new Date();
  const selectedFullDate = generateFullDate(dateObj);
  selectedFullDate.setHours(23, 59, 59);

  const pastDateWarning = document.querySelector(`#past-date-warning`);

  if (presentDate > selectedFullDate) {
    pastDateWarning.classList.remove(`-translate-y-full`);

    setTimeout(() => {
      pastDateWarning.classList.add(`-translate-y-full`);
    }, 3500);
  } else {
    pastDateWarning.classList.add(`-translate-y-full`);
  }
};

// GETS THE NUMBER OF REMINDERS IN THE LOCAL STORAGE FOR THE SELECTED DATE AND DISPLAYS THE COUNT

const showReminderCount = (dateObj) => {
  const presentDate = new Date();

  const monthIndex = arrays.months.indexOf(dateObj.month);
  const selectedDate = new Date(
    dateObj.year,
    monthIndex,
    dateObj.date,
    23,
    59,
    59
  );

  const reminderNumber = document.querySelector(`#reminder-num`);

  if (presentDate > selectedDate) {
    reminderNumber.classList.add(`hidden`);
  } else {
    reminderNumber.classList.remove(`hidden`);

    const reminderObj = getReminders(dateObj);
    if (reminderObj) {
      const reminderArray = reminderObj.reminder;

      const count = reminderArray.length;

      if (count) {
        reminderNumber.textContent = `${count} reminders set for this day. Tap or Click to edit.`;
      } else {
        reminderNumber.textContent = `No reminders set for this day. Tap or Click to edit.`;
      }
    } else {
      reminderNumber.textContent = `No reminders set for this day. Tap or Click to edit.`;
    }
  }
};

// ALLOWS THE USER TO OPEN AND CLOSE THE REMINDER MODAL (MOBILE DEVICES)

const toggleReminderModal = (dateObj) => {
  const reminderCount = document.querySelector(`#reminder-count`);
  const mobileModal = document.querySelector(`#reminder-modal`);
  const closeBtn = document.querySelector(`#close-modal`);

  const presentDate = new Date();

  const selectedDate = generateFullDate(dateObj);

  if (selectedDate < presentDate) {
    reminderCount.classList.add(`hidden`);
  } else {
    reminderCount.classList.remove(`hidden`);
  }

  reminderCount.onclick = () => {
    mobileModal.classList.toggle(`translate-x-full`);
  };

  closeBtn.onclick = () => {
    mobileModal.classList.toggle(`translate-x-full`);
  };
};

// SHOWS THE LIST OF REMINDERS IN THE MODAL (MOBILE DEVICES)

const showReminderList = (dateObj) => {
  const reminderObj = getReminders(dateObj);

  const mobileModal = document.querySelector(`#reminder-modal`);
  const reminderTitle = mobileModal.querySelector(`#reminder-title`);
  const reminderList = mobileModal.querySelector(`#reminder-list`);

  const dateString = generateDateString(dateObj);
  reminderTitle.textContent = `Reminders for ${dateString}`;

  if (reminderObj) {
    const reminderArray = reminderObj.reminder;
    const count = reminderArray.length;
    if (count > 0) {
      reminderList.innerHTML = ``;

      let i = 0;
      for (; i < count; i++) {
        const reminderItem = document.createElement(`li`);
        reminderItem.classList.add(`reminder-items`, `dark:border-slate-300`);
        reminderItem.textContent = reminderArray[i];
        reminderList.append(reminderItem);
        /* 
        const deleteBtn = document.createElement(`i`);
        reminderItem.append(deleteBtn);
        deleteBtn.classList.add(`fa-solid`, `fa-trash`, `delete-btn`); */
      }
    } else {
      reminderList.innerHTML = ``;

      reminderList.innerHTML = `No reminders for ${dateString}`;
    }
  } else {
    reminderList.innerHTML = ``;

    reminderList.innerHTML = `No reminders for ${dateString}`;
  }
};

// SHOWS THE LIST OF REMINDERS IN THE MODAL (DESKTOP SCREENS)

const showDesktopReminderList = (dateObj) => {
  const reminderObj = getReminders(dateObj);

  const reminderDesktop = document.querySelector(`#reminder-desktop`);
  const reminderTitle = reminderDesktop.querySelector(`#reminder-title`);
  const reminderList = reminderDesktop.querySelector(`#reminder-list`);

  const dateString = generateDateString(dateObj);
  reminderTitle.textContent = `Reminders for ${dateString}`;

  if (reminderObj) {
    const reminderArray = reminderObj.reminder;
    const count = reminderArray.length;
    if (count > 0) {
      reminderList.innerHTML = ``;

      let i = 0;
      for (; i < count; i++) {
        const reminderItem = document.createElement(`li`);
        reminderItem.classList.add(
          `group`,
          `reminder-items`,
          `dark:border-slate-300`
        );
        reminderItem.textContent = reminderArray[i];
        reminderList.append(reminderItem);
      }
    } else {
      reminderList.innerHTML = ``;

      reminderList.innerHTML = `No reminders for ${dateString}`;
    }
  } else {
    reminderList.innerHTML = ``;

    reminderList.innerHTML = `No reminders for ${dateString}`;
  }
};

// ALLOWS THE USER TO SET NEW REMINDERS FOR THE SELECTED DATE (MOBILE DEVICES)

const setNewReminder = (dateObj) => {
  const mobileModal = document.querySelector(`#reminder-modal`);
  const reminderInput = mobileModal.querySelector(`#reminder-input`);
  const value = reminderInput.value;

  if (value != ``) {
    storeReminders(dateObj, value);
    initApp(dateObj);
    reminderInput.value = ``;
  }
};

// DISABLES THE NEW REMINDER INPUT AND BUTTON IF THE SELCTED DATE IS IN THE PAST

const disableNewReminderInput = (dateObj) => {
  const reminderSection = document.querySelector(`#reminder-desktop`);
  const reminderInput = reminderSection.querySelector(`#reminder-input`);
  const addNewBtn = reminderSection.querySelector(`#add-new`);

  const presentDate = new Date();
  const selectedFullDate = generateFullDate(dateObj);
  selectedFullDate.setHours(23, 59, 59);

  if (presentDate > selectedFullDate) {
    reminderInput.setAttribute(`disabled`, ``);
    addNewBtn.setAttribute(`disabled`, ``);
  } else {
    reminderInput.removeAttribute(`disabled`);
    addNewBtn.removeAttribute(`disabled`);
  }
};

// ALLOWS THE USER TO SET NEW REMINDERS FOR THE SELECTED DATE (DESKTOP SCREENS) (I DONT KNOW WHY IM CALLING LARGER SCREENS DESKTOP LOL)

const setNewReminderDesktop = (dateObj) => {
  const reminderSection = document.querySelector(`#reminder-desktop`);
  const reminderInput = reminderSection.querySelector(`#reminder-input`);
  const value = reminderInput.value;

  if (value != ``) {
    storeReminders(dateObj, value);
    initApp(dateObj);
    reminderInput.value = ``;
  }
};

// GENERATES A SHORTHAND DATE STRING FROM A DATE OBJECT

const generateDateString = (dateObj) => {
  const year = dateObj.year;

  let month = dateObj.month;
  month = arrays.months.indexOf(month);
  month = month + 1;

  const date = dateObj.date;

  const dateString = `${date}/${month}/${year}`;

  return dateString;
};

// GENERATES AN ORIGINAL DATE FUNCTION OBJECT FROM MY OWN DATE OBJECT. I'LL CALL IT FULLDATE

const generateFullDate = (dateObj) => {
  const monthIndex = arrays.months.indexOf(dateObj.month);

  const fullDate = new Date(dateObj.year, monthIndex, dateObj.date, 23, 59, 59);

  return fullDate;
};

// STORES REMINDERS IN LOCAL STORAGE

const storeReminders = (dateObj, reminder) => {
  const containerObj = getReminders(dateObj);

  containerObj.reminder.push(reminder);

  let entire = localStorage.getItem(`DevDylanReminder`);
  entire = JSON.parse(entire);

  if (!entire) {
    entire = [];
  }

  const length = entire.length;

  let i = 0;
  for (; i < length; i++) {
    const reminderObj = entire[i];
    if (reminderObj.dateString == containerObj.dateString) {
      const index = entire.indexOf(reminderObj);

      entire.splice(index, 1);
    }
  }

  entire.push(containerObj);

  entire = JSON.stringify(entire);
  localStorage.setItem(`DevDylanReminder`, entire);
};

// GETS REMINDERS FOR THE SELECTED DATE FROM LOCAL STORAGE

const getReminders = (dateObj) => {
  const dateString = generateDateString(dateObj);

  let entire = localStorage.getItem(`DevDylanReminder`);
  entire = JSON.parse(entire);

  if (!entire || entire.length == 0) {
    const containerObj = new containerBlueprint(dateString, dateObj);

    return containerObj;
  }

  const length = entire.length;

  let newContainer;
  let i = 0;
  for (; i < length; i++) {
    const reminderObj = entire[i];
    if (reminderObj.dateString == dateString) {
      newContainer = reminderObj;
      return newContainer;
    }
  }

  if (!newContainer) {
    const containerObj = new containerBlueprint(dateString, dateObj);

    return containerObj;
  }
};

// MAIN FUNCTION

const initApp = (dateObj) => {
  deletePastReminders(dateObj);

  displayDateAndDay(dateObj);
  displayMonth(dateObj);
  displayYear(dateObj);

  displayCalendar(dateObj);
  highlightDate(dateObj);

  displayPastDateWarning(dateObj);

  // THESE FUNCTIONS ARE FOR MOBILE DEVICES
  showReminderCount(dateObj);
  toggleReminderModal(dateObj);
  showReminderList(dateObj);

  const addBtnMobile = document.querySelector(`#reminder-modal #add-new`);
  addBtnMobile.onclick = () => {
    setNewReminder(dateObj);
  };
  // END OF MOBILE FUNCTIONS

  // FUNCTIONS FOR DESKTOP SCREENS
  // BASICALLY THE SAME THING BUT WITH DIFFERENCES IN SELECTORS
  disableNewReminderInput(dateObj);
  showDesktopReminderList(dateObj);

  const addBtnDesktop = document.querySelector(`#reminder-desktop #add-new`);
  addBtnDesktop.onclick = () => {
    setNewReminderDesktop(dateObj);
  };
  // END OF DESKTOP FUNCTIONS

  userChangeMonth(dateObj);
  userChangeYear(dateObj);
  userChangeDate(dateObj);
};

// GET TODAY'S DATE AND INITIATES THE APP

const getcurrentDate = () => {
  let today = new Date();
  today = generateDateObj(today);

  initApp(today);
};

getcurrentDate();
