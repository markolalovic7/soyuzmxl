import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { BET_TYPES } from "constants/betcalculator-bets";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  onBetTypeChange: PropTypes.func.isRequired,
  selectedBetType: PropTypes.string.isRequired,
};

const CalculatorSelectTypeCard = ({ arrayHelpers, onBetTypeChange, selectedBetType }) => {
  const { label } = useMemo(() => BET_TYPES.find((type) => type.value === selectedBetType), [selectedBetType]);
  const { t } = useTranslation();

  return (
    <div className={classes["calculator__item"]}>
      <div className={classes["calculator__container"]}>
        <div className={classes["calculator-checkboxes"]}>
          <span className={classes["calculator-checkboxes__title"]}>{t("bet_calculator.select_bet_type")}</span>
          <div className={classes["calculator-checkboxes__checkboxes"]}>
            {BET_TYPES.map((type, index) => (
              <div
                className={classes["calculator-checkboxes__checkbox"]}
                key={index}
                onClick={() => onBetTypeChange(arrayHelpers)(type.value)}
              >
                <input checked={selectedBetType === type.value} id={type.value} type="checkbox" />
                <label htmlFor={type.value}>{t(`bet_types_options.${type.label}.name`)}</label>
              </div>
            ))}
          </div>
          <div className={classes["calculator-checkboxes__info"]}>
            <div className={classes["calculator-checkboxes__icon"]}>
              <svg
                aria-hidden="true"
                data-fa-i2svg=""
                data-icon="exclamation-circle"
                data-prefix="fas"
                focusable="false"
                role="img"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zm-248 50c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className={classes["calculator-checkboxes__description"]}>
              {t(`bet_types_options.${label}.description`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

CalculatorSelectTypeCard.propTypes = propTypes;

export default CalculatorSelectTypeCard;
