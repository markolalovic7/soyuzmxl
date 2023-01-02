import NewsBanner from "applications/vanilladesktop/components/NewsBanner";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import { BET_RESULTS, BET_TYPES } from "constants/betcalculator-bets";
import { FieldArray, Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getLocaleFormattedNumber } from "utils/betcalculator";

import CalculatorOddsCard from "./CalculatorOddsCard";
import CalculatorReturns from "./CalculatorReturns";
import CalculatorSelectTypeCard from "./CalculatorSelectTypeCard";
import CalculatorSteps from "./CalculatorSteps";

// Reference: https://github.com/1player/betlib
const betlib = require("betlib-master/dist/betlib");

const BetCalculatorPage = () => {
  const { t } = useTranslation();
  const currencyCode = useSelector((state) => state.auth?.currencyCode);
  const [returns, setReturns] = useState(0);
  const [totalStack, setTotalStack] = useState(0);
  const [selectedBetType, setSelectedBetType] = useState(BET_TYPES[0].value);
  const [shownRowsNumber, setShownRowsNumber] = useState(BET_TYPES[0].rowsNumber);
  const formik = useFormik({
    initialValues: {
      odds: [...Array(shownRowsNumber)].map(() => ({ rate: "2.0", result: BET_RESULTS[0].value })),
      stake: 0,
    },
    validateOnChange: true,
  });

  const onBetTypeChange = (arrayHelpers) => (value) => {
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

  let stepNumber = 1;
  if (formik.values.odds.some(({ rate }) => !!rate)) {
    stepNumber = 2;
  }
  if (stepNumber === 2 && !!parseFloat(totalStack)) {
    stepNumber = 3;
  }

  return (
    <main className={classes["main"]}>
      <NewsBanner />
      <div className={classes["main__sports"]}>
        <div className={classes["main__container"]}>
          <FormikProvider value={formik}>
            <Form>
              <FieldArray
                name="odds"
                render={(arrayHelpers) => (
                  <div className={classes["calculator"]}>
                    <div className={classes["main-title"]}>
                      <span className={classes["main-title__text"]}>{t("bet_calculator.title")}</span>
                    </div>
                    <CalculatorSteps step={stepNumber} />
                    <div className={classes["calculator__content"]}>
                      <div className={classes["calculator__section"]}>
                        <CalculatorSelectTypeCard
                          arrayHelpers={arrayHelpers}
                          selectedBetType={selectedBetType}
                          onBetTypeChange={onBetTypeChange}
                        />
                        <CalculatorOddsCard
                          arrayHelpers={arrayHelpers}
                          currencyCode={currencyCode}
                          formik={formik}
                          selectedBetType={selectedBetType}
                          setSelectedBetType={setSelectedBetType}
                          setShownRowsNumber={setShownRowsNumber}
                          shownRowsNumber={shownRowsNumber}
                          totalStack={totalStack}
                        />
                      </div>
                      <div className={classes["calculator__section"]}>
                        <CalculatorReturns currencyCode={currencyCode} odds={formik.values.odds} returns={returns} />
                      </div>
                    </div>
                    <div className={classes["calculator__section"]} />
                  </div>
                )}
              />
            </Form>
          </FormikProvider>
        </div>
      </div>
    </main>
  );
};

export default BetCalculatorPage;
