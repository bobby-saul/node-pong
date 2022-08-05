class MenuItem {
  /**
   * Creates a menu item for a menu screen.
   * @param {string} name The name for the menu item.
   * @param {function} onSelect The function to run if the menu item is
   * selected. The function will receive one parameter for the game engine.
   */
  constructor(name, onSelect) {
    this.name = name;
    this.onSelect = onSelect;
  }
}

module.exports = MenuItem;
