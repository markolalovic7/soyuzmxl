import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { BET_TYPES } from "constants/betcalculator-bets";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocaleFormattedNumber, getValidatedFloatValue } from "utils/betcalculator";

const betlib = require("betlib-master/dist/betlib");

const BetRow = ({ betType, odds }) => {
  const { t } = useTranslation();
  const [stake, setStake] = useState(100);

  const selections = odds.map((odd) => {
    if (odd.result === "win") {
      return new betlib.WinSelection({ winOdds: parseFloat(odd.rate) });
    }
    if (odd.result === "lose") {
      return new betlib.LoseSelection();
    }

    return new betlib.VoidSelection();
  });
  const bet = new betlib.Bet(betType.value, stake, false);
  const returns = bet.settle(selections);
  const betReturns = returns?.betReturns;
  const returnsSum = Array.isArray(betReturns) ? betReturns.reduce((sum, value) => sum + value, 0) : betReturns;

  const handleStakeChange = (e) => {
    const value = getValidatedFloatValue(e.target.value);
    if (value !== null) {
      setStake(value);
    }
  };

  return (
    <div className={classes["calculator-returns__row"]}>
      <div className={classes["calculator-returns__bet"]}>
        {`${t(`bet_types_options.${betType.label}.name`)} (${returns.numberOfBets()})`}
      </div>
      <div className={classes["calculator-returns__stake"]}>
        <input name="calculator-stake" type="text" value={stake} onChange={handleStakeChange} />
      </div>
      <span className={classes["calculator-returns__total"]}>{getLocaleFormattedNumber(returns.totalStake())}</span>
      <div className={classes["calculator-returns__potential"]}>{getLocaleFormattedNumber(returnsSum)}</div>
    </div>
  );
};
BetRow.propTypes = {
  betType: PropTypes.shape({
    label: PropTypes.string.isRequired,
    rowsNumber: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  odds: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const CalculatorReturns = ({ currencyCode, odds, returns }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["calculator__item"]}>
      <div className={classes["calculator-returns"]}>
        <div className={classes["calculator-returns__header"]}>
          <div className={classes["calculator-returns__usd"]}>{`${currencyCode} ${returns}`}</div>
          <div className={classes["calculator-returns__sublabel"]}>{t("bet_calculator.your_return")}</div>
        </div>
        <div className={classes["calculator-returns__body"]}>
          <div className={classes["calculator__container"]}>
            <div className={classes["calculator-returns__title"]}>{t("bet_calculator.more_bets")}</div>
            <div className={classes["calculator-returns__labels"]}>
              <div className={classes["calculator-returns__label"]}>{t("bet_type")}</div>
              <div className={classes["calculator-returns__label"]}>{t("betslip_panel.stake")}</div>
              <div className={classes["calculator-returns__label"]}>{t("bet_calculator.total_stake")}</div>
              <div className={classes["calculator-returns__label"]}>{t("betslip_panel.potential_returns")}</div>
            </div>
            {BET_TYPES.map(
              (betType, index) =>
                betType.rowsNumber <= odds.length && <BetRow betType={betType} key={index} odds={odds} />,
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

CalculatorReturns.propTypes = {
  currencyCode: PropTypes.string.isRequired,
  odds: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  returns: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
};

export default CalculatorReturns;
