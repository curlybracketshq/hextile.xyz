'use strict';

(function () {
  // See http://www.z-e-b-u.com/paintings.html
  var ZEBU_COLORS = [
    { r: 248, g: 248, b: 250 }, // white
    { r: 248, g: 243, b: 82 }, // yellow
    { r: 237, g: 111, b: 2 }, // orange
    { r: 235, g: 55, b: 40 }, // red
    { r: 247, g: 146, b: 155 }, // pink
    { r: 171, g: 120, b: 178 }, // purple
    { r: 32, g: 64, b: 177 }, // blue
    { r: 196, g: 198, b: 246 }, // light blue
    { r: 63, g: 185, b: 187 }, // sky blue
    { r: 149, g: 152, b: 159 }, // grey
    { r: 56, g: 100, b: 68 }, // green
    { r: 112, g: 128, b: 109 }, // olive
    { r: 156, g: 183, b: 156 }, // light green
    { r: 124, g: 68, b: 66 }, // brown
    { r: 225, g: 200, b: 179 }, // dove
    { r: 29, g: 26, b: 29 }, // black
  ];
  var SVG = document.getElementById('bg');

  function randInt(upper) {
    return Math.floor(Math.random() * upper);
  };

  function randColor() {
    return { r: randInt(256), g: randInt(256), b: randInt(256) };
  }

  function sample(array) {
    return array[randInt(array.length)];
  }

  function colorString(c) {
    return 'rgb(' + c.r + ', ' + c.g + ', ' + c.b + ')';
  }

  // See https://www.w3.org/TR/WCAG20/#relativeluminancedef
  function relativeLuminance(c) {
    var rs = c.r / 255;
    var gs = c.g / 255;
    var bs = c.b / 255;
    var rr = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    var gg = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    var bb = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
    return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
  }

  function findHighContrastColor(backgroundColor) {
    var c = 10;
    var backgroundColorRL = relativeLuminance(backgroundColor);
    var maxContrast = -1;
    var color, colorRL, l1, l2, contrast, bestColor;
    while (c > 0) {
      color = sample(ZEBU_COLORS);
      colorRL = relativeLuminance(color);
      // See https://www.w3.org/TR/WCAG20/#contrast-ratiodef
      l1 = Math.max(backgroundColorRL, colorRL);
      l2 = Math.min(backgroundColorRL, colorRL);
      contrast = (l1 + 0.05) / (l2 + 0.05);
      if (contrast >= 4.5) {
        return color;
      }
      if (contrast > maxContrast) {
        maxContrast = contrast;
        bestColor = color;
      }
      c--;
    }
    return bestColor;
  }

  var backgroundColor = sample(ZEBU_COLORS);
  var textColor = findHighContrastColor(backgroundColor);
  var linkColor = findHighContrastColor(backgroundColor);
  document.body.style.color = colorString(textColor);
  var links = document.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].style.color = colorString(linkColor);
  }

  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('fill', colorString(backgroundColor));
  rect.setAttribute('x', 0);
  rect.setAttribute('y', 0);
  rect.setAttribute('width', '100%');
  rect.setAttribute('height', '100%');
  SVG.append(rect);
}());