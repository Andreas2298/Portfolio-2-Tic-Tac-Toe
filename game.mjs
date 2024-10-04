import { print, askQuestion } from "./io.mjs"
import { debug, DEBUG_LEVELS } from "./debug.mjs";
import { ANSI } from "./ansi.mjs";
import DICTIONARY from "./language.mjs";
import showSplashScreen from "./splash.mjs";

const GAME_BOARD_SIZE = 3;
const WIN_SUM = 3;
const PLAYER_1 = 1;
const PLAYER_2 = -1;

const NO_CHOICE = -1;
const EXIT_SUCCESS = 0;
const WINNER_MESSAGE = "The winner is "
const GAME_OVER_MESSAGE = "Game over!";
    
const MENU_CHOICES = {
    MENU_CHOICE_START_GAME: 1,
    MENU_CHOICE_SHOW_SETTINGS: 2,
    MENU_CHOICE_EXIT_GAME: 3,
    MENU_CHOICE_LAN_EN: 4,
    MENU_CHOICE_LAN_NO: 5
};

const NO_CHOICE = -1;

let language = DICTIONARY.en;
let gameboard;
let currentPlayer;


clearScreen();
showSplashScreen();
setTimeout(start, 2500); // This waites 2.5seconds before calling the function. i.e. we get to see the splash screen for 2.5 seconds before the menue takes over. 
langChoice(1);


//#region game functions -----------------------------
async function langChoice(chosenAction){
    if (chosenAction == MENU_CHOICES.MENU_CHOICE_LAN_EN) {
        language = DICTIONARY.en;
    }
    if (chosenAction == MENU_CHOICES.MENU_CHOICE_LAN_NO ) {
        language = DICTIONARY.no;
    }
    
}


async function start() {

    do {

        let chosenAction = NO_CHOICE;
        chosenAction = await showMenu();

        if (chosenAction == MENU_CHOICES.MENU_CHOICE_START_GAME) {
            await runGame();
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS) {
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_EXIT_GAME) {
            clearScreen();
           process.exit(EXIT_SUCCESS);
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_LAN_EN){
            langChoice(chosenAction);
        } else if (chosenAction == MENU_CHOICES.MENU_CHOICE_LAN_NO){
            langChoice(chosenAction);
        }

    } while (true)

}

async function runGame() {

    let isPlaying = true;

    while (isPlaying) { // Do the following until the player dos not want to play anymore. 
        initializeGame(); // Reset everything related to playing the game
        isPlaying = await playGame(); // run the actual game 
    }
}

async function showMenu() {

    const CHOICE_INVALID = -1;
    let choice = CHOICE_INVALID;

    let validChoice = false;    
    while (!validChoice) {
        // Display our menu to the player.
        clearScreen();
        print(ANSI.COLOR.YELLOW + "MENU" + ANSI.RESET);
        print(`{$MENU_CHOICES.MENU_CHOICE_START_GAME} 1. Play Game`);
        print(`{$MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS} 2. Settings`);
        print(`{$MENU_CHOICES.MENU_CHOICE_EXIT_GAME} 3. Exit Game`);

        // Wait for the choice.
        choice = await askQuestion("");

        // Check to see if the choice is valid.
        if ([MENU_CHOICES.MENU_CHOICE_START_GAME, MENU_CHOICES.MENU_CHOICE_SHOW_SETTINGS, MENU_CHOICES.MENU_CHOICE_EXIT_GAME].includes(Number(choice))) {
            validChoice = true;
        }
    }

    return choice;
}

const NOT_FINISHED = 0;
async function playGame() {
    // Play game..
    let outcome;
    do {
        clearScreen();
        showGameBoardWithCurrentState();
        showHUD();
        let move = await getGameMoveFromtCurrentPlayer();
        updateGameBoardState(move);
        outcome = evaluateGameState();
        changeCurrentPlayer();
    } while (outcome == NOT_FINISHED)

    showGameSummary(outcome);

    return await askWantToPlayAgain();
}

const YES_CONFIRMED = 'y';
async function askWantToPlayAgain() {
    let answer = await askQuestion(language.PLAY_AGAIN_QUESTION);
    let playAgain = true;
    if (answer && answer.toLowerCase()[0] != YES_CONFIRMED) {
        playAgain = false;
    }
    return playAgain;
}


function showGameSummary(outcome) {
    clearScreen();
    let winningPlayer = (outcome > 0) ? PLAYER_1 : PLAYER_2;
    print(WINNER_MESSAGE + winningPlayer);
    showGameBoardWithCurrentState();
    print(GAME_OVER_MESSAGE);
}

function changeCurrentPlayer() {
    currentPlayer (currentPlayer == PLAYER_ONE) ? PLAYER_TWO : PLAYER_ONE;
}


function evaluateGameState() {
    let sum = 0;
    let state = 0;

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {

        for (let col = 0; col < GAME_BOARD_SIZE; col++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == WIN_SUM) {
            state = sum;
        }
        sum = 0;
    }

    for (let col = 0; col < GAME_BOARD_SIZE; col++) {

        for (let row = 0; row < GAME_BOARD_SIZE; row++) {
            sum += gameboard[row][col];
        }

        if (Math.abs(sum) == WIN_SUM) {
            state = sum;
        }

        sum = 0;
    }


 for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        let col = row;
        sum += gameboard[row][col];
    }
    if (Math.abs(sum) == GAME_BOARD_SIZE) {
        state = sum;
    }
    sum = 0;

    for (let row = 0; row < GAME_BOARD_SIZE; row++) {
        let col = (GAME_BOARD_SIZE - 1) - row;
        sum += gameboard[row][col];
    }
    if (Math.abs(sum) == GAME_BOARD_SIZE) {
        state = sum;
    }
    
    sum = 0;
    let winner = state / WIN_SUM;
    return winner;
}

function updateGameBoardState(move) {
    const ROW_INDEX = 0;
    const COLUMN_INDEX = 1;
    gameboard[move[ROW_INDEX]][move[COLUMN_INDEX]] = currentPlayer;
}

async function getGameMoveFromtCurrentPlayer() {
    let position = null;
     do {
        let rawInput = await askQuestion(language.PLASS);
        position = rawInput.split(" ");
        position[0] = position[0]-1           
        position[1] = position[1]-1
    } while (isValidPositionOnBoard(position) == false)

    return position
}

function isValidPositionOnBoard(position) {

    if (position.length < 2) {
        // We where not given two numbers or more.
        return false;
    }

    let isValidInput = true;
    if (position[0] * 1 != position[0] && position[1] * 1 != position[1]) {
        // Not Numbers
        inputWasCorrect = false;
    } else if (position[0] > GAME_BOARD_SIZE && position[1] > GAME_BOARD_SIZE) {
        // Not on board
        inputWasCorrect = false;
    }
    else if (Number.parseInt(position[0]) != position[0] && Number.parseInt(position[1]) != position[1]) {
        // Position taken.
        inputWasCorrect = false;
    }


    return isValidInput;
}

function showHUD() {
    let playerDescription = "one";
    if (PLAYER_2 == currentPlayer) {
        playerDescription = "two";
    }
    print("Player " + playerDescription + " it is your turn");
}

function showGameBoardWithCurrentState() {
    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let rowOutput = "";
        for (let currentCol = 0; currentCol < GAME_BOARD_SIZE; currentCol++) {
            let cell = gameboard[currentRow][currentCol];
            if (cell == 0) {
                rowOutput += "_ ";
            }
            else if (cell > 0) {
                rowOutput += "X ";
            } else {
                rowOutput += "O  ";
            }
        }

        print(rowOutput);
    }
}

function initializeGame() {
    gameboard = createGameBoard();
    currentPlayer = PLAYER_1;
}

function createGameBoard() {

    let newBoard = new Array(GAME_BOARD_SIZE);

    for (let currentRow = 0; currentRow < GAME_BOARD_SIZE; currentRow++) {
        let row = new Array(GAME_BOARD_SIZE);
        for (let currentColumn = 0; currentColumn < GAME_BOARD_SIZE; currentColumn++) {
            row[currentColumn] = 0;
        }
        newBoard[currentRow] = row;
    }

    return newBoard;

}

function clearScreen() {
    console.log(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME, ANSI.RESET);
}


//#endregion

