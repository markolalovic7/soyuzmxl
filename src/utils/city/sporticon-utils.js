import DEFAULT_ICON from "assets/img/sports/city/SportIcons/all.png";

function importAll(r) {
  const images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "").replace(".png", "").toUpperCase()] = r(item);
  });

  return images;
}

const ICONS = Object.freeze(importAll(require.context("assets/img/sports/city/SportIcons", false, /\.(png)$/)));

export const getCitySportIcon = (sportCode) => {
  const icon = ICONS[sportCode];

  if (icon) return icon;

  return DEFAULT_ICON;
};
