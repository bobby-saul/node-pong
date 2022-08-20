#!/usr/bin/env node

const process = require("process");
const readline = require("readline");
const settings = require("./settings");
const GameEngine = require("./GameEngine");
const GameScreen = require("./GameScreen");
const StartScreen = require("./StartScreen");
const HelpScreen = require("./HelpScreen");
const PauseScreen = require("./PauseScreen");
const GameOverScreen = require("./GameOverScreen");

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
process.nodePong = {
  difficulty: settings.EASY,
};

function main() {
  // Global variables
  const startScreen = new StartScreen(process);
  const gameScreen = new GameScreen(process);
  const helpScreen = new HelpScreen(process);
  const pauseScreen = new PauseScreen(process);
  const gameOverScreen = new GameOverScreen(process);
  const gameEngine = new GameEngine(process, settings.CLOCK_CYCLE, [
    startScreen,
    gameScreen,
    helpScreen,
    pauseScreen,
    gameOverScreen,
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
