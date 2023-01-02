import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { getImg } from "../../../../../../utils/bannerHelpers";

const propTypes = {
  leagueName: PropTypes.string.isRequired,
  matchId: PropTypes.number.isRequired,
  playerLeft: PropTypes.string.isRequired,
  playerRight: PropTypes.string.isRequired,
  sportCode: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

const MatchOverview = ({ leagueName, matchId, playerLeft, playerRight, sportCode, time }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["event-match"]} style={{ backgroundImage: `url(${getImg(sportCode)})` }}>
      <div className={classes["event-match__top"]}>
        <h3 className={classes["event-match__title"]}>{leagueName}</h3>
        {/* <div className={classes["event-match__reload"]}> */}
        {/*  <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"> */}
        {/*    <g> */}
        {/*      <g> */}
        {/*        <path d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 0 16c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0z" /> */}
        {/*      </g> */}
        {/*    </g> */}
        {/*  </svg> */}
        {/*  /!* <span>{199}</span> *!/ */}
        {/* </div> */}
      </div>
      <div className={classes["event-match__score"]}>
        <span className={classes["event-match__team"]}>{playerLeft}</span>
        <div className={classes["event-match__versus"]}>
          -&nbsp;
          <span>Vs</span>
          &nbsp;-
        </div>
        <span className={classes["event-match__team"]}>{playerRight}</span>
      </div>
      <span className={classes["event-match__date"]}>{`${t("city.live_schedule.starts_at")} ${time}`}</span>
    </div>
  );
};

MatchOverview.propTypes = propTypes;

export default MatchOverview;
