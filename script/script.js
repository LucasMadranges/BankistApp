'use strict';

createUsername(accounts);

const currentDate = new Date();
const options = {
    minute: 'numeric',
    hour: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'short'
}
const locale = navigator.language;

labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(currentDate);

/*
const currentDay = `${currentDate.getDate()}`.padStart(2, '0');
const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
const currentYear = currentDate.getFullYear();
const currentHours = `${currentDate.getHours()}`.padStart(2, '0');
const currentMinutes = `${currentDate.getMinutes()}`.padStart(2, '0');
labelDate.textContent = `${currentDay}/${currentMonth}/${currentYear}, ${currentHours}:${currentMinutes}`;
*/
