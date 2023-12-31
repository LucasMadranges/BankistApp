'use strict';

// Display movements
function displayMovements(account, movements) {
    containerMovements.innerHTML = '';

    movements.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(account.movementsDates[i]);
        const movementDate = calcDateMovement(date, account.locale);

        // Formatted the movements
        const formattedMov = formattedMovements(mov, account);

        const html = document.createElement(`div`);
        html.innerHTML = '' +
            `<div class="movements__row" ${i % 2 === 0 ? `style="background-color: #f0f0f0"` : `style="background-color: #fff"`}>
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                 <div class="movements__date">${movementDate}</div>
                <div class="movements__value">${formattedMov}</div>
            </div>`;
        containerMovements.insertAdjacentElement('afterbegin', html);
    })
}

// Calculate the deposit, withdrawal and interest
function filterMov(account) {
    let balanceDeposit = account.movements.filter(mov => mov > 0)
        .reduce((current, mov) => current + mov, 0);

    let balanceWithdrawal = account.movements.filter(mov => mov < 0)
        .reduce((current, mov) => current + mov, 0);

    let balanceInterest = account.movements.filter(mov => mov > 0)
        .map(mov => (mov * account.interestRate) / 100)
        .reduce((current, mov) => current + mov, 0);
    labelSumIn.textContent = `${formattedMovements(balanceDeposit, account)}`;
    labelSumOut.textContent = `${formattedMovements(Math.abs(balanceWithdrawal), account)}`;
    labelSumInterest.textContent = `${formattedMovements(balanceInterest, account)}`;
}

// Calculate the total of the current account
function accountBalance(account) {
    account.balance = account.movements.reduce((acc, cur) => acc + cur);
    const formattedBalance = formattedMovements(account.balance, account);
    labelBalance.textContent = `${formattedBalance}`;
}

// Call 3 functions
function updateUI(account) {
    // Affichent les dépôt et retrait
    displayMovements(account, account.movements);

    // Affiche les balances
    filterMov(account);

    // Affiche le sommaire
    accountBalance(account);
}

// Sorting function
function switchMoves(account) {
    let moves;
    sorted++;
    sorted === 3 ? sorted = 0 : undefined;

    switch (sorted) {
        case 0:
            moves = account.movements;
            btnSort.textContent = `⬅️ SORT`;
            break;
        case 1:
            moves = account.movements.slice()
                .sort((a, b) => a - b);
            btnSort.textContent = `⬆️ SORT`;
            break;
        case 2:
            moves = account.movements.slice()
                .sort((a, b) => b - a);
            btnSort.textContent = `⬇️ SORT`;
            break;
    }

    displayMovements(account, moves, sorted);
}

// Date of the movement 
function calcDateMovement(date, locale) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), date)

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;
    else {
        /*
        const day = `${date.getDate()}`.padStart(2, '0');
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
         */

        return new Intl.DateTimeFormat(locale).format(date);
    }
}

// Function for formatted the movements
function formattedMovements(value, account) {
    return new Intl.NumberFormat(account.locale, {
        style: 'currency',
        currency: account.currency,
    }).format(value);
}

// Start log out timer
function startLogOutTimer() {
    // Set time to 5 minutes
    let time = 300;

    function tick() {
        const min = `${Math.trunc(time / 60)}`.padStart(2, '0');
        const sec = `${time % 60}`.padStart(2, '0');
        // In each call, print the remaining time to UI
        labelTimer.textContent = `${min}:${sec}`;

        // When 0 seconds, stop the timer and log out the user
        if (time === 0) {
            clearInterval(timer);
            // Update UI and message
            labelWelcome.textContent = `Log in to get started`;
            containerApp.style.opacity = '0';
        }

        // Decrease 1 second 
        time--;
    }

    tick();
    // Call the timer every second
    const timer = setInterval(() => tick(), 1000)
    return timer;
}

// Reset timer
function resetTimer() {
    // Timer log out
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
}