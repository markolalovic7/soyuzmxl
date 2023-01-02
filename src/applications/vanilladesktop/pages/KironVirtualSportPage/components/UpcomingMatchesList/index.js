import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../utils/betslip-utils";

const UpcomingMatchesList = ({ eventId, markets }) => {
  const location = useLocation();
  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = useSelector(isDesktopCompactBetslip);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  const winMarket = markets.find((m) => m?.externalCode?.endsWith("Win"));
  const placeMarket = markets.find((m) => m?.externalCode?.endsWith("Place"));

  return (
    <div className={classes["central-section__container"]}>
      {winMarket &&
        placeMarket &&
        Object.values(winMarket.children).map((outcome, index) => {
          const top3Outcome = placeMarket ? Object.values(placeMarket.children)[index] : undefined;

          return (
            <div className={classes["virtual-match"]} key={index}>
              <div className={classes["virtual-match__number"]}>{index + 1}</div>
              <div className={classes["virtual-match__title"]}>
                <div className={classes["virtual-match__team"]}>{outcome.desc}</div>
                <div className={classes["virtual-match__league"]} />
              </div>
              <div className={classes["virtual-match__rating"]} />
              <div className={classes["virtual-match__coeficients"]}>
                <div
                  className={cx(classes["virtual-match__coeficient"], {
                    [classes["active"]]: betslipOutcomeIds.includes(outcome.id),
                  })}
                  onClick={() => toggleBetslipHandler(outcome.id, eventId)}
                >
                  {outcome.price}
                </div>
                <div
                  className={cx(classes["virtual-match__coeficient"], {
                    [classes["active"]]: betslipOutcomeIds.includes(top3Outcome.id),
                  })}
                  onClick={() => toggleBetslipHandler(top3Outcome.id, eventId)}
                >
                  {top3Outcome ? top3Outcome.price : ""}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  markets: PropTypes.array.isRequired,
};

UpcomingMatchesList.propTypes = propTypes;

export default UpcomingMatchesList;
