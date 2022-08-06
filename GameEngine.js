const ScreenInterface = require("./ScreenInterface");
class GameEngine {
  /**
   * Creates a game engine object.
   * @param {Process} process The node process.
   * @param {number} clockCycle Number of milliseconds between each clock tick.
   * @param {ScreenInterface[]} screens An array of ScreenInterface objects.
   * @param {Object} startingState The starting state to pass to the first
   * screen.
   */
  constructor(process, clockCycle, screens, startingState) {
    this.process = process;
    this.clockCycle = clockCycle;
    this.screens = screens;
    this.currentScreen = screens[0];
    this.clock;
    this.running = false;

    this.screens.forEach((screen) => {
      screen.setGameEngine(this);
    });

    this.currentScreen.active(startingState);
  }

  /**
   * Sets the current screen for the game engine.
   * @param {string} screenName The name of the screen to set as the current
   * screen.
   * @param {Object} state Any state to pass into the screen.
   */
  setCurrentScreen(screenName, state) {
    this.currentScreen = this.screens.find((screen) => {
      return screen.name === screenName;
    });
    if (!this.currentScreen) {
      this.currentScreen = this.screens[0];
    }
    this.currentScreen.active(state);
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
      this.bindingKeypress = this.onKeyPress.bind(this);
      this.process.stdin.on("keypress", this.bindingKeypress);
      this.clock = setInterval(() => {
        this.currentScreen.onClockTick();
      }, this.clockCycle);
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      this.process.stdin.off("keypress", this.bindingKeypress);
      clearInterval(this.clock);
      this.running = false;
    }
  }
}

module.exports = GameEngine;
