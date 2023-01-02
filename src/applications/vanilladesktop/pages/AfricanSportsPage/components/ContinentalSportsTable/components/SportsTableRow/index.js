import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLanguage, getAuthLoggedIn } from "../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigSportsBook } from "../../../../../../../../redux/reselect/cms-selector";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import { openLinkInNewWindow } from "../../../../../../../../utils/misc";
import FavouriteMatchButton from "../../../../../../components/FavouriteMatchButton";
import PrematchTableRowDropdownSpoiler from "../../../../../../components/PrematchTableRowDropdownSpoiler";
import {
  AFRICAN_MARKET_CRITERIA_MAPPING,
  AFRICAN_MARKET_OUTCOME_MAPPING,
  AFRICAN_OUTCOME_TYPE_OUTCOME,
  AFRICAN_OUTCOME_TYPE_SPREAD,
  AFRICAN_OUTCOME_TYPE_UNDER,
  AFRICAN_SPORT_MARKET_MAPPING,
} from "../../../../../../../../utils/african-market/africanViewSportMarkets";

const propTypes = {
  additionalMarketCount: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  feedCode: PropTypes.string,
  markets: PropTypes.array.isRequired,
  sportCode: PropTypes.string.isRequired,
  teamA: PropTypes.string.isRequired,
  teamAScore: PropTypes.string,
  teamB: PropTypes.string.isRequired,
  teamBScore: PropTypes.string,
  time: PropTypes.string.isRequired,
};

const defaultProps = {
  feedCode: undefined,
  teamAScore: undefined,
  teamBScore: undefined,
};

const isOutcomeLabel = (outcomeType) => outcomeType === AFRICAN_OUTCOME_TYPE_OUTCOME;
const isOutcomeSpread = (outcomeType) => outcomeType === AFRICAN_OUTCOME_TYPE_SPREAD;
const isOutcomePrice = (outcomeType) => !isOutcomeLabel(outcomeType) && !isOutcomeSpread(outcomeType);

const getFactor = (outcomeType, outcome, outcomes) => {
  if (isOutcomePrice(outcomeType)) {
    if (outcome) return outcome?.price;
  } else if (isOutcomeLabel(outcomeType)) {
    return outcome?.desc;
  } else if (isOutcomeSpread(outcomeType)) {
    const secondOutcome = outcomes.find((outcome) => outcome.pos === 1);
    if (secondOutcome?.spread) {
      if (secondOutcome?.spread2) {
        if (Math.abs(secondOutcome.spread) < Math.abs(secondOutcome.spread2)) {
          return `${secondOutcome.spread},${secondOutcome.spread2}`;
        }

        return `${secondOutcome.spread2},${secondOutcome.spread}`;
      }

      return secondOutcome.spread;
    }

    return undefined;
  }

  return undefined;
};
const SportsTableRow = ({
  additionalMarketCount,
  date,
  eventId,
  feedCode,
  markets,
  sportCode,
  teamA,
  teamAScore,
  teamB,
  teamBScore,
  time,
}) => {
  const [isDropdownOpened, setIsDropdownOpened] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const language = useSelector(getAuthLanguage);
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

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

  return (
    <>
      <tr className={classes["african-sports-table__row"]}>
        <td>
          <div className={classes["african-sports-table__matches"]}>
            <div className={classes["african-sports-table__time"]}>
              <span className={classes["african-sports-table__date"]}>{date}</span>
              <span className={classes["african-sports-table__date"]}>{time}</span>
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
            const outcomes = market ? Object.values(market.children) : [];
            const outcome =
              market && !isOutcomeSpread(outcomeType)
                ? outcomes.find(
                    (outcome) => outcome.pos === index + (outcomeType !== AFRICAN_OUTCOME_TYPE_UNDER ? 1 : 2),
                  )
                : undefined;

            const factor = getFactor(outcomeType, outcome, outcomes);

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
                        [classes["active"]]: betslipOutcomeIds.includes(outcome?.id),
                        [classes["african-sports-table__factor_disabled"]]: outcome?.hidden || !market?.open,
                      },
                    )}
                    onClick={() => isOutcomePrice(outcomeType) && toggleBetslipHandler(outcome.id, eventId)}
                  >
                    {outcome?.dir === "d" && (
                      <span
                        className={cx(
                          classes["african-sports-table__triangle"],
                          classes["african-sports-table__triangle_red"],
                        )}
                      />
                    )}
                    {outcome?.dir === "u" && (
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
            {isLoggedIn && <FavouriteMatchButton isDiv className="african-sports-table__icon" eventId={eventId} />}

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
      {isDropdownOpened && <PrematchTableRowDropdownSpoiler eventId={eventId} isOpened={isDropdownOpened} />}
    </>
  );
};

SportsTableRow.propTypes = propTypes;
SportsTableRow.defaultProps = defaultProps;

export default SportsTableRow;
