import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { useGetMatchStatuses } from "../../../../../../../../../hooks/matchstatus-hooks";
import { getAuthLanguage } from "../../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigSportsBook } from "../../../../../../../../../redux/reselect/cms-selector";
import { setActiveMatchTracker } from "../../../../../../../../../redux/slices/liveSlice";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../utils/betslip-utils";
import { openLinkInNewWindow } from "../../../../../../../../../utils/misc";
import {
  MATCH_STATUS_STARTED,
  MATCH_TYPE_NO_TIME,
  MATCH_TYPE_REGULAR,
  MATCH_TYPE_REVERSE,
} from "../../../../../../../../vanillamobile/common/components/LiveEuropeanMatch/constants";
import LiveTableRowDropdownSpoiler from "../../../../../../../components/LiveTableRowDropdownSpoiler";
import {
  AFRICAN_MARKET_CRITERIA_MAPPING,
  AFRICAN_MARKET_OUTCOME_MAPPING,
  AFRICAN_OUTCOME_TYPE_OUTCOME,
  AFRICAN_OUTCOME_TYPE_SPREAD,
  AFRICAN_SPORT_MARKET_MAPPING,
} from "../../../../../../../../../utils/african-market/africanViewSportMarkets";

const StatIcon = () => (
  <svg height="18" viewBox="0 0 21 18" width="21" xmlns="http://www.w3.org/2000/svg">
    <g>
      <g>
        <path d="M15.524 12.353l4.58-7.637V18H-.03V.534h2.013v12.168L7.52 3.445l6.544 3.668L18.333 0l1.741.97-5.265 8.782-6.554-3.639-5.96 9.946h2.276l4.42-7.336z" />
      </g>
    </g>
  </svg>
);

const propTypes = {
  additionalMarketCount: PropTypes.number.isRequired,
  cMin: PropTypes.string,
  cPeriod: PropTypes.string.isRequired,
  cSec: PropTypes.string,
  cStatus: PropTypes.string.isRequired,
  cType: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  feedCode: PropTypes.string,
  hasMatchTracker: PropTypes.bool.isRequired,
  markets: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
  teamA: PropTypes.string.isRequired,
  teamAScore: PropTypes.string,
  teamB: PropTypes.string.isRequired,
  teamBScore: PropTypes.string,
};

const defaultProps = {
  cMin: undefined,
  cSec: undefined,
  feedCode: undefined,
  teamAScore: undefined,
  teamBScore: undefined,
};

const isOutcomeLabel = (outcomeType) => outcomeType === AFRICAN_OUTCOME_TYPE_OUTCOME;
const isOutcomeSpread = (outcomeType) => outcomeType === AFRICAN_OUTCOME_TYPE_SPREAD;
const isOutcomePrice = (outcomeType) => !isOutcomeLabel(outcomeType) && !isOutcomeSpread(outcomeType);

const getFactor = (outcomeType, market, outcome) => {
  if (isOutcomePrice(outcomeType)) {
    if (outcome) return outcome?.price;
  } else if (isOutcomeLabel(outcomeType)) {
    return outcome?.desc;
  } else if (isOutcomeSpread(outcomeType)) {
    if (market?.spread) {
      if (market?.spread2) {
        if (Math.abs(market.spread) < Math.abs(market.spread2)) {
          return `${market.spread},${market.spread2}`;
        }

        return `${market.spread2},${market.spread}`;
      }

      return market.spread;
    }

    return undefined;
  }

  return undefined;
};
const SportsTableRow = ({
  additionalMarketCount,
  cMin,
  cPeriod,
  cSec,
  cStatus,
  cType,
  eventId,
  feedCode,
  hasMatchTracker,
  markets,
  sportCode,
  teamA,
  teamAScore,
  teamB,
  teamBScore,
}) => {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [min, setMin] = useState(cMin);
  const [sec, setSec] = useState(cSec);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const language = useSelector(getAuthLanguage);

  const matchStatuses = useGetMatchStatuses(dispatch);

  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  const activeMatchTracker = useSelector((state) => state.live.activeMatchTracker);

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

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = useSelector(isDesktopCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);

      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  const currentPeriod = useMemo(
    () => (matchStatuses ? matchStatuses.find((period) => period.abbreviation === cPeriod)?.description : ""),
    [cPeriod, matchStatuses],
  );

  return (
    <>
      <tr className={classes["african-sports-table__row"]}>
        <td>
          <div className={classes["african-sports-table__matches"]}>
            <div className={classes["african-sports-table__time"]}>
              <span className={classes["african-sports-table__date"]}>
                {cStatus === "STARTED" && (
                  <span style={{ paddingRight: "5px" }}>
                    <FontAwesomeIcon icon={faPlay} />
                  </span>
                )}
                {cStatus === "PAUSED" && (
                  <span style={{ paddingRight: "5px" }}>
                    <FontAwesomeIcon icon={faPause} />
                  </span>
                )}
                {currentPeriod}
              </span>
              {cType !== MATCH_TYPE_NO_TIME && (
                <span className={classes["african-sports-table__date"]}>
                  {`${`0${min}`.slice(-2)}:${`0${sec}`.slice(-2)}`}
                </span>
              )}
              <span className={classes["african-sports-table__id"]}>{`id ${eventId}`}</span>
            </div>
            <div className={classes["african-sports-table__match"]}>
              <div className={classes["african-sports-table__result"]}>
                <span className={classes["african-sports-table__team"]}>{teamA}</span>
                <span className={classes["african-sports-table__score"]}>{teamAScore}</span>
              </div>
              <div className={classes["african-sports-table__result"]}>
                <span
                  className={cx(
                    classes["african-sports-table__team"],
                    classes["african-sports-table__team_highlighted"],
                  )}
                >
                  {teamB}
                </span>
                <span className={classes["african-sports-table__score"]}>{teamBScore}</span>
              </div>
            </div>
          </div>
        </td>

        {/* Iterate through markets for this sport type...  */}
        {/* For each of them - check if we have a market for such criteria, else display empty */}

        {(AFRICAN_SPORT_MARKET_MAPPING[sportCode]
          ? AFRICAN_SPORT_MARKET_MAPPING[sportCode]
          : AFRICAN_SPORT_MARKET_MAPPING["DEFAULT"]
        ).map((marketType) => {
          const market = markets.find((market) => market.criteria === AFRICAN_MARKET_CRITERIA_MAPPING[marketType]);

          return AFRICAN_MARKET_OUTCOME_MAPPING[marketType].map((outcomeType, index) => {
            const outcomes = market ? market.sels : [];
            const outcome =
              market && !isOutcomeSpread(outcomeType) && outcomes.length - 1 >= index ? outcomes[index] : undefined;

            const factor = getFactor(outcomeType, market, outcome);

            return (
              <td
                align="center"
                className={cx(classes["african-sports-table__coeficient"], {
                  [classes["african-sports-table__coeficient_border"]]:
                    index === AFRICAN_MARKET_OUTCOME_MAPPING[marketType].length - 1,
                })}
                key={`${outcomeType}-${index}`}
              >
                {factor && (
                  <div
                    className={cx(
                      classes["african-sports-table__factor"],
                      {
                        [classes["african-sports-table__factor_spread"]]: isOutcomeSpread(outcomeType),
                      },
                      {
                        [classes["active"]]: betslipOutcomeIds.includes(outcome?.oId),
                        [classes["african-sports-table__factor_disabled"]]: outcome?.hidden || !market?.mOpen,
                      },
                    )}
                    onClick={() => isOutcomePrice(outcomeType) && toggleBetslipHandler(outcome.oId, eventId)}
                  >
                    {outcome?.dir === "<" && (
                      <span
                        className={cx(
                          classes["african-sports-table__triangle"],
                          classes["african-sports-table__triangle_red"],
                        )}
                      />
                    )}
                    {outcome?.dir === ">" && (
                      <span
                        className={cx(
                          classes["african-sports-table__triangle"],
                          classes["african-sports-table__triangle_green"],
                        )}
                      />
                    )}
                    {factor}
                  </div>
                )}
              </td>
            );
          });
        })}
        <td>
          <div className={classes["african-sports-table__icons"]}>
            <div
              className={cx(classes["african-sports-table__icon"], {
                [classes["active"]]: activeMatchTracker?.feedCode === feedCode,
                [classes["disabled"]]: !hasMatchTracker,
              })}
              onClick={() => dispatch(setActiveMatchTracker({ feedCode, sportCode }))}
            >
              <StatIcon />
            </div>
            {betradarStatsOn && betradarStatsURL && feedCode && (
              <div
                className={classes["african-sports-table__icon"]}
                onClick={() => openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${feedCode}`)}
              >
                <i className={classes["qicon-stats"]} />
              </div>
            )}
            <div
              className={cx(classes["african-sports-table__icon"], classes["african-sports-table__activator"], {
                [classes["active"]]: isDropdownOpened,
              })}
              onClick={() => setIsDropdownOpened((isOpened) => !isOpened)}
            >
              <span>{`+${additionalMarketCount}`}</span>
            </div>
          </div>
        </td>
      </tr>
      {isDropdownOpened && <LiveTableRowDropdownSpoiler eventId={eventId} isOpened={isDropdownOpened} />}
    </>
  );
};

SportsTableRow.propTypes = propTypes;
SportsTableRow.defaultProps = defaultProps;

export default SportsTableRow;
