import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { setActiveMatchTracker } from "../../../../../../../../../redux/slices/liveSlice";
import { MATCH_STATUS_END_OF_EVENT } from "../../../../../../../../vanillamobile/common/components/LiveEuropeanMatch/constants";
import {
  AFRICAN_MARKET_OUTCOME_MAPPING,
  AFRICAN_SPORT_MARKET_MAPPING,
} from "../../../../../../../../../utils/african-market/africanViewSportMarkets";
import LeagueHeading from "../../LeagueHeading";
import SportsTableRow from "../SportsTableRow";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Sort `liveMatches` by `epDesc` and `opADesc`
function compareLiveMatches(liveMatchLeft, liveMatchRight) {
  if (liveMatchLeft.epDesc > liveMatchRight.epDesc) {
    return 1;
  }
  if (liveMatchLeft.epDesc < liveMatchRight.epDesc) {
    return -1;
  }
  if (liveMatchLeft.opADesc > liveMatchRight.opADesc) {
    return 1;
  }
  if (liveMatchLeft.opADesc < liveMatchRight.opADesc) {
    return -1;
  }

  return 0;
}

const propTypes = {
  filteredSportCode: PropTypes.string,
};

const defaultProps = {
  filteredSportCode: undefined,
};

const SportsTable = ({ filteredSportCode }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);
  const africanDashboardLiveData = useSelector((state) => state.live.liveData["african-dashboard"]);

  // Mark the first available event for match tracker display
  useEffect(() => {
    if (!activeMatchTracker && africanDashboardLiveData && Object.keys(africanDashboardLiveData).length > 0) {
      const sportsEntries = Object.entries(africanDashboardLiveData);
      for (let i = 0; i < sportsEntries.length; i += 1) {
        const sport = sportsEntries[i][0];
        const matches = Object.values(sportsEntries[i][1])
          .filter((x) => x.hasMatchTracker)
          .sort(compareLiveMatches);
        if (matches.length > 0) {
          dispatch(setActiveMatchTracker({ feedCode: matches[0].feedCode, sportCode: sport }));
          break;
        }
      }
    }
  }, [activeMatchTracker, africanDashboardLiveData, setActiveMatchTracker]);

  if (!africanDashboardLiveData)
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );

  return Object.entries(africanDashboardLiveData).map((sportEntry) => {
    const sportCode = sportEntry[0];
    const sportMatches = Object.values(sportEntry[1])
      .filter((match) => match.cStatus !== MATCH_STATUS_END_OF_EVENT)
      .sort(compareLiveMatches);

    if (sportMatches.length === 0) return null;
    if (filteredSportCode && sportCode !== filteredSportCode) return null;

    const groupedMatchesbyLeague = sportMatches.reduce((r, a) => {
      r[a.epDesc] = r[a.epDesc] || [];
      r[a.epDesc].push(a);

      return r;
    }, Object.create(null));

    return (
      <div className={classes["central-section__content"]} key={sportCode}>
        <LeagueHeading sportCode={sportCode} />
        <div className={classes["african-sports-table"]}>
          <table>
            <thead>
              <tr className={classes["african-sports-table__labels"]}>
                <th rowSpan="2">{t(`live_calendar_head_labels.event`)}</th>

                {(AFRICAN_SPORT_MARKET_MAPPING[sportCode]
                  ? AFRICAN_SPORT_MARKET_MAPPING[sportCode]
                  : AFRICAN_SPORT_MARKET_MAPPING["DEFAULT"]
                ).map((marketType) => (
                  <th colSpan={AFRICAN_MARKET_OUTCOME_MAPPING[marketType].length} key={marketType}>
                    {t(`vanilladesktop.marketType.${marketType}`)}
                  </th>
                ))}
                <th rowSpan="2">{t("more")}</th>
              </tr>
              <tr className={classes["african-sports-table__sublabels"]}>
                {(AFRICAN_SPORT_MARKET_MAPPING[sportCode]
                  ? AFRICAN_SPORT_MARKET_MAPPING[sportCode]
                  : AFRICAN_SPORT_MARKET_MAPPING["DEFAULT"]
                ).map((marketType, index) =>
                  AFRICAN_MARKET_OUTCOME_MAPPING[marketType].map((outcomeType, index2) => (
                    <th key={`${index}-${index2}`}>{t(`vanilladesktop.outcomeType.${outcomeType}`)}</th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedMatchesbyLeague).map((matchGroupEntry) => {
                const pathDescription = matchGroupEntry[0];
                const thisPathMatches = matchGroupEntry[1];

                return (
                  <React.Fragment key={pathDescription}>
                    <tr>
                      <td className={classes["african-sports-table__title"]} colSpan="16">
                        <span>
                          {pathDescription
                            .substr(0, pathDescription.length - 2)
                            .trim()
                            .replace("/", ":")}
                        </span>
                      </td>
                    </tr>

                    {thisPathMatches.map((match) => (
                      <SportsTableRow
                        additionalMarketCount={
                          match?.mCount && match.marketViews["DEFAULT"]
                            ? match.mCount - match.marketViews["DEFAULT"].length
                            : 0
                        }
                        cMin={match.cMin}
                        cPeriod={match.cPeriod}
                        cSec={match.cSec}
                        cStatus={match.cStatus}
                        cType={match.cType}
                        eventId={match.eventId}
                        feedCode={
                          match.feedCode ? match.feedCode.split(":")[match.feedCode.split(":").length - 1] : undefined
                        }
                        hasMatchTracker={match.hasMatchTracker}
                        key={match.eventId}
                        markets={match.marketViews["DEFAULT"]}
                        sportCode={sportCode}
                        teamA={match.opADesc}
                        teamAScore={match.hScore}
                        teamB={match.opBDesc}
                        teamBScore={match.aScore}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  });
};

SportsTable.propTypes = propTypes;
SportsTable.defaultProps = defaultProps;

export default SportsTable;
