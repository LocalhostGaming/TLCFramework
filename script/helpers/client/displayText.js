const hexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

const displayText = (text, justify, color, alpha, x, y) => {
  SetTextFont(4);
  SetTextWrap(0.0, 1.0);
  SetTextScale(1.0, 0.4);
  SetTextJustification(justify);

  const { r, g, b } = hexToRGB(color);
  SetTextColour(r, g, b, alpha);
  SetTextOutline();

  BeginTextCommandDisplayText('STRING');
  AddTextComponentSubstringPlayerName(text);
  EndTextCommandDisplayText(x, y);
};

export default displayText;
