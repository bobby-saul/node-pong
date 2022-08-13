const MenuItem = require("./MenuItem");
const MenuScreen = require("./MenuScreen");
const settings = require("./settings");

class GameOverScreen extends MenuScreen {
  constructor(process) {
    const rematchGameItem = new MenuItem("Rematch");
    const quitMenuItem = new MenuItem("Home Screen");
    super(
      process,
      "GameOverScreen",
      [rematchGameItem, quitMenuItem],
      `${settings.WHITE}Node Pong - Game Over`
    );
    rematchGameItem.setOnSelect(this.rematch.bind(this));
    quitMenuItem.setOnSelect(this.quit.bind(this));
  }

  active(state) {
    this.position = 0;
    if (state) {
      this.message = `${settings.WHITE}Node Pong - Game Over\n${
        state.p1 > state.p2
          ? settings.RED + "Player 1"
          : settings.GREEN + "Player 2"
      }${settings.WHITE} won!\n${settings.RED}Player 1: ${
        settings.WHITE + state.p1 + settings.GREEN
      } Player 2: ${settings.WHITE + state.p2 + settings.ASCII_RESET}`;
      console.log(state);
    }
  }
  rematch() {
    this.gameEngine.setCurrentScreen("GameScreen", { restart: true });
  }
  quit() {
    this.gameEngine.setCurrentScreen("StartScreen");
  }
}

module.exports = GameOverScreen;
