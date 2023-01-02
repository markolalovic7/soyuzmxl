import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../redux/reselect/betslip-selector";
import { getDesktopBetslipMaxSelections } from "../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../utils/betslip-utils";

const propTypes = {
  dir: PropTypes.string,
  eventId: PropTypes.number.isRequired,
  hidden: PropTypes.bool.isRequired,
  leftLabel: PropTypes.string.isRequired,
  outcomeId: PropTypes.number.isRequired,
  rightLabel: PropTypes.string.isRequired,
};
const defaultProps = {
  dir: undefined,
};

// Demo purposes for onClick changes. Should be easier not to move it to the separate component and write it in VirtualSportsPage with cms integration
const TotalSpoilerRate = ({ dir, eventId, hidden, leftLabel, outcomeId, rightLabel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return (
    <div
      className={cx(
        classes["sport__spoiler-item"],
        { [classes["active"]]: betslipOutcomeIds.includes(Number(outcomeId)) },
        { [classes["disabled"]]: hidden },
      )}
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      <span>{leftLabel}</span>
      <span>
        {dir === "d" && <FontAwesomeIcon icon={faArrowDown} style={{ color: "#e24646" }} />}
        {dir === "u" && <FontAwesomeIcon icon={faArrowUp} style={{ color: "#6cbb25" }} />}
        {rightLabel}
      </span>
    </div>
  );
};

TotalSpoilerRate.propTypes = propTypes;
TotalSpoilerRate.defaultProps = defaultProps;

export default TotalSpoilerRate;
