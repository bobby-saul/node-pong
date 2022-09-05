const MenuScreen = require("./MenuScreen");
const MenuItem = require("./MenuItem");
const settings = require("./settings");

class StartScreen extends MenuScreen {
  constructor(process) {
    const onePlayerMenuItem = new MenuItem("One Player");
    const twoPlayersMenuItem = new MenuItem("Two Players");
    const helpMenuItem = new MenuItem("Help");
    const settingsMenuItem = new MenuItem("Settings");
    const quitMenuItem = new MenuItem("Quit", process.exit);
    super(
      process,
      "StartScreen",
      [
        onePlayerMenuItem,
        twoPlayersMenuItem,
        helpMenuItem,
        settingsMenuItem,
        quitMenuItem,
      ],
      settings.WHITE + "Node Pong - Start Screen"
    );

    onePlayerMenuItem.setOnSelect(this.playOnePlayer.bind(this));
    twoPlayersMenuItem.setOnSelect(this.playTwoPlayers.bind(this));
    settingsMenuItem.setOnSelect(this.settings.bind(this));
    helpMenuItem.setOnSelect(this.help.bind(this));
  }

  playOnePlayer() {
    this.gameEngine.setCurrentScreen("GameScreen", {
      restart: true,
      players: 1,
    });
  }
  playTwoPlayers() {
    this.gameEngine.setCurrentScreen("GameScreen", {
      restart: true,
      players: 2,
    });
  }
  help() {
    this.gameEngine.setCurrentScreen("HelpScreen", {
      backScreen: "StartScreen",
    });
  }
  settings() {
    this.gameEngine.setCurrentScreen("SettingsScreen");
  }
}

module.exports = StartScreen;
