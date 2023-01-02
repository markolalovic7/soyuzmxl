import cx from "classnames";
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
import classes from "../../../../../../../../../scss/slimdesktop.module.scss";

const HeaderOutcomePrice = ({ desc, eventId, hidden, isSmall, outcomeId, price }) => {
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
        classes["sport-head-score-item"],
        {
          [classes["sport-head-score-item--small"]]: isSmall,
        },
        {
          [classes["active"]]: betslipOutcomeIds.includes(Number(outcomeId)),
        },
        {
          [classes["disabled"]]: hidden,
        },
      )}
      key={outcomeId}
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      <span>{desc}</span>
      <b>{price}</b>
    </div>
  );
};

export default React.memo(HeaderOutcomePrice);
