const ScreenInterface = require("./ScreenInterface");
class GameEngine {
  /**
   * Creates a game engine object.
   * @param {Process} process The node process.
   * @param {number} clockCycle Number of milliseconds between each clock tick.
   * @param {ScreenInterface[]} screens An array of ScreenInterface objects.
   */
  constructor(process, clockCycle, screens) {
    this.process = process;
    this.clockCycle = clockCycle;
    this.screens = screens;
    this.currentScreen = screens[0];
    this.clock;
    this.running = false;
  }

  /**
   * @param {string} str The string from the keypress.
   * @param {Key} key The key object.
   */
  onKeyPress(str, key) {
    this.currentScreen.onKeyPress(str, key);
  }

  start() {
    if (!this.running) {
      this.process.stdin.on("keypress", this.onKeyPress.bind(this));
      this.clock = setInterval(() => {
        this.currentScreen.onClockTick();
      }, this.clockCycle);
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      // this.process.stdin.off("keypress", this.onKeyPress);
      clearInterval(this.clock);
      this.running = false;
    }
  }
}

module.exports = GameEngine;
