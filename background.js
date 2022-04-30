'use strict';

(function () {
  var SVG = document.getElementById('bg');

  function randInt(upper) {
    return Math.floor(Math.random() * upper);
  };

  function randColor() {
    return colorString(randInt(256), randInt(256), randInt(256));
  };

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
      color = { r: randInt(256), g: randInt(256), b: randInt(256) };
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

  var backgroundColor = { r: randInt(256), g: randInt(256), b: randInt(256) };
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