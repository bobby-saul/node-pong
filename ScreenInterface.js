class ScreenInterface {
  /**
   * Constructing function for the Screen Interface.
   * @param {object} process A node process.
   */
  constructor(process) {
    this.name = "ScreenInterface";
    this.process = process;
    this.width = process.stdout.columns;
    this.height = process.stdout.rows;
  }

  /**
   * Function to called when terminal is resized.
   */
  onResize() {
    this.width = this.process.stdout.columns;
    this.height = this.process.stdout.rows;
  }

  /**
   * Function to run when the standard input receives a keypress event.
   * @param {string} str The string of the keypress event.
   * @param {object} key The key object of the key being pressed.
   */
  onKeyPress(str, key) {
    if (key.ctrl && key.name === "c") {
      this.process.exit();
    }
  }

  /**
   * Function that runs once every time the clock cycles.
   */
  onClockTick() {
    this.drawScreen();
  }

  /**
   * Function that draws the screen.
   */
  drawScreen() {}
}

module.exports = ScreenInterface;
