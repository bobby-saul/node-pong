#!/usr/bin/env node

/*
TODO:
  - start screen
    x 1 player
    x 2 player
    - help
    x quit

  - game screen
    x show score
    - pause
    x move player 1
    x move player 2
    x move ball
    x when score
    - when game over
    - computer for 1 player mode

  - pause screen
    - score
    - resume
    - help
    - restart
    - quit

  - game over
    - score
    - rematch
    - back
    - quit

  - help
    - instructions
    - back
*/

const process = require("process");
const readline = require("readline");
const settings = require("./settings");
const GameEngine = require("./GameEngine");
const GameScreen = require("./GameScreen");
const StartScreen = require("./StartScreen");
const MenuItem = require("./MenuItem");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function main() {
  // Global variables
  const startScreen = new StartScreen(process, [
    new MenuItem("One Player", startGame),
    new MenuItem("Two Players", startGame),
    new MenuItem("Help", displayHelp),
    new MenuItem("Quit", exitProgram),
  ]);
  const gameScreen = new GameScreen(process);
  const gameEngine = new GameEngine(process, settings.CLOCK_CYCLE, [
    startScreen,
    gameScreen,
  ]);

  // Start the main function.
  checkSize();

  // On process changes.
  process.stdout.on("resize", checkSize);
  process.on("exit", () => {
    console.log(
      settings.ASCII_RESET + "\nQuitting node pong" + settings.SHOW_CURSOR
    );
  });

  /**
   * Displays the game screen.
   * @param {GameEngine} gameEngine The game engine.
   */
  function startGame(gameEngine) {
    gameEngine.setCurrentScreen("GameScreen");
  }

  /**
   * Displays the help screen.
   * @param {GameEngine} gameEngine The game engine.
   */
  function displayHelp(gameEngine) {
    console.log("help");
    // gameEngine.setCurrentScreen("HelpScreen");
  }

  /**
   * Exits the program.
   */
  function exitProgram() {
    process.exit();
  }

  /**
   * Checks if the process screen is at a proper size and starts/stops the game
   * engine.
   */
  function checkSize() {
    if (
      process.stdout.rows >= settings.MIN_ROW + 1 &&
      process.stdout.columns >= settings.MIN_COLUMN
    ) {
      gameEngine.start();
    } else {
      gameEngine.stop();
      process.stdout.write(settings.CLEAR_TERMINAL);
      console.log(
        `The terminal size is too small. A minimum of ${settings.MIN_COLUMN}x${
          settings.MIN_ROW + 1
        } character size is needed to play pong.`
      );
    }
  }
}

main();
