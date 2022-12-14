const path = require("path");

module.exports = {
  CLOCK_CYCLE: 80,
  MIN_ROW: 15,
  MIN_COLUMN: 50,
  CLEAR_TERMINAL: "\033c",
  BLACK_BACKGROUND: "\x1b[40m",
  RED: "\x1b[91m",
  GREEN: "\x1b[92m",
  WHITE: "\x1b[97m",
  ASCII_RESET: "\x1b[0m",
  SOUND: "\x07",
  HIDE_CURSOR: "\x1b[?25l",
  SHOW_CURSOR: "\x1b[?25h",
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  CONFIG_FILE: path.resolve("./config.json"),
};
