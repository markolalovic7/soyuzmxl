import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../../../utils/betslip-utils";

const RightMatchOutcome = ({ coefficient, coefficientCount, eventId, index }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = useSelector(isDesktopCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length >= maxBetslipSelections && !betslipOutcomeIds.find((x) => x === outcomeId)) {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    } else {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);
      onRefreshBetslipHandler(dispatch, location.pathname);
    }
  };

  return (
    <div
      className={cx(
        classes["card-result"],
        classes["card-result--dd"],
        { [classes["active"]]: betslipOutcomeIds.includes(Number(coefficient.id)) },
        { [classes["disabled"]]: coefficient.hidden },
        classes["card-result--grow"],
        // classes[coefficientCount !== 3 || index !== 1 ? "card-result--grow" : "card-result--small"],
      )}
      onClick={() => toggleBetslipHandler(coefficient.id, eventId)}
    >
      <span>{coefficient.desc}</span>
      <b>{coefficient.price}</b>
      <div
        className={cx(
          classes["card__triangle"],
          { [classes["card__triangle_green"]]: ["u", ">"].includes(coefficient.dir) },
          { [classes["card__triangle_red"]]: ["d", "<"].includes(coefficient.dir) },
        )}
      />
    </div>
  );
};

RightMatchOutcome.propTypes = {
  coefficient: PropTypes.object.isRequired,
  coefficientCount: PropTypes.number.isRequired,
  eventId: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default React.memo(RightMatchOutcome);
