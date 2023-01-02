import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { BET_RESULTS, BET_TYPES, MAX_ODDS_NUMBER, MIN_ODDS_NUMBER } from "constants/betcalculator-bets";
import { Field } from "formik";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getValidatedFloatValue } from "utils/betcalculator";

const propTypes = {
  arrayHelpers: PropTypes.object.isRequired,
  currencyCode: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  setSelectedBetType: PropTypes.func.isRequired,
  setShownRowsNumber: PropTypes.func.isRequired,
  shownRowsNumber: PropTypes.number.isRequired,
  totalStack: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired,
};

const CalculatorOddsCard = ({
  arrayHelpers,
  currencyCode,
  formik,
  setSelectedBetType,
  setShownRowsNumber,
  shownRowsNumber,
  totalStack,
}) => {
  const { t } = useTranslation();
  const handleRowAdd = (arrayHelpers) => () => {
    if (shownRowsNumber === MAX_ODDS_NUMBER) return;
    setSelectedBetType(BET_TYPES.find((type) => type.rowsNumber === shownRowsNumber + 1).value);
    setShownRowsNumber((number) => number + 1);
    arrayHelpers.push({ rate: "2.0", result: BET_RESULTS[0].value });
  };

  const handleRowDelete = (arrayHelpers, index) => () => {
    if (shownRowsNumber === MIN_ODDS_NUMBER) return;
    // select the first bet type from the list with rows number equal to number of rows shown to user
    setSelectedBetType(BET_TYPES.find((type) => type.rowsNumber === shownRowsNumber - 1).value);
    setShownRowsNumber((number) => number - 1);
    arrayHelpers.remove(index);
  };

  const handleFloatInput = (fieldName) => (e) => {
    const value = getValidatedFloatValue(e.target.value);
    // update value if input is valid or empty
    if (value !== null) {
      formik.setFieldValue(fieldName, value);
    }
  };

  return (
    <div className={classes["calculator__item"]}>
      <div className={classes["calculator-odds"]}>
        <div className={classes["calculator-odds__container"]}>
          <div className={classes["calculator-odds__subcontainer"]}>
            <div className={classes["calculator-odds__labels"]}>
              <span className={classes["calculator-odds__hash"]}>#</span>
              <span className={classes["calculator-odds__label"]}>{t("bet_calculator.odds")}</span>
              <span className={classes["calculator-odds__label"]}>{t("bet_calculator.select_result")}</span>
            </div>
          </div>
          <div className={cx(classes["calculator-odds__border"], classes["calculator-odds__border_bold"])} />
          <div className={classes["calculator-odds__subcontainer"]}>
            <div className={classes["calculator-odds__elements"]}>
              {formik.values.odds.map((_, index) => (
                <div className={classes["calculator-odds__element"]} key={index}>
                  <span className={classes["calculator-odds__number"]}>{index + 1}</span>
                  <div className={classes["calculator-odds__odd"]}>
                    <Field name={`odds[${index}].rate`} onChange={handleFloatInput(`odds[${index}].rate`)} />
                  </div>
                  <div className={classes["calculator-odds__select"]}>
                    <Field as="select" name={`odds[${index}].result`}>
                      {BET_RESULTS.map((result) => (
                        <option key={result.value} value={result.value}>
                          {t(`bet_calculator.${result.name}`)}
                        </option>
                      ))}
                    </Field>
                    <span className={classes["calculator-odds__select-arrow"]}>
                      <span />
                    </span>
                  </div>
                  <span className={classes["calculator-odds__cross"]} onClick={handleRowDelete(arrayHelpers, index)}>
                    <svg height="14" viewBox="0 0 14 14" width="14" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <g>
                          <path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z" />
                        </g>
                      </g>
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={classes["calculator-odds__subcontainer"]}>
            <div className={classes["calculator-odds__row"]}>
              <button
                className={classes["calculator-odds__add"]}
                disabled={shownRowsNumber === MAX_ODDS_NUMBER}
                type="button"
                onClick={handleRowAdd(arrayHelpers)}
              >
                <span /> {t("bet_calculator.add_odds")}
              </button>
            </div>
          </div>
          <div className={classes["calculator-odds__border"]} />
          <div className={classes["calculator-odds__subcontainer"]}>
            <div className={classes["calculator-odds__your-stake"]}>
              <span className={classes["calculator-odds__title"]}>{t("bet_calculator.your_stake")}</span>
              <div className={classes["calculator-odds__odd"]}>
                <Field name="stake" placeholder="100" type="text" onChange={handleFloatInput("stake")} />
              </div>
            </div>
          </div>
          <div className={cx(classes["calculator-odds__border"], classes["calculator-odds__border_dashed"])} />
          <div className={classes["calculator-odds__subcontainer"]}>
            <div className={classes["calculator-odds__total"]}>
              <span className={classes["calculator-odds__total-stake"]}>{t("bet_calculator.total_stake")}</span>
              <span className={classes["calculator-odds__total-number"]}>
                {`${currencyCode || "USD"} ${totalStack}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CalculatorOddsCard.propTypes = propTypes;

export default CalculatorOddsCard;
