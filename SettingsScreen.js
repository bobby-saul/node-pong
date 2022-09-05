const MenuScreen = require("./MenuScreen");
const MenuItem = require("./MenuItem");
const settings = require("./settings");

class SettingsScreen extends MenuScreen {
  constructor(process) {
    const easyMenuItem = new MenuItem("Easy");
    const mediumMenuItem = new MenuItem("Medium");
    const hardMenuItem = new MenuItem("Hard");
    const backMenuItem = new MenuItem("Back");
    super(
      process,
      "SettingsScreen",
      [easyMenuItem, mediumMenuItem, hardMenuItem, backMenuItem],
      settings.WHITE + "Node Pong - Select Difficulty"
    );
    easyMenuItem.setOnSelect(this.setDifficulty.bind(this, settings.EASY));
    mediumMenuItem.setOnSelect(this.setDifficulty.bind(this, settings.MEDIUM));
    hardMenuItem.setOnSelect(this.setDifficulty.bind(this, settings.HARD));
    backMenuItem.setOnSelect(
      this.setDifficulty.bind(this, process.nodePong.difficulty)
    );
    this.easyMenuItem = easyMenuItem;
    this.mediumMenuItem = mediumMenuItem;
    this.hardMenuItem = hardMenuItem;
  }

  active() {
    this.easyMenuItem.setName(
      "Easy" + (this.process.nodePong.difficulty === settings.EASY ? " ✅" : "")
    );
    this.mediumMenuItem.setName(
      "Medium" +
        (this.process.nodePong.difficulty === settings.MEDIUM ? " ✅" : "")
    );
    this.hardMenuItem.setName(
      "Hard" + (this.process.nodePong.difficulty === settings.HARD ? " ✅" : "")
    );
  }

  setDifficulty(difficulty) {
    process.nodePong.difficulty = difficulty;
    this.gameEngine.setCurrentScreen("StartScreen");
  }
}

module.exports = SettingsScreen;
