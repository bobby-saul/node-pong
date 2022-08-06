const MenuItem = require("./MenuItem");
const MenuScreen = require("./MenuScreen");
const settings = require("./settings");

const HELP_TEXT = `${settings.WHITE}Node Pong - Help
---
Select 'One Player' to play against the computer and 'Two Players' to control both players.

The goal of pong is be the first to score 11 points and have a higher score than your opponent. Points are awarded when the ball reaches your opponents wall.

Move your paddle up and down using the 'w' and 's' keys for player 1 and the up and down arrows for player 2. The game can be paused by pressing the 'p' key.

(hint) The ball will bounce differently based on what part of the paddle it hits.`;

class HelpScreen extends MenuScreen {
  constructor(process) {
    const backMenuItem = new MenuItem("Back");
    super(process, "HelpScreen", [backMenuItem], HELP_TEXT);
    this.backMenuItem = backMenuItem;
    this.backScreen;
    this.savedState;
  }

  active(state) {
    // Set the states for the back function.
    this.backScreen = state.backScreen;
    this.savedState = state.saved;
    this.backMenuItem.setOnSelect(this.goBack.bind(this));
    // Draw the menu once.
    super.drawScreen();
  }

  goBack() {
    this.gameEngine.setCurrentScreen(this.backScreen, this.savedState);
  }

  // Don't keep reprinting so that you can scroll.
  drawScreen() {}
}

module.exports = HelpScreen;
