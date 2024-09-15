const crypto = require('crypto');
const readlineSync = require('readline-sync');
function generateKey() {
    return crypto.randomBytes(32).toString('hex');
}
function generateHMAC(key, move) {
    return crypto.createHmac('sha256', key).update(move).digest('hex');
}
function getComputerMove(moves) {
    const randomIndex = crypto.randomInt(moves.length);
    return moves[randomIndex];
}
function determineWinner(playerMove, computerMove, moves) {
    const playerIndex = moves.indexOf(playerMove);
    const computerIndex = moves.indexOf(computerMove);
    const half = Math.floor(moves.length / 2);
    if (playerIndex === computerIndex) {
        return 'Draw';
    } else if (
        (playerIndex > computerIndex && playerIndex - computerIndex <= half) ||
        (computerIndex > playerIndex && computerIndex - playerIndex > half)
    ) {
        return 'You win!';
    } else {
        return 'Computer wins!';
    }
}
function displayHelp(moves) {
    console.log('\nHelp Table:');
    const header = ['PC/User >', ...moves].join(' | ');
    console.log('-'.repeat(header.length));
    console.log(header);
    console.log('-'.repeat(header.length));
    moves.forEach((move, i) => {
        const row = [move];
        moves.forEach((opponentMove, j) => {
            if (i === j) {
                row.push('Draw');
            } else if (
                (i > j && i - j <= Math.floor(moves.length / 2)) ||
                (j > i && j - i > Math.floor(moves.length / 2))
            ) {
                row.push('Win');
            } else {
                row.push('Lose');
            }
        });
        console.log(row.join(' | '));
    });
    console.log('-'.repeat(header.length));
}
function playGame(moves) {
    if (moves.length < 3 || moves.length % 2 === 0 || new Set(moves).size !== moves.length) {
        console.error('Error: Invalid input. Enter an odd number ≥ 3 of non-repeating moves.');
        return;
    }
    const computerMove = getComputerMove(moves);
    const key = generateKey();
    const hmac = generateHMAC(key, computerMove);
    console.log(`HMAC: ${hmac}`);
    console.log('\nAvailable moves:');
    moves.forEach((move, index) => {
        console.log(`${index + 1} - ${move}`);
    });
    console.log('0 - Exit');
    console.log('? - Help');

    let playerChoice;
    while (true) {
        playerChoice = readlineSync.question('\nEnter your move: ');

        if (playerChoice === '0') {
            console.log('Goodbye!');
            return;
        } else if (playerChoice === '?') {
            displayHelp(moves);
        } else {
            const playerIndex = parseInt(playerChoice) - 1;
            if (!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < moves.length) {
                const playerMove = moves[playerIndex];
                console.log(`Your move: ${playerMove}`);
                console.log(`Computer move: ${computerMove}`);
                const result = determineWinner(playerMove, computerMove, moves);
                console.log(result);
                console.log(`HMAC key: ${key}`);
                return;
            } else {
                console.log('Invalid input. Please try again.');
            }
        }
    }
}
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('Error: You must provide an odd number ≥ 3 of non-repeating moves as arguments.');
} else {
    playGame(args);
}
