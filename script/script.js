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

// Fonction pour créer un username à chaque objet en fonction de leurs noms
function createUsername(user) {
    user.forEach((account) => {
        account.username = account.owner.toLowerCase()
                                  .split(' ')
                                  .map(name => name[0])
                                  .join('');
    })
}

createUsername(accounts);

// Fonction pour afficher les dépôt et retrait
function displayMovements(movements) {
    containerMovements.innerHTML = '';

    movements.forEach((mov, i) => {
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

// Fonction pour calculer la balance de dépôt, la balance de retrait et la balance d'intérêt
function filterMov(movements) {
    let balanceDeposit = movements.filter(mov => mov > 0)
                                  .reduce((current, mov) => current + mov, 0);

    let balanceWithdrawal = movements.filter(mov => mov < 0)
                                     .reduce((current, mov) => current + mov, 0);

    let balanceInterest = movements.filter(mov => mov > 0)
                                   .map(mov => (mov * 1.2) / 100)
                                   .reduce((current, mov) => current + mov, 0);
    labelSumIn.textContent = `${balanceDeposit}€`;
    labelSumOut.textContent = `${Math.abs(balanceWithdrawal)}€`;
    labelSumInterest.textContent = `${Math.trunc(balanceInterest)}€`;
}

// Fonction pour calculer la balance totale du compte
function accountBalance(movements) {
    let balance = movements.reduce((acc, cur) => acc + cur)
    labelBalance.textContent = `${balance}€`;
}

// Connexion
let currentAccount;
btnLogin.addEventListener("click", (event) => {
    // Désactive le rechargement de la page de la balise form
    event.preventDefault();

    currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

    // Si currentAccount existe et son pin et égale à celui de l'input PIN
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        // Affiche l'UI et affiche un message de bienvenu
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = '1';

        // Affichent les dépôt et retrait
        displayMovements(currentAccount.movements);

        // Affiche les balances
        filterMov(currentAccount.movements);

        // Affiche le sommaire
        accountBalance(currentAccount.movements);
    }
})