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
  eventId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  outcomeId: PropTypes.number.isRequired,
};

const GamesListBetButton = ({ eventId, label: bet, outcomeId }) => {
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, true);
      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return (
    <button
      className={cx(classes["games__list-bet"], {
        [classes["selected"]]: betslipOutcomeIds.includes(Number(outcomeId)),
      })}
      type="button"
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      {bet}
    </button>
  );
};

GamesListBetButton.propTypes = propTypes;

export default GamesListBetButton;
