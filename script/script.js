'use strict';

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Function for create username for each object
function createUsername(user) {
    user.forEach((account) => {
        account.username = account.owner.toLowerCase()
                                  .split(' ')
                                  .map(name => name[0])
                                  .join('');
    })
}

createUsername(accounts);

// Function for display movements
function displayMovements(movements, sort = false) {
    containerMovements.innerHTML = '';

    const moves = sort ? movements.slice()
                                  .sort((a, b) => a - b) : movements;

    moves.forEach((mov, i) => {
        const type = mov > 0 ? 'deposit' : 'withdrawal';

        const html = document.createElement(`div`);
        html.innerHTML = '' +
            `<div class="movements__row">
                <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                <div class="movements__value">${mov}€</div>
            </div>`;

        containerMovements.insertAdjacentElement('afterbegin', html);
    })
}

// Function for calculate the deposit, withdrawal and interest
function filterMov(account) {
    let balanceDeposit = account.movements.filter(mov => mov > 0)
                                .reduce((current, mov) => current + mov, 0);

    let balanceWithdrawal = account.movements.filter(mov => mov < 0)
                                   .reduce((current, mov) => current + mov, 0);

    let balanceInterest = account.movements.filter(mov => mov > 0)
                                 .map(mov => (mov * account.interestRate) / 100)
                                 .reduce((current, mov) => current + mov, 0);
    labelSumIn.textContent = `${balanceDeposit}€`;
    labelSumOut.textContent = `${Math.abs(balanceWithdrawal)}€`;
    labelSumInterest.textContent = `${Math.trunc(balanceInterest)}€`;
}

// Function for calculate the total of the current account
function accountBalance(account) {
    account.balance = account.movements.reduce((acc, cur) => acc + cur)
    labelBalance.textContent = `${account.balance}€`;
}

// Call 3 functions
function updateUI(account) {
    // Affichent les dépôt et retrait
    displayMovements(account.movements);

    // Affiche les balances
    filterMov(account);

    // Affiche le sommaire
    accountBalance(account);
}

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
let sorted = false;
btnSort.addEventListener("click", (event) => {
    event.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})  