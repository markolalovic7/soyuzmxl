import * as PropTypes from "prop-types";
import { useSelector } from "react-redux";

import classes from "../../../../scss/vanilladesktop.module.scss";

const BetslipMoneyButtons = ({ currencyCode, moneyButtons, onClick }) => {
  const submitInProgress = useSelector((state) => state.betslip.submitInProgress);

  return (
    <div className={classes["betslip__row"]} style={{ pointerEvents: submitInProgress ? "none" : "auto" }}>
      {moneyButtons &&
        moneyButtons[currencyCode]?.map((amount) => (
          <button className={classes["betslip__button"]} key={amount} type="button" onClick={() => onClick(amount)}>
            {amount.toLocaleString()}
          </button>
        ))}
    </div>
  );
};

BetslipMoneyButtons.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  moneyButtons: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BetslipMoneyButtons;
