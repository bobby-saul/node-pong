#!/usr/bin/env node

/*
TODO:
  - start screen
    - mode 1 player or 2 player
    - help
      - keys
    - quite

  - game
    - show score
    - pause
    - move player 1
    - move player 2
    - move ball
    - when score
    - when game over
    - computer for 1 player

  - pause screen
    - score
    - resume
    - reset
    - help
    - quit
*/

const process = require("process");
const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}

const CLOCK_CYCLE = 100;
const MIN_ROW = 15;
const MIN_COLUMN = 50;
const BLACK_BACKGROUND = "\x1b[40m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const WHITE = "\x1b[37m";
const ASCII_RESET = "\x1b[0m";

function main() {
  // Global variables
  let largeEnough = checkSize();
  let playing = largeEnough;
  const ballPosition = {
    x: Math.floor(MIN_COLUMN / 2),
    y: Math.floor(MIN_ROW / 2),
    direction: Math.random() > 0.5 ? 1 : -1,
    angle: 0,
  };
  let p1Position = Math.floor(MIN_ROW / 2);
  let p1Direction = 0;
  let p2Position = Math.floor(MIN_ROW / 2);
  let p2Direction = 0;

  // Main process
  const clock = setInterval(() => {
    // Move
    if (playing) {
      movePieces();
    }
    // Draw screen
    drawScreen();
  }, CLOCK_CYCLE);

  // On resize
  process.stdout.on("resize", () => {
    largeEnough = checkSize();
    if (!largeEnough) {
      playing = false;
    }
  });

  // On keypress
  process.stdin.on("keypress", (str, key) => {
    if (key.ctrl && key.name === "c") {
      process.exit();
    } else {
      // console.log(`You pressed the "${str}" key`);
      // console.log();
      // console.log(key);
      // console.log();

      switch (key.name) {
        case "w":
          p1Direction = 1;
          break;
        case "s":
          p1Direction = -1;
          break;
        case "up":
          p2Direction = 1;
          break;
        case "down":
          p2Direction = -1;
          break;
        default:
          break;
      }
    }
  });

  process.on("exit", () => {
    clearInterval(clock);
    console.log(ASCII_RESET + "Quitting node pong");
  });

  // Functions
  function checkSize() {
    return (
      process.stdout.rows >= MIN_ROW && process.stdout.columns >= MIN_COLUMN
    );
  }

  function movePieces() {
    // Player one
    if (p1Direction === 1 && p1Position !== 2) {
      p1Position = p1Position - 1;
    } else if (p1Direction === -1 && p1Position !== MIN_ROW - 3) {
      p1Position = p1Position + 1;
    }
    p1Direction = 0;
    // Player two
    if (p2Direction === 1 && p2Position !== 2) {
      p2Position = p2Position - 1;
    } else if (p2Direction === -1 && p2Position !== MIN_ROW - 3) {
      p2Position = p2Position + 1;
    }
    p2Direction = 0;
    // Move ball
    // Check for goal
    // Check for bounce
  }

  function getBoundary() {
    const boundary = [];
    for (let rowIndex = 0; rowIndex < MIN_ROW; rowIndex++) {
      const row = [];
      for (let columnIndex = 0; columnIndex < MIN_COLUMN; columnIndex++) {
        if (columnIndex === 0 || columnIndex === MIN_COLUMN - 1) {
          row.push(WHITE + "|");
        } else if (rowIndex === 0 || rowIndex === MIN_ROW - 1) {
          row.push(WHITE + "-");
        } else {
          row.push(" ");
        }
      }
      boundary.push(row);
    }
    return boundary;
  }

  function drawScreen() {
    // Clear the screen first
    // process.stdout.cursorTo(0, -1);
    // process.stdout.clearScreenDown();
    // process.stdout.write("\x1Bc");
    // console.clear();
    // console.log("\033[2J");
    process.stdout.write("\033c");

    if (!largeEnough) {
      return console.log(
        `The terminal size is too small. A minimum of ${MIN_COLUMN}x${MIN_ROW} character size is needed to play pong.`
      );
    }

    const screen = getBoundary();
    // p1
    screen[p1Position][1] = RED + "|";
    screen[p1Position - 1][1] = RED + "|";
    screen[p1Position + 1][1] = RED + "|";
    // p2
    screen[p2Position][MIN_COLUMN - 2] = GREEN + "|";
    screen[p2Position - 1][MIN_COLUMN - 2] = GREEN + "|";
    screen[p2Position + 1][MIN_COLUMN - 2] = GREEN + "|";
    // ball
    screen[ballPosition.y][ballPosition.x] = WHITE + "O";

    screen.forEach((row) => {
      process.stdout.write(
        BLACK_BACKGROUND + row.join("") + ASCII_RESET + "\n"
      );
      // console.log(row.join(""));
    });
  }
}

main();