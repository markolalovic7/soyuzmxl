import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { makeGetBetslipOutcomeIds } from "redux/reselect/betslip-selector";
import { getMobileBetslipMaxSelections, isMobileCompactBetslip } from "redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "utils/betslip-utils";

const propTypes = {
  description: PropTypes.string.isRequired,
  dir: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  hidden: PropTypes.bool.isRequired,
  outcomeId: PropTypes.number.isRequired,
  period: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

const defaultProps = {};

const OutcomePriceButton = ({ description, dir, eventId, hidden, outcomeId, period, price }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getMobileBetslipMaxSelections);
  const compactBetslipMode = useSelector(isMobileCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  return (
    <button
      className={`${classes["bet__coeficient"]} ${
        betslipOutcomeIds.includes(Number(outcomeId)) && !hidden ? classes["bet__coeficient_active"] : ""
      } ${hidden ? classes["bet__coeficient_disabled"] : ""}`}
      type="button"
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      {dir && (
        <span
          className={`${classes["bet__triangle"]} ${
            dir === "u" ? classes["bet__triangle_green"] : dir === "d" ? classes["bet__triangle_red"] : ""
          }`}
        />
      )}
      <span className={classes["bet__coeficient-name"]}>
        <span className={classes["bet__coeficient-ellipsis"]}>{description}</span>
        {period && <span>{`(${period})`}</span>}
      </span>
      <div className={classes["bet__coeficient-numbers"]}>
        {/* <span className={classes["bet__coeficient-hide-number"]}> */}
        {/*  {props.spread ? descChunks[descChunks.length - 1] : ""} */}
        {/* </span> */}
        <span className={classes["bet__coeficient-number"]}>{price}</span>
      </div>
    </button>
  );
};

OutcomePriceButton.propTypes = propTypes;
OutcomePriceButton.defaultProps = defaultProps;

export default React.memo(OutcomePriceButton);
