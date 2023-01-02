import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { makeGetBetslipOutcomeIds } from "../../../../../../../../../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../../../../../../../../../redux/reselect/cms-layout-widgets";
import {
  onRefreshBetslipHandler,
  onToggleSelection,
} from "../../../../../../../../../../../../../../../../utils/betslip-utils";
import classes from "../../../../../../../../../../../../../../scss/vanilladesktop.module.scss";

const AsianMarketOutcomePrice = ({ eventId, hidden, label, outcomeId, price, priceDir }) => {
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
    <div className={classes["asian-sports-table__coeficients"]}>
      {label ? (
        <div
          className={cx(
            classes["asian-sports-table__coeficient"],
            classes["asian-sports-table__coeficient_highlighted"],
          )}
        >
          <span>{label}</span>
        </div>
      ) : (
        <div className={classes["asian-sports-table__coeficient"]} />
      )}
      <div
        className={cx(classes["asian-sports-table__coeficient"], {
          [classes["asian-sports-table__coeficient_selected"]]: betslipOutcomeIds.includes(Number(outcomeId)),
        })}
        style={{
          cursor: hidden ? "default" : "pointer",
          opacity: hidden ? 0.5 : 1,
          pointerEvents: hidden ? "none" : "auto",
        }}
        onClick={() => toggleBetslipHandler(outcomeId, eventId)}
      >
        <span>{price}</span>
        {priceDir === "u" && (
          <div className={cx(classes["asian-sports-table__triangle"], classes["asian-sports-table__triangle_green"])} />
        )}
        {priceDir === "d" && (
          <div className={cx(classes["asian-sports-table__triangle"], classes["asian-sports-table__triangle_red"])} />
        )}
      </div>
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  hidden: PropTypes.bool,
  label: PropTypes.string,
  outcomeId: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  priceDir: PropTypes.string,
};

const defaultProps = {
  hidden: false,
  label: undefined,
  priceDir: undefined,
};

AsianMarketOutcomePrice.propTypes = propTypes;
AsianMarketOutcomePrice.defaultProps = defaultProps;

export default AsianMarketOutcomePrice;
