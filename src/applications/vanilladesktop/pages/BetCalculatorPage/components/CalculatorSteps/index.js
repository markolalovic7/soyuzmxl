import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const propTypes = {
  step: PropTypes.number.isRequired,
};

const CalculatorSteps = ({ step }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["calculator__steps"]}>
      <div className={cx(classes["calculator-step"], classes["active"])}>
        <span className={classes["calculator-step__title"]}>{t("bet_calculator.select_bet_type")}</span>
        <div className={classes["calculator-step__circle"]} />
        <div className={classes["calculator-step__step"]}>{t("bet_calculator.step", { step: 1 })}</div>
      </div>
      <div className={cx(classes["calculator-step"], { [classes["active"]]: step >= 2 })}>
        <span className={classes["calculator-step__title"]}>{t("bet_calculator.add_odds_and_stake")}</span>
        <div className={classes["calculator-step__circle"]} />
        <div className={classes["calculator-step__step"]}>{t("bet_calculator.step", { step: 2 })}</div>
      </div>
      <div className={cx(classes["calculator-step"], { [classes["active"]]: step === 3 })}>
        <span className={classes["calculator-step__title"]}>{t("results")}</span>
        <div className={classes["calculator-step__circle"]} />
        <div className={classes["calculator-step__step"]}>{t("bet_calculator.step", { step: 3 })}</div>
      </div>
    </div>
  );
};

CalculatorSteps.propTypes = propTypes;

export default CalculatorSteps;
