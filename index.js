#!/usr/bin/env node

/*
TODO:
  - start screen
    - mode 1 player or 2 player
    - help
      - keys
    - quite

  - game
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
    - reset
    - help
    - quit
*/

const process = require("process");
const readline = require("readline");
const settings = require("./settings");
const GameScreen = require("./gameScreen");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

function main() {
  // Global variables
  let largeEnough = checkSize();
  const gameScreen = new GameScreen(process);
  let screen;
  changeScreens(gameScreen);

  // Main process
  const clock = setInterval(() => {
    if (largeEnough) {
      if (screen) {
        screen.onClockTick();
      }
    } else {
      process.stdout.write(settings.CLEAR_TERMINAL);
      console.log(
        `The terminal size is too small. A minimum of ${settings.MIN_COLUMN}x${
          settings.MIN_ROW + 1
        } character size is needed to play pong.`
      );
    }
  }, settings.CLOCK_CYCLE);
  process.stdout.on("resize", () => {
    largeEnough = checkSize();
    if (screen) {
      screen.onResize();
    }
  });
  process.stdin.on("keypress", (str, key) => {
    if (screen) {
      screen.onKeyPress(str, key);
    }
  });
  process.on("exit", () => {
    clearInterval(clock);
    console.log(
      settings.ASCII_RESET + "\nQuitting node pong" + settings.SHOW_CURSOR
    );
  });

  // Functions
  function checkSize() {
    return (
      process.stdout.rows >= settings.MIN_ROW + 1 &&
      process.stdout.columns >= settings.MIN_COLUMN
    );
  }
  function changeScreens(newScreen) {
    screen = newScreen;
  }
}

main();
