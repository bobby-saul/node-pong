const MenuScreen = require("./MenuScreen");
const settings = require("./settings");

class StartScreen extends MenuScreen {
  constructor(process, menuItems) {
    super(
      process,
      "StartScreen",
      menuItems,
      settings.WHITE + "Node Pong - Start Screen"
    );
  }
}

module.exports = StartScreen;
