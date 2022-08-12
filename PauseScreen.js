const MenuItem = require("./MenuItem");
const MenuScreen = require("./MenuScreen");
const settings = require("./settings");

class PauseScreen extends MenuScreen {
  constructor(process) {
    const resumeMenuItem = new MenuItem("Resume");
    const helpMenuItem = new MenuItem("Help");
    const restartMenuItem = new MenuItem("Restart");
    const quitMenuItem = new MenuItem("Quit Game");
    super(
      process,
      "PauseScreen",
      [resumeMenuItem, helpMenuItem, restartMenuItem, quitMenuItem],
      `${settings.WHITE}Node Pong - Pause`
    );
    resumeMenuItem.setOnSelect(this.resume.bind(this));
    helpMenuItem.setOnSelect(this.help.bind(this));
    restartMenuItem.setOnSelect(this.restart.bind(this));
    quitMenuItem.setOnSelect(this.quit.bind(this));
  }

  active(state) {
    this.position = 0;
    if (state) {
      this.message = `${settings.WHITE}Node Pong - Pause\n${
        settings.RED
      }Player 1: ${settings.WHITE + state.p1 + settings.GREEN} Player 2: ${
        settings.WHITE + state.p2 + settings.ASCII_RESET
      }`;
      console.log(state);
    }
  }

  resume() {
    this.gameEngine.setCurrentScreen("GameScreen");
  }
  restart() {
    this.gameEngine.setCurrentScreen("GameScreen", { restart: true });
  }
  help() {
    this.gameEngine.setCurrentScreen("HelpScreen", {
      backScreen: "PauseScreen",
    });
  }
  quit() {
    this.gameEngine.setCurrentScreen("StartScreen");
  }
}

module.exports = PauseScreen;
