export default class ThemeManager {
  constructor(themeState) {
    this.themeState = themeState;
    this.colors = {};
  }

  loadColors(colorsJson) {
    const prefix = this.themeState === "light" ? "DAY" : "NIGHT";
    for (const key in colorsJson) {
      if (key.startsWith(prefix)) {
        const variableName = key.replace(`${prefix}_`, "");
        this.colors[variableName] = colorsJson[key];
      }
    }
  }

  applyColors() {
    const root = document.documentElement;
    for (const key in this.colors) {
      root.style.setProperty(
        `--${key.toLowerCase().replaceAll("_", "-")}`,
        this.colors[key]
      );
    }
  }
}
