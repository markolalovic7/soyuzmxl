import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
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

const propTypes = {
  eventId: PropTypes.number.isRequired,
  hidden: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  outcomeId: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  withGreenLabel: PropTypes.bool,
  withRedLabel: PropTypes.bool,
};

const defaultProps = {
  withGreenLabel: false,
  withRedLabel: false,
};

const CardCoefficient = ({ eventId, hidden, label, outcomeId, value, withGreenLabel, withRedLabel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

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
    <div
      className={cx(classes["card__content"], classes["coeficient"], {
        [classes["active"]]: betslipOutcomeIds.includes(outcomeId) && !hidden,
        [classes["disabled"]]: hidden,
      })}
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      <span className={classes["coeficient__label"]}>{label}</span>
      <span className={classes["coeficient__numbers"]}>
        {value}
        {withRedLabel && <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_red"])} />}
        {withGreenLabel && (
          <span className={cx(classes["coeficient__triangle"], classes["coeficient__triangle_green"])} />
        )}
      </span>
    </div>
  );
};

CardCoefficient.propTypes = propTypes;
CardCoefficient.defaultProps = defaultProps;

export default React.memo(CardCoefficient);
