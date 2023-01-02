import { faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FieldArray, Form, FormikProvider, useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import CalculatorOverlay from "./components/CalculatorOverlay";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { BET_RESULTS, BET_TYPES, MAX_ODDS_NUMBER, MIN_ODDS_NUMBER } from "constants/betcalculator-bets";
import { getLocaleFormattedNumber, getValidatedFloatValue } from "utils/betcalculator";

// Reference: https://github.com/1player/betlib
const betlib = require("betlib-master/dist/betlib");

export default () => {
  const { t } = useTranslation();
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const [returns, setReturns] = useState(0);
  const [totalStack, setTotalStack] = useState(0);
  const [selectedBetType, setSelectedBetType] = useState(BET_TYPES[0].value);
  const [isInfoShown, setIsInfoShown] = useState(false);
  const [shownRowsNumber, setShownRowsNumber] = useState(BET_TYPES[0].rowsNumber);
  const { label } = useMemo(() => BET_TYPES.find((type) => type.value === selectedBetType), [selectedBetType]);
  const formik = useFormik({
    initialValues: {
      odds: [...Array(shownRowsNumber)].map(() => ({ rate: "2.0", result: BET_RESULTS[0].value })),
      stake: 0,
    },
    validateOnChange: true,
  });

  const onBetTypeChange = (arrayHelpers) => (event) => {
    const { value } = event.target;
    const selectedType = BET_TYPES.find((type) => type.value === value);
    const differenceWithCurrentRowsNumber = shownRowsNumber - selectedType.rowsNumber;

    //  remove rows if there are more rows than selected bet type needs
    if (differenceWithCurrentRowsNumber > 0) {
      for (let i = 0; i < differenceWithCurrentRowsNumber; i += 1) {
        arrayHelpers.pop();
      }
    }

    // add rows if there are less rows than selected bet type needs
    if (differenceWithCurrentRowsNumber < 0) {
      for (let i = differenceWithCurrentRowsNumber; i < 0; i += 1) {
        arrayHelpers.push({ rate: "2.0", result: BET_RESULTS[0].value });
      }
    }

    setSelectedBetType(value);
    setShownRowsNumber(selectedType.rowsNumber);
  };

  const handleInfoToggle = () => setIsInfoShown((isShown) => !isShown);

  const handleFloatInput = (fieldName) => (e) => {
    const value = getValidatedFloatValue(e.target.value);
    // update value if input is valid or empty
    if (value !== null) {
      formik.setFieldValue(fieldName, value);
    }
  };

  const handleRowDelete = (arrayHelpers, index) => () => {
    if (shownRowsNumber === MIN_ODDS_NUMBER) return;
    // select the first bet type from the list with rows number equal to number of rows shown to user
    setSelectedBetType(BET_TYPES.find((type) => type.rowsNumber === shownRowsNumber - 1).value);
    setShownRowsNumber((number) => number - 1);
    arrayHelpers.remove(index);
  };

  const handleRowAdd = (arrayHelpers) => () => {
    if (shownRowsNumber === MAX_ODDS_NUMBER) return;
    setSelectedBetType(BET_TYPES.find((type) => type.rowsNumber === shownRowsNumber + 1).value);
    setShownRowsNumber((number) => number + 1);
    arrayHelpers.push({ rate: "2.0", result: BET_RESULTS[0].value });
  };

  useEffect(() => {
    try {
      // check if all win cases have filled number input
      const isNotValid = formik.values.odds.some((odd) => odd.result === "win" && odd.rate === "");
      if (isNotValid || (!formik.values.stake && formik.values.stake !== 0)) {
        throw new Error();
      }
      const selections = formik.values.odds.map((odd) => {
        if (odd.result === "win") {
          return new betlib.WinSelection({ winOdds: parseFloat(odd.rate) });
        }
        if (odd.result === "lose") {
          return new betlib.LoseSelection();
        }

        return new betlib.VoidSelection();
      });

      const bet = new betlib.Bet(selectedBetType, formik.values.stake, false);
      const returns = bet.settle(selections);
      const betReturns = returns?.betReturns;
      const returnsSum = Array.isArray(betReturns) ? betReturns.reduce((sum, value) => sum + value, 0) : betReturns;

      setReturns(getLocaleFormattedNumber(returnsSum));
      setTotalStack(getLocaleFormattedNumber(returns.totalStake()));
    } catch {
      setReturns(t("bet_calculator.not_applicable"));
      setTotalStack(t("bet_calculator.not_applicable"));
    }
  }, [formik.values, selectedBetType, t]);

  return (
    <>
      <div className={classes["bet-calculator"]}>
        <FormikProvider value={formik}>
          <Form>
            <FieldArray
              name="odds"
              render={(arrayHelpers) => (
                <div className={`${classes["main__container"]} ${classes["main__container_small"]}`}>
                  <div className={classes["bet-calculator__item"]}>
                    <div className={classes["bet-calculator__container"]}>
                      <span className={classes["bet-calculator__title"]}>{t("bet_calculator.select_bet_type")}</span>
                      <div className={classes["bet-calculator__row"]}>
                        <div className={classes["bet-calculator__select"]}>
                          <select value={selectedBetType} onChange={onBetTypeChange(arrayHelpers)}>
                            {BET_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {t(`bet_types_options.${type.label}.name`)}
                              </option>
                            ))}
                          </select>
                          <span className={classes["bet-calculator__select-arrow"]}>
                            <span />
                          </span>
                        </div>
                        <button className={classes["bet-calculator__info"]} type="button" onClick={handleInfoToggle}>
                          <FontAwesomeIcon icon={faInfoCircle} size="xs" />
                        </button>
                      </div>
                      {isInfoShown && (
                        <p className={classes["bet-calculator__text"]}>{t(`bet_types_options.${label}.description`)}</p>
                      )}
                    </div>
                  </div>
                  <div className={classes["bet-calculator__item"]}>
                    <div className={classes["bet-calculator__container"]}>
                      <span className={classes["bet-calculator__title"]}>{t("bet_calculator.add_odds_and_stake")}</span>
                      <div className={classes["bet-calculator__labels"]}>
                        <span className={classes["bet-calculator__hash"]}>#</span>
                        <span className={classes["bet-calculator__label"]}>{t("bet_calculator.odds")}</span>
                        <span className={classes["bet-calculator__label"]}>{t("bet_calculator.select_result")}</span>
                      </div>
                      <div
                        className={`${classes["bet-calculator__border"]} ${classes["bet-calculator__border_bold"]}`}
                      />
                      <div className={classes["bet-calculator__elements"]}>
                        {formik.values.odds.map((odd, index) => (
                          <div className={classes["bet-calculator__element"]} key={index}>
                            <span className={classes["bet-calculator__number"]}>{index + 1}</span>
                            <div className={classes["bet-calculator__odd"]}>
                              <Field name={`odds[${index}].rate`} onChange={handleFloatInput(`odds[${index}].rate`)} />
                            </div>
                            <div className={classes["bet-calculator__select"]}>
                              <Field as="select" name={`odds[${index}].result`}>
                                {BET_RESULTS.map((result) => (
                                  <option key={result.value} value={result.value}>
                                    {t(`bet_calculator.${result.name}`)}
                                  </option>
                                ))}
                              </Field>
                              <span className={classes["bet-calculator__select-arrow"]}>
                                <span />
                              </span>
                            </div>
                            {shownRowsNumber !== MIN_ODDS_NUMBER && (
                              <span
                                className={classes["bet-calculator__cross"]}
                                onClick={handleRowDelete(arrayHelpers, index)}
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className={classes["bet-calculator__container bet-calculator__container_big"]}>
                        <div className={classes["bet-calculator__row"]}>
                          <button
                            className={classes["bet-calculator__add"]}
                            disabled={shownRowsNumber === MAX_ODDS_NUMBER}
                            type="button"
                            onClick={handleRowAdd(arrayHelpers)}
                          >
                            <span />
                            {t("bet_calculator.select_result")}
                          </button>
                        </div>
                      </div>
                      <div className={classes["bet-calculator__border"]} />
                      <span className={classes["bet-calculator__title"]}>{t("bet_calculator.your_stake")}</span>
                      <div className={`${classes["bet-calculator__odd"]} ${classes["bet-calculator__odd_single"]}`}>
                        <Field name="stake" placeholder="100" type="text" onChange={handleFloatInput("stake")} />
                      </div>
                      <div
                        className={`${classes["bet-calculator__border"]} ${classes["bet-calculator__border_dashed"]}`}
                      />
                      <div className={classes["bet-calculator__total"]}>
                        <span className={classes["bet-calculator__total-stake"]}>
                          {t("bet_calculator.total_stake")}
                        </span>
                        <span className={classes["bet-calculator__total-number"]}>
                          {`${currencyCode || "USD"} ${totalStack}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </Form>
        </FormikProvider>
      </div>
      <CalculatorOverlay currencyCode={currencyCode} odds={formik.values?.odds} returns={returns} />
    </>
  );
};
