import hundredEuroImg from "applications/slipstream/img/currency/euro/100euro_fr_ES2_thumb.png";
import tenEuroImg from "applications/slipstream/img/currency/euro/10euro_fr_ES2_thumb.png";
import twohundredEuroImg from "applications/slipstream/img/currency/euro/200euro_fr_ES2_thumb.png";
import twentyEuroImg from "applications/slipstream/img/currency/euro/20euro_fr_ES2_thumb.png";
import fivehundredEuroImg from "applications/slipstream/img/currency/euro/500euro_fr_ES1_thumb.png";
import fiftyEuroImg from "applications/slipstream/img/currency/euro/50euro_fr_ES2_thumb.png";
import fiveEuroImg from "applications/slipstream/img/currency/euro/5euro_fr_ES2_thumb.png";
import coinEuroImg from "applications/slipstream/img/currency/euro/EUROCoins.jpg";
import tenGBPImg from "applications/slipstream/img/currency/gbp/10GBPNote.jpg";
import twentyGBPImg from "applications/slipstream/img/currency/gbp/20GBPNote.jpg";
import fiftyGBPImg from "applications/slipstream/img/currency/gbp/50GBPNote.jpg";
import fiveGBPImg from "applications/slipstream/img/currency/gbp/5GBPNote.jpg";
import coinGBPImg from "applications/slipstream/img/currency/gbp/GBPCoin.jpg";
import tenUSDImg from "applications/slipstream/img/currency/usd/10-face-web_0.jpg";
import hundredUSDImg from "applications/slipstream/img/currency/usd/100-face-web_0.jpg";
import oneUSDImg from "applications/slipstream/img/currency/usd/1_1963-present-front.jpg";
import twoUSDImg from "applications/slipstream/img/currency/usd/2-face-web_0.jpg";
import twentyUSDImg from "applications/slipstream/img/currency/usd/20-face-web_0.jpg";
import fiveUSDImg from "applications/slipstream/img/currency/usd/5-face-web_0.jpg";
import fiftyUSDImg from "applications/slipstream/img/currency/usd/50-face-web_0.jpg";
import coinUSDImg from "applications/slipstream/img/currency/usd/USDCoins.jpg";
import classes from "applications/slipstream/scss/slipstream.module.scss";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { logout } from "../../../../../redux/actions/auth-actions";
import { getRetailTillDetails } from "../../../../../redux/reselect/retail-selector";
import { endShift, startShift } from "../../../../../redux/slices/retailTillSlice";
import withBarcodeReader from "../../../hocs/withBarcodeReader";

const getCurrencyImage = (tillCurrencyCode, amount) => {
  switch (tillCurrencyCode) {
    case "EUR":
      switch (amount) {
        case 5:
          return fiveEuroImg;
        case 10:
          return tenEuroImg;
        case 20:
          return twentyEuroImg;
        case 50:
          return fiftyEuroImg;
        case 100:
          return hundredEuroImg;
        case 200:
          return twohundredEuroImg;
        case 500:
          return fivehundredEuroImg;
        case 2:
        case 1:
        case 0.1:
        case 0.01:
          return coinEuroImg;
        default:
          return undefined;
      }
    case "USD":
      switch (amount) {
        case 100:
          return hundredUSDImg;
        case 50:
          return fiftyUSDImg;
        case 20:
          return twentyUSDImg;
        case 10:
          return tenUSDImg;
        case 5:
          return fiveUSDImg;
        case 2:
          return twoUSDImg;
        case 1:
          return oneUSDImg;
        case 0.1:
        case 0.01:
          return coinUSDImg;
        default:
          return undefined;
      }
    case "GBP":
      switch (amount) {
        case 5:
          return fiveGBPImg;
        case 10:
          return tenGBPImg;
        case 20:
          return twentyGBPImg;
        case 50:
          return fiftyGBPImg;
        case 1:
        case 0.1:
        case 0.01:
          return coinGBPImg;
        default:
          return undefined;
      }
    default:
      return undefined;
  }
};

const denominations = (tillCurrencyCode) => {
  if (tillCurrencyCode === "USD") {
    return [100, 50, 20, 10, 5, 2, 1, 0.1, 0.01];
  }

  if (tillCurrencyCode === "EUR") {
    return [500, 200, 100, 50, 20, 10, 5, 2, 1, 0.1, 0.01];
  }

  if (tillCurrencyCode === "GBP") {
    return [50, 20, 10, 5, 1, 0.1, 0.01];
  }

  return [1000, 500, 200, 100, 50, 20, 10, 5, 1, 0.1, 0.01];
};

const CashReconciliationPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const balance = useSelector((state) => state.retailTill.balance);
  const tillDetails = useSelector(getRetailTillDetails);
  const tillCurrencyCode = tillDetails?.currencyCode;

  const mustStartShift = useSelector((state) => state.retailTill.mustStartShift);

  const [noteCount, setNoteCount] = useState({});
  const [actualBalance, setActualBalance] = useState(0);

  const onAdd = (amount) => {
    setNoteCount((prevState) => {
      const newState = {
        ...prevState,
      };
      newState[amount] = (newState[amount] || 0) + 1;

      return newState;
    });
  };

  const onSubstract = (amount) => {
    setNoteCount((prevState) => {
      const newState = {
        ...prevState,
      };
      newState[amount] = Math.max((newState[amount] || 0) - 1, 0);

      return newState;
    });
  };

  useEffect(() => {
    let updatedBalance = 0;
    Object.entries(noteCount).forEach((entry) => {
      updatedBalance += entry[0] * entry[1]; // amount * number of notes of this denomination
    });
    setActualBalance(updatedBalance);
  }, [noteCount]);

  const onCancel = () => {
    if (mustStartShift) {
      dispatch(logout());
    } else {
      history.push("/");
    }
  };

  const onConfirm = () => {
    if (mustStartShift) {
      // <div className='delete-button' onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.onCancel(item) } } />

      if (actualBalance !== balance) {
        if (
          window.confirm(
            `Are you sure you wish to adjust your balance by ${tillCurrencyCode}  ${(
              actualBalance - balance
            ).toLocaleString()}?`,
          )
        ) {
          dispatch(
            startShift({
              adjustment: {
                amount: Math.abs(actualBalance - balance),
                description: "Start Shift Adjustment",
                isCashIn: actualBalance > balance,
                isCashOut: actualBalance < balance,
              },
              hasAdjustment: true,
            }),
          );
        }
      } else {
        dispatch(startShift({hasAdjustment: false}));
      }
      history.push("/");
    } else if (actualBalance !== balance) {
      if (
          window.confirm(
              `Are you sure you wish to adjust your balance by ${tillCurrencyCode}  ${(
                  actualBalance - balance
              ).toLocaleString()}?`,
          )
      ) {
        dispatch(
            endShift({
              adjustment: {
                amount: Math.abs(actualBalance - balance),
                description: "End Shift Adjustment",
                isCashIn: actualBalance > balance,
                isCashOut: actualBalance < balance,
              },
              hasAdjustment: true,
            }),
          );
        }
      } else {
        dispatch(endShift({ hasAdjustment: false }));
      }
  };

  if (!tillCurrencyCode) return null;

  return (
    <div className={classes["slipstream-body"]}>
      <div className={classes["wrapper"]}>
        <div className={classes["cash-details"]}>
          <div className={classes["cash-details__box"]}>
            <div className={classes["cash-details__title"]}>Cash details</div>
            <div className={classes["cash-details__body"]}>
              <div className={classes["cash-details__form"]}>
                <div className={classes["cash-details__items"]}>
                  {denominations(tillCurrencyCode).map((denomination) => {
                    const image = getCurrencyImage(tillCurrencyCode, denomination);

                    return (
                      <div className={classes["cash-details__item"]} key={denomination}>
                        <div className={classes["cash-details__label"]}>{`${tillCurrencyCode} ${denomination}`}</div>
                        <div className={classes["cash-details__inputs"]}>
                          <button
                            className={classes["cash-details__button"]}
                            type="button"
                            onClick={() => onSubstract(denomination)}
                          >
                            -
                          </button>
                          <div className={classes["cash-details__input"]}>
                            <input type="number" value={noteCount[denomination] || 0} />
                          </div>
                          <div className={classes["cash-details__input"]}>
                            <input type="text" value={(noteCount[denomination] * denomination || 0).toLocaleString()} />
                          </div>
                          <button
                            className={classes["cash-details__button"]}
                            type="button"
                            onClick={() => onAdd(denomination)}
                          >
                            +
                          </button>
                        </div>
                        {image && (
                          <div className={classes["cash-details__img"]}>
                            <img alt="money" src={image} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={classes["cash-details__totals"]}>
                  <div className={classes["cash-details__total"]}>
                    <div className={classes["cash-details__balance"]}>Actual Balance:</div>
                    <div className={classes["cash-details__money"]}>
                      {`${tillCurrencyCode} ${actualBalance?.toLocaleString()}`}
                    </div>
                  </div>
                  <div className={classes["cash-details__total"]}>
                    <div className={classes["cash-details__balance"]}>Expected Balance:</div>
                    <div className={classes["cash-details__money"]}>
                      {`${tillCurrencyCode} ${balance?.toLocaleString()}`}
                    </div>
                  </div>
                </div>
                <div className={classes["cash-details__controls"]}>
                  <button className={classes["cash-details__control"]} type="submit" onClick={onCancel}>
                    Cancel
                  </button>
                  <button className={classes["cash-details__control"]} type="submit" onClick={onConfirm}>
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBarcodeReader(CashReconciliationPage);
