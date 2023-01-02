import classes from "applications/citydesktop/scss/citywebstyle.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getAuthLanguage, getAuthTimezoneOffset } from "redux/reselect/auth-selector";
import { getLocaleDateDayNumberMonth } from "utils/date-format";
import { openLinkInNewWindow } from "utils/misc";

import { getCitySportIcon } from "../../../../../../../../utils/city/sporticon-utils";

const periodAndClock = (cType, cStatus, min) => {
  let clock = "";

  switch (cType) {
    case "NO_TIME":
      // switch (cStatus) {
      //     case 'NOT_STARTED':
      //         clock = 'About to Start';
      //         break;
      //     case 'END_OF_EVENT':
      //         clock = 'Ended';
      //         break;
      //     default:
      //         clock = cStatus.charAt(0).toUpperCase() + cStatus.slice(1).toLowerCase();
      //         break;
      // }
      break;
    // Do nothing for this kind of sports
    default:
      clock = `${`0${min}`.slice(-2)}m`;
      break;
  }

  return clock;
};

const DetailText = ({ epoch, live, periodScores, rowIndex, score, sportCode }) => {
  const timezoneOffset = useSelector(getAuthTimezoneOffset);
  const locale = useSelector(getAuthLanguage);
  const dayNumberMonth = useMemo(() => getLocaleDateDayNumberMonth(locale), [locale]);

  if (live) {
    if (sportCode !== "TENN") {
      return <span style={{ fontWeight: live ? 600 : 300 }}>{score}</span>;
    }

    const combinedPeriods = periodScores.map((periodScore, index) => (
      <span key={index} style={{ fontWeight: live ? 600 : 300, paddingLeft: "10px" }}>
        {periodScore}
      </span>
    ));

    return combinedPeriods;
  }

  // Prematch
  return (
    <span style={{ fontWeight: live ? 600 : 300 }}>
      {dayjs
        .unix(epoch / 1000)
        .utcOffset(timezoneOffset)
        .format(!rowIndex ? dayNumberMonth : "HH:mm")}
    </span>
  );
};

DetailText.propTypes = {
  epoch: PropTypes.number,
  index: PropTypes.number.isRequired,
  leagueAndCountryDesc: PropTypes.string,
  live: PropTypes.bool.isRequired,
  periodScores: PropTypes.array,
  rowIndex: PropTypes.number.isRequired,
  score: PropTypes.string,
  sportCode: PropTypes.string.isRequired,
};
const MatchEventDetailsContentHolder = ({
  a,
  aScore,
  b,
  brMatchId,
  cMin,
  cPeriod,
  cStatus,
  cType,
  epoch,
  eventId,
  hScore,
  hasRapidMarket,
  leagueAndCountryDesc,
  live,
  periodScores,
  sportCode,
}) => {
  const { t } = useTranslation();

  const image = getCitySportIcon(sportCode);

  const clock = live ? periodAndClock(cType, cStatus, cMin) : "";

  const history = useHistory();

  const onClickEventDetail = (eventId, live) => {
    if (live) {
      history.push(`/events/live/${eventId}`); // navigate to the new route...
    } else {
      history.push(`/events/prematch/${eventId}`); // navigate to the new route...
    }
  };

  return (
    <div className={classes["sports-spoiler__information"]} onClick={() => onClickEventDetail(eventId, live)}>
      <div className={classes["sports-spoiler__time"]}>
        <span className={classes["sports-spoiler__icon"]}>
          <img alt="icon" src={image} />
        </span>
        {live ? <div className={classes["sports-spoiler__part"]}>{`${cPeriod} ${clock}`}</div> : null}
      </div>
      <div className={classes["sports-spoiler__scores"]}>
        <small>{leagueAndCountryDesc}</small>
        <div className={classes["sports-spoiler__score"]}>
          <span>{a}</span>
          <DetailText
            epoch={epoch}
            index={0}
            live={live}
            periodScores={periodScores?.map((s) => s.hScore)}
            rowIndex={0}
            score={hScore}
            sportCode={sportCode}
          />
        </div>
        <div className={classes["sports-spoiler__score"]}>
          <span>{b}</span>
          <DetailText
            epoch={epoch}
            index={1}
            live={live}
            periodScores={periodScores?.map((s) => s.aScore)}
            rowIndex={1}
            score={aScore}
            sportCode={sportCode}
          />
        </div>
      </div>
      <div className={classes["sports-spoiler__figures"]}>
        <span
          className={`${classes["sports-spoiler__figure"]} ${classes["sports-spoiler__figure_statistic"]}`}
          onClick={() => openLinkInNewWindow(`https://s5.sir.sportradar.com/nobbaggu/ko/match/${brMatchId}`)}
        >
          <span className={classes["statistic-message"]}>{t("statistic_available")}</span>
          <svg fill="ffffff" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
            <path
              className={classes["sports-spoiler__figure-svg"]}
              d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
            />
            <path d="M10.3125 8.125H12.8123V14.3748H10.3125V8.125Z" fill="white" />
            <path d="M2.8125 10.625H5.31235V14.375H2.8125V10.625Z" fill="white" />
            <path d="M14.0625 5.625H16.5623V14.3751H14.0625V5.625Z" fill="white" />
            <path d="M6.5625 6.875H9.06239V14.375H6.5625V6.875Z" fill="white" />
          </svg>
        </span>
        {hasRapidMarket ? (
          <span className={`${classes["sports-spoiler__figure"]} ${classes["sports-spoiler__figure_markets"]}`}>
            <span className={classes["markets-message"]}>Rapid Markets Available!</span>
            <svg height="21" viewBox="0 0 20 21" width="20" xmlns="http://www.w3.org/2000/svg">
              <circle className={classes["sports-spoiler__figure-svg"]} cx="10" cy="10.6367" r="10" />
              <g clipPath="url(#clip0)">
                <path d="M7.58203 11.0432H10.002V15.93L12.4178 10.2287H10.002V5.3418L7.58203 11.0432Z" fill="white" />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect fill="white" height="10.5882" transform="translate(4.70605 5.3418)" width="10.5882" />
                </clipPath>
              </defs>
            </svg>
          </span>
        ) : null}
      </div>
    </div>
  );
};

const propTypes = {
  a: PropTypes.string.isRequired,
  aScore: PropTypes.string,
  b: PropTypes.string.isRequired,
  brMatchId: PropTypes.string,
  cMin: PropTypes.number,
  cPeriod: PropTypes.string,
  cStatus: PropTypes.string,
  cType: PropTypes.string,
  epoch: PropTypes.number,
  eventId: PropTypes.number.isRequired,
  hScore: PropTypes.string,
  hasRapidMarket: PropTypes.bool,
  live: PropTypes.bool.isRequired,
  periodScores: PropTypes.array,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {
  aScore: undefined,
  brMatchId: undefined,
  cMin: undefined,
  cPeriod: undefined,
  cStatus: undefined,
  cType: undefined,
  epoch: undefined,
  hScore: undefined,
  hasRapidMarket: false,
  periodScores: undefined,
};

MatchEventDetailsContentHolder.propTypes = propTypes;
MatchEventDetailsContentHolder.defaultProps = defaultProps;

export default React.memo(MatchEventDetailsContentHolder);
