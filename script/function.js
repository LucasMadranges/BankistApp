'use strict';

// Function for create username for each object
function createUsername(user) {
    user.forEach((account) => {
        account.username = account.owner.toLowerCase()
                                  .split(' ')
                                  .map(name => name[0])
                                  .join('');
    })
}

// Function for display movements   
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

function switchMoves(movements) {
    let moves;
    sorted++;
    sorted === 3 ? sorted = 0 : undefined;

    switch (sorted) {
        case 0:
            moves = movements;
            btnSort.textContent = `⬅️ SORT`;
            break;
        case 1:
            moves = movements.slice()
                             .sort((a, b) => a - b);
            btnSort.textContent = `⬆️ SORT`;
            break;
        case 2:
            moves = movements.slice()
                             .sort((a, b) => b - a);
            btnSort.textContent = `⬇️ SORT`;
            break;
    }

    displayMovements(moves, sorted);
}