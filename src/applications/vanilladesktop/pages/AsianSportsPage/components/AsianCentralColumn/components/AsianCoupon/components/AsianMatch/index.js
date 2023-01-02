import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useGetMatchStatuses } from "../../../../../../../../../../hooks/matchstatus-hooks";
import { getAuthLanguage } from "../../../../../../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../../../../../../redux/reselect/cms-selector";
import { setActiveMatchTracker } from "../../../../../../../../../../redux/slices/liveSlice";
import { openLinkInNewWindow } from "../../../../../../../../../../utils/misc";
import {
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../../../../../../../../vanillamobile/common/components/LiveEuropeanMatch/constants";
import LiveTableRowDropdownSpoiler from "../../../../../../../../components/LiveTableRowDropdownSpoiler";
import PrematchTableRowDropdownSpoiler from "../../../../../../../../components/PrematchTableRowDropdownSpoiler";
import classes from "../../../../../../../../scss/vanilladesktop.module.scss";
import {
  ASIAN_MARKET_CRITERIA_MAPPING,
  ASIAN_MARKET_OUTCOME_MAPPING,
  ASIAN_MARKET_TYPE_1x2,
  ASIAN_MARKET_TYPE_ML,
} from "../../../../../../../../../../utils/asian-view/asianViewSportMarkets";
import { ASIAN_VIEW_TYPE_DOUBLE, OPPONENT_A_FAVOURITE, OPPONENT_B_FAVOURITE } from "../../constants";

import MarketCell from "./components/MarketCell";
import GenericSingleAsianMarket from "./components/MarketCell/components/Market/Single/GenericSingleAsianMarket";

const AsianMatch = ({
  a,
  aScore,
  b,
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  eventId,
  feedCode,
  hScore,
  hasDraw,
  hasMatchTracker,
  hasNone,
  live,
  marketCount,
  marketTypes,
  markets,
  sportCode,
  startTime,
  viewType,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const language = useSelector(getAuthLanguage);
  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;
  const matchStatuses = useGetMatchStatuses(dispatch);

  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  // keep updated if the props evolve...
  useEffect(() => {
    setSec(cSec);
  }, [cSec]);

  useEffect(() => {
    function tickClocks() {
      switch (cType) {
        case MATCH_TYPE_REGULAR:
          if (cStatus === MATCH_STATUS_STARTED) {
            if (sec < 59) {
              setSec(sec + 1);
            } else {
              setSec(0);
              setMin(min + 1);
            }
          }
          break;
        case MATCH_TYPE_REVERSE:
          if (cStatus === MATCH_STATUS_STARTED) {
            if (sec > 0) {
              setSec(sec - 1);
            } else if (min > 0) {
              setSec(59);
              setMin(min - 1);
            }
          }
          break;
        default:
          break;
      }
    }
    const intervalId = setInterval(tickClocks, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [cStatus, cType, min, sec]);

  const favouriteOpponent = useMemo(() => {
    const mlMarket = markets.find((market) =>
      [
        ASIAN_MARKET_CRITERIA_MAPPING[ASIAN_MARKET_TYPE_1x2],
        ASIAN_MARKET_CRITERIA_MAPPING[ASIAN_MARKET_TYPE_ML],
      ].includes(market.criteria),
    );
    if (mlMarket?.outcomes?.length >= 2) {
      const outcomeHome = mlMarket.outcomes[0];
      const outcomeAway = mlMarket.outcomes[mlMarket.outcomes.length - 1];
      if (outcomeHome.decimalPrice > outcomeAway.decimalPrice) {
        return OPPONENT_B_FAVOURITE;
      }

      return OPPONENT_A_FAVOURITE;
    }

    return undefined;
  }, [markets]);

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <>
      <tr
        className={cx(classes["asian-sports-table__row"], {
          [classes["asian-sports-table__row_live"]]: live,
        })}
        key={eventId}
      >
        {!live && (
          <td>
            <div className={classes["asian-sports-table__time"]}>
              <span className={classes["asian-sports-table__date"]}>{startTime.format("MMMM D")}</span>
              <span className={classes["asian-sports-table__date"]}>{startTime.format("hh:mm A")}</span>
            </div>
          </td>
        )}
        {live && (
          <td>
            <div className={classes["asian-sports-table__time"]}>
              {cStatus === "STARTED" && <FontAwesomeIcon icon={faPlay} />}
              {cStatus === "PAUSED" && <FontAwesomeIcon icon={faPause} />}

              <span className={classes["asian-sports-table__half"]}>{currentPeriod}</span>
              {cType !== MATCH_TYPE_NO_TIME && (
                <span className={classes["asian-sports-table__date"]}>
                  {`${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`}
                </span>
              )}
            </div>
          </td>
        )}
        <td className={classes["asian-sports-table__matches"]}>
          <div className={classes["asian-sports-table__match"]}>
            <div className={classes["asian-sports-table__result"]}>
              <span
                className={cx(classes["asian-sports-table__team"], {
                  [classes["asian-sports-table__team_highlighted"]]: favouriteOpponent === OPPONENT_A_FAVOURITE,
                })}
              >
                {a}
              </span>
              {live && hScore && <span className={classes["asian-sports-table__score"]}>{hScore}</span>}
            </div>
            <div className={classes["asian-sports-table__result"]}>
              <span
                className={cx(classes["asian-sports-table__team"], {
                  [classes["asian-sports-table__team_highlighted"]]: favouriteOpponent === OPPONENT_B_FAVOURITE,
                })}
              >
                {b}
              </span>
              {live && aScore && <span className={classes["asian-sports-table__score"]}>{aScore}</span>}
            </div>
            {hasDraw && viewType === ASIAN_VIEW_TYPE_DOUBLE && (
              <div className={classes["asian-sports-table__result"]}>
                <span className={classes["asian-sports-table__draw"]}>{t("draw")}</span>
              </div>
            )}
            {hasNone && (
              <div className={classes["asian-sports-table__result"]}>
                <span className={classes["asian-sports-table__draw"]}>{t("none")}</span>
              </div>
            )}
          </div>
        </td>
        {marketTypes.map((marketType) =>
          marketType.marketGroup.map((asianMarket) => {
            const market = markets.find((market) => market.criteria === ASIAN_MARKET_CRITERIA_MAPPING[asianMarket]);

            if (viewType === ASIAN_VIEW_TYPE_DOUBLE) {
              // double view
              return (
                <MarketCell
                  asianMarket={asianMarket}
                  centered={!hasDraw && !hasNone}
                  eventId={eventId}
                  key={`${eventId}-${asianMarket}`}
                  market={market}
                />
              );
            }

            // single view
            return (
              <GenericSingleAsianMarket
                eventId={eventId}
                hasSpread={asianMarket.endsWith("HDP") || asianMarket.endsWith("OU")}
                key={`${eventId}-${asianMarket}`}
                market={market}
                selectionCount={
                  ASIAN_MARKET_OUTCOME_MAPPING[asianMarket].length
                  // +  (asianMarket.endsWith("HDP") || asianMarket.endsWith("OU") ? 1 : 0)
                }
              />
            );
          }),
        )}
        <td>
          <div className={cx(classes["asian-sports-table__icons"], classes["asian-sports-table__icons_compressed"])}>
            <div>
              <div
                className={classes["asian-sports-table__icon"]}
                onClick={() => setIsDropdownOpened((isOpened) => !isOpened)}
              >
                <span>{`+${marketCount - markets.length}`}</span>
              </div>
            </div>
            <div style={{ paddingBottom: "5px" }}>
              {!live && betradarStatsOn && betradarStatsURL && feedCode && (
                <div
                  className={classes["asian-sports-table__icon"]}
                  onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${feedCode}`)}
                >
                  <i className={classes["qicon-stats"]} />
                </div>
              )}
              {live && (
                <div
                  className={cx(classes["asian-sports-table__icon"], { [classes["disabled"]]: !hasMatchTracker })}
                  onClick={() => dispatch(setActiveMatchTracker({ feedCode, sportCode }))}
                >
                  <i className={classes["qicon-match-tracker"]} />
                </div>
              )}
              {/* <div className={classes["asian-sports-table__icon"]}> */}
              {/*  <i className={classes["qicon-video-camera"]} /> */}
              {/* </div> */}
            </div>
          </div>
        </td>
      </tr>

      {!live && isDropdownOpened && <PrematchTableRowDropdownSpoiler eventId={eventId} isOpened={isDropdownOpened} />}
      {live && isDropdownOpened && <LiveTableRowDropdownSpoiler eventId={eventId} isOpened={isDropdownOpened} />}
    </>
  );
};

const propTypes = {
  a: PropTypes.string.isRequired,
  aScore: PropTypes.string,
  b: PropTypes.string.isRequired,
  cMin: PropTypes.number,
  cPeriod: PropTypes.string,
  cSec: PropTypes.number,
  cStatus: PropTypes.string,
  cType: PropTypes.string,
  eventId: PropTypes.number.isRequired,
  feedCode: PropTypes.string,
  hScore: PropTypes.string,
  hasDraw: PropTypes.bool.isRequired,
  hasMatchTracker: PropTypes.bool.isRequired,
  hasNone: PropTypes.bool.isRequired,
  live: PropTypes.bool.isRequired,
  marketCount: PropTypes.number.isRequired,
  marketTypes: PropTypes.array.isRequired,
  markets: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
  startTime: PropTypes.object.isRequired,
  viewType: PropTypes.string.isRequired,
};
const defaultProps = {
  aScore: undefined,
  cMin: undefined,
  cPeriod: undefined,
  cSec: undefined,
  cStatus: undefined,
  cType: undefined,
  feedCode: undefined,
  hScore: undefined,
};

AsianMatch.propTypes = propTypes;
AsianMatch.defaultProps = defaultProps;

export default React.memo(AsianMatch);
