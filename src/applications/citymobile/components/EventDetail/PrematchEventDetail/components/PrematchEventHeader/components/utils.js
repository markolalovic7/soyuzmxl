import AMFB from "applications/citydesktop/img/background/AMFB.png";
import BASE from "applications/citydesktop/img/background/BASE.png";
import BASK from "applications/citydesktop/img/background/BASK.png";
import CRIC from "applications/citydesktop/img/background/CRIC.png";
import DEFAULT from "applications/citydesktop/img/background/default.png";
import FOOT from "applications/citydesktop/img/background/FOOT.png";
import GOLF from "applications/citydesktop/img/background/GOLF.png";
import HAND from "applications/citydesktop/img/background/HAND.png";
import ICEH from "applications/citydesktop/img/background/ICEH.png";
import TENN from "applications/citydesktop/img/background/TENN.png";
import VOLL from "applications/citydesktop/img/background/VOLL.png";

export const getBackgroundImageByCode = (code) => {
  switch (code) {
    case "AMFB":
      return AMFB;
    case "BASE":
      return BASE;
    case "BASK":
      return BASK;
    case "CRIC":
      return CRIC;
    case "DEFAULT":
      return DEFAULT;
    case "FOOT":
      return FOOT;
    case "GOLF":
      return GOLF;
    case "HAND":
      return HAND;
    case "ICEH":
      return ICEH;
    case "TENN":
      return TENN;
    case "VOLL":
      return VOLL;
    default:
      return DEFAULT;
  }
};
