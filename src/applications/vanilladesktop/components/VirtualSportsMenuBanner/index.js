import KironBadmintonBackgroundImage from "applications/vanilladesktop/img/background/banner-badm.png";
import KironBasketballBackgroundImage from "applications/vanilladesktop/img/background/banner-bask.png";
import KironFootballBackgroundImage from "applications/vanilladesktop/img/background/banner-foot.jpeg";
import KironFootballLeagueBackgroundImage from "applications/vanilladesktop/img/background/banner-footleague.jpeg";
import KironGreyhoundBackgroundImage from "applications/vanilladesktop/img/background/banner-grey.png";
import KironHorseRacingBackgroundImage from "applications/vanilladesktop/img/background/banner-hors.png";
import KironCarRacingBackgroundImage from "applications/vanilladesktop/img/background/banner-mosp.png";
import KironTableTennisBackgroundImage from "applications/vanilladesktop/img/background/banner-tabl.png";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import BetradarBaseballBackgroundImage from "assets/img/virtual/betradar/virtual-base.jpeg";
import BetradarBasketballBackgroundImage from "assets/img/virtual/betradar/virtual-bask.jpeg";
import BetradarFootballBackgroundImage from "assets/img/virtual/betradar/virtual-foot.jpeg";
import BetradarTennisBackgroundImage from "assets/img/virtual/betradar/virtual-tenn.jpeg";
import cx from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import {
  BETRADAR_VIRTUAL_FEED_CODE_VBI,
  BETRADAR_VIRTUAL_FEED_CODE_VBL,
  BETRADAR_VIRTUAL_FEED_CODE_VTI,
} from "../../../../constants/betradar-virtual-sport-feed-code-types";
import {
  KIRON_VIRTUAL_FEED_CODE_BADM,
  KIRON_VIRTUAL_FEED_CODE_BASK,
  KIRON_VIRTUAL_FEED_CODE_CAR,
  KIRON_VIRTUAL_FEED_CODE_FFL,
  KIRON_VIRTUAL_FEED_CODE_FSM,
  KIRON_VIRTUAL_FEED_CODE_GREY,
  KIRON_VIRTUAL_FEED_CODE_HORS,
  KIRON_VIRTUAL_FEED_CODE_TABL,
} from "../../../../constants/kiron-virtual-sport-feed-code-types";

const propTypes = {
  code: PropTypes.string.isRequired,
  isNow: PropTypes.bool,
  label: PropTypes.string.isRequired,
  prefix: PropTypes.string.isRequired,
};

const defaultProps = {
  isNow: false,
};

const getBannerImage = (prefix, code) => {
  if (prefix === "krvirtual") {
    switch (code) {
      case KIRON_VIRTUAL_FEED_CODE_GREY:
        return KironGreyhoundBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_HORS:
        return KironHorseRacingBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_CAR:
        return KironCarRacingBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_BADM:
        return KironBadmintonBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_TABL:
        return KironTableTennisBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_BASK:
        return KironBasketballBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_FSM:
        return KironFootballBackgroundImage;
      case KIRON_VIRTUAL_FEED_CODE_FFL:
        return KironFootballLeagueBackgroundImage;
      default:
        return undefined;
    }
  } else {
    switch (code) {
      case BETRADAR_VIRTUAL_FEED_CODE_VBL:
        return BetradarBasketballBackgroundImage;
      case BETRADAR_VIRTUAL_FEED_CODE_VBI:
        return BetradarBaseballBackgroundImage;
      case BETRADAR_VIRTUAL_FEED_CODE_VTI:
        return BetradarTennisBackgroundImage;
      default:
        return BetradarFootballBackgroundImage;
    }
  }
};

const VirtualSportsMenuBanner = ({ code, isNow, label, prefix }) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <div
      className={cx(classes["banner"], {
        [classes["banner_grey"]]: isNow,
      })}
      onClick={() => history.push(`/${prefix}/${code}`)}
    >
      <img alt="code" src={getBannerImage(prefix, code)} />

      <div className={classes["banner__content"]}>
        <span className={classes["banner__title"]}>{label}</span>
        {isNow && <span className={classes["banner__button"]}>{t("vanilladesktop.watching_now")}</span>}
        {!isNow && <span className={classes["banner__text"]}>{t("vanilladesktop.starting_now")}</span>}
      </div>
    </div>
  );
};

VirtualSportsMenuBanner.propTypes = propTypes;
VirtualSportsMenuBanner.defaultProps = defaultProps;

export default VirtualSportsMenuBanner;
