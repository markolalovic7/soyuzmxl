import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../scss/vanilladesktop.module.scss";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  market: PropTypes.object,
};
const defaultProps = {
  market: undefined,
};

const MarketSection = ({ eventId, market }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const compactBetslipMode = useSelector(isDesktopCompactBetslip);
  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return (
    <div
      className={classes["live-overview-item__coeficients"]}
      style={{ gridTemplateColumns: market?.sels?.length < 3 ? "1fr 1fr" : "1fr 1fr 1fr" }}
    >
      {market &&
        market.sels.map((outcome) => (
          <div
            className={cx(classes["coeficient"], {
              [classes["active"]]: betslipOutcomeIds.includes(outcome.oId),
              [classes["disabled"]]: outcome.hidden || !market?.mOpen,
            })}
            key={outcome.oId}
            onClick={() => toggleBetslipHandler(outcome.oId, eventId)}
          >
            <span className={classes["coeficient__label"]}>{outcome.oDesc}</span>
            <span className={classes["coeficient__numbers"]}>
              {outcome.formattedPrice}
              {outcome.dir === "<" && (
                <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_red"])} />
              )}
              {outcome.dir === ">" && (
                <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_green"])} />
              )}
            </span>
          </div>
        ))}
    </div>
  );
};

MarketSection.propTypes = propTypes;
MarketSection.defaultProps = defaultProps;

export default React.memo(MarketSection);
