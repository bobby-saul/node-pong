const ScreenInterface = require("./ScreenInterface");
const settings = require("./settings");

class MenuScreen extends ScreenInterface {
  /**
   * Creates a menu screen.
   * @param {process} process The main node process.
   * @param {string} menuName The name of the menu.
   * @param {MenuItem[]} menuItems An array of Menu Items.
   * @param {string} message A message to display with the menu.
   */
  constructor(process, menuName, menuItems, message) {
    super(process);
    this.position = 0;
    this.name = menuName;
    this.list = menuItems;
    this.message = message;
  }

  onKeyPress(str, key) {
    super.onKeyPress(str, key);
    switch (key.name) {
      case "up":
      case "w":
        if (this.position > 0) {
          this.position = this.position - 1;
        } else {
          this.position = this.list.length - 1;
        }
        break;
      case "s":
      case "down":
        if (this.position < this.list.length - 1) {
          this.position = this.position + 1;
        } else {
          this.position = 0;
        }
        break;
      case "return":
      case "space":
        this.list[this.position].onSelect(this.gameEngine);
        break;
      default:
        break;
    }
  }

  displayMessage() {
    console.log(settings.BLACK_BACKGROUND + this.message);
    const breakLength = Math.min(
      this.message.length,
      this.process.stdout.columns
    );
    console.log(new Array(breakLength).join("-"));
  }

  displayMenu() {
    this.list.forEach((listItem, index) => {
      let color = settings.WHITE;
      if (this.position === index) {
        color = settings.GREEN;
      }
      console.log(
        settings.BLACK_BACKGROUND + color + listItem.name + settings.ASCII_RESET
      );
    });
  }

  drawScreen() {
    // Clear the screen first
    this.process.stdout.write(settings.CLEAR_TERMINAL + settings.HIDE_CURSOR);
    this.displayMessage();
    this.displayMenu();
  }
}

module.exports = MenuScreen;
