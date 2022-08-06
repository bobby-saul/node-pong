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

  /**
   * Sets the menu items on select function.
   * @param {function} onSelect Function to set as the menu item's on select.
   */
  setOnSelect(onSelect) {
    this.onSelect = onSelect;
  }
}

module.exports = MenuItem;
