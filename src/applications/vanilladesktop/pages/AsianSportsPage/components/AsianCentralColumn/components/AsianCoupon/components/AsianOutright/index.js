import cx from "classnames";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLoggedIn } from "../../../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../../../utils/betslip-utils";
import FavouriteMatchButton from "../../../../../../../../components/FavouriteMatchButton";
import classes from "../../../../../../../../scss/vanilladesktop.module.scss";

const AsiansSportsTableLabelRow = ({ id, label, time }) => {
  const isLoggedIn = useSelector(getAuthLoggedIn);

  return (
    <div className={classes["asian-outright-table__label"]}>
      {isLoggedIn && <FavouriteMatchButton className="asian-outright-table__icon" eventId={id} isDiv={false} />}
      <span className={classes["asian-outright-table__event"]}>{`${time} - ${label}`}</span>
      <span className={classes["asian-outright-table__id"]}>{`ID ${id}`}</span>
    </div>
  );
};
AsiansSportsTableLabelRow.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

const AsiansSportsTableMatchRow = ({ eventId, hidden, label, outcomeId, price }) => {
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
      className={cx(classes["asian-outright-table__match"])}
      onClick={() => toggleBetslipHandler(outcomeId, eventId)}
    >
      <span className={classes["asian-outright-table__outcome"]}>{label}</span>
      <span
        className={cx(classes["asian-outright-table__price"], {
          [classes["active"]]: betslipOutcomeIds.includes(outcomeId),
        })}
      >
        {price}
      </span>
    </div>
  );
};
AsiansSportsTableMatchRow.propTypes = {
  eventId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  outcomeId: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
};

const AsianOutright = ({ eventId, markets, startTime }) =>
  markets.map((market) => (
    <>
      {" "}
      <AsiansSportsTableLabelRow
        id={market.marketId}
        key={market.marketId}
        label={market.marketDescription}
        time={startTime.format("D MMMM hh:mm A")}
      />
      {market.outcomes
        .sort((a, b) => a.decimalPrice - b.decimalPrice)
        .map((outcome) => {
          if (outcome.hidden) return null;

          return (
            <AsiansSportsTableMatchRow
              eventId={eventId}
              hidden={outcome.hidden}
              key={outcome.outcomeId}
              label={outcome.outcomeDescription}
              outcomeId={outcome.outcomeId}
              price={outcome.price}
            />
          );
        })}
    </>
  ));

export default AsianOutright;
