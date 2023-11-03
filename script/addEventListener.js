'use strict';

let currentAccount, timer;
// Event click for connexion
btnLogin.addEventListener("click", (event) => {
    // Prevent default for form
    event.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Update UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = '1';

        // Delete input login
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur(); // Permet de retirer le focus sur l'élément

        // Current date
        const currentDate = new Date();
        const options = {
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            month: 'numeric', // long
            year: 'numeric',
            //weekday: 'short'
        }

        // const locale = navigator.language;
        labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(currentDate);

        /*
        const currentDay = `${currentDate.getDate()}`.padStart(2, '0');
        const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
        const currentYear = currentDate.getFullYear();
        const currentHours = `${currentDate.getHours()}`.padStart(2, '0');
        const currentMinutes = `${currentDate.getMinutes()}`.padStart(2, '0');
        labelDate.textContent = `${currentDay}/${currentMonth}/${currentYear}, ${currentHours}:${currentMinutes}`;
        */

        // Reset Timer
        resetTimer();

        // Update UI
        updateUI(currentAccount);
    }
})

// Event click for transfer money
btnTransfer.addEventListener("click", (event) => {
    event.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(account => account.username === inputTransferTo.value);
    inputTransferAmount.value = inputTransferTo.value = '';

    if (amount > 0 && currentAccount.balance >= amount && receiverAccount && receiverAccount?.username !== currentAccount.username) {
        // Transfer
        currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);

        // Adding new date
        currentAccount.movementsDates.push(new Date().toISOString());
        receiverAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);

        inputTransferAmount.blur(); // Permet de retirer le focus sur l'élément

        // Reset Timer
        resetTimer();
    }
})

// Event click for doing a loan
btnLoan.addEventListener("click", (event) => {
    event.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        // Add movement
        setTimeout(() => {
            currentAccount.movements.push(amount);

            // Adding new date
            currentAccount.movementsDates.push(new Date().toISOString());

            // Update UI
            updateUI(currentAccount);
        }, 3000);
    }
    inputLoanAmount.value = '';
    inputLoanAmount.blur(); // Permet de retirer le focus sur l'élément

    // Reset Timer
    resetTimer();
})

// Event click for close account
btnClose.addEventListener("click", (event) => {
    event.preventDefault();

    if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
        const index = accounts.findIndex(account => account.username === currentAccount.username);

        // Delete account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = '0';
    }
    inputCloseUsername.value = inputClosePin.value = '';
    inputClosePin.blur(); // Permet de retirer le focus sur l'élément
})

// Event click for sorting movements
let sorted = 0;
btnSort.textContent = `⬅️ SORT`;

btnSort.addEventListener("click", (event) => {
    event.preventDefault();
    switchMoves(currentAccount);
})