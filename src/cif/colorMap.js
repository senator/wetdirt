/* Temporary global color map */

var colorMap = {
  alarm: {color: "red", bold: true},
  warning: {color: "yellow"},
  info: {},
  debug: {color: "cyan"}
};

function colorer(name, cursor, text) {
  if (!(name in colorMap))
    return;

  if (colorMap[name].color)
    cursor[colorMap[name].color]();
  if (colorMap[name].bold)
    cursor.bold();

  cursor.write(text);
}

module.exports = {
  colorer,

  alarm: colorer.bind(null, "alarm"),
  warning: colorer.bind(null, "warning"),
  info: colorer.bind(null, "info"),
  debug: colorer.bind(null, "debug"),

  colorMap
};
