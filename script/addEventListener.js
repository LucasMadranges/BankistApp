'use strict';

// Event click for connexion
let currentAccount;
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

        // Update UI
        updateUI(currentAccount);

        inputTransferAmount.blur(); // Permet de retirer le focus sur l'élément
    }
})

// Event click for doing a loan
btnLoan.addEventListener("click", (event) => {
    event.preventDefault();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
        // Add movement
        currentAccount.movements.push(amount);

        // Update UI
        updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
    inputLoanAmount.blur(); // Permet de retirer le focus sur l'élément
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
    switchMoves(currentAccount.movements);
})