import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import * as dayjs from "dayjs";
import * as PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrackBackground, Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";


import { getAuthLanguage, getAuthTimezoneOffset } from "../../../../../../../../redux/reselect/auth-selector";
import { getActiveBetDetail } from "../../../../../../../../redux/slices/cashoutSlice";
import { getLocaleDateMyBetsFormat } from "../../../../../../../../utils/date-format";
import classes from "../../../../../../scss/citymobile.module.scss";

import Spinner from "applications/common/components/Spinner";
import { cashout, clearCashoutState, getFreshQuotation } from "redux/slices/cashoutSlice";

const MyBets = ({ betslipMaxHeight }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // When loading the page for the first time, or logging in, find out the pending bets...
  // const activeBetCount = useSelector((state) => state.cashout.activeBetCount);
  const activeBets = useSelector((state) => state.cashout.activeBets);
  const myBetLoading = useSelector((state) => state.cashout.loading);

  const locale = useSelector(getAuthLanguage);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const dateFormat = useMemo(() => getLocaleDateMyBetsFormat(locale), [locale]);
  const timezoneOffset = useSelector(getAuthTimezoneOffset);
  const cashoutProcessing = useSelector((state) => state.cashout.cashoutProcessing);
  const [cashOutVisible, setCashOutVisible] = useState(false);
  const [activeBetId, setActiveBetId] = useState(null);

  const [sliderValue, setSliderValue] = useState([1]);
  const [toggle, setToggle] = useState(false);
  const [validRangeSteps, setValidRangeSteps] = useState([]);

  const elementRefs = activeBets.map((x) => React.createRef());

  const cashoutConfirmed = useSelector((state) => state.cashout.cashoutConfirmed);
  // const cashoutWasSuccessful = useSelector((state) => state.cashout.cashoutConfirmed);
  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (loggedIn) {
      dispatch(getActiveBetDetail({ compactSpread: true }));
    }
  }, [loggedIn, locale]);

  const bet = useMemo(() => activeBets?.find((bet) => bet.betBucketId === activeBetId), [activeBetId, activeBets]);

  const activeQuote = useMemo(
    () => bet?.cashoutQuotePercentageList?.find((quote) => quote.percentage === sliderValue[0]),
    [bet, sliderValue],
  );

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (activeQuote && !cashoutProcessing) {
      const intervalId = setInterval(() => {
        // if an active bet has been selected for possible cashout, pro-actively refresh often
        dispatch(getFreshQuotation({ betBucketId: activeBetId, quote: activeQuote.quote }));
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [activeBetId, activeQuote, cashoutProcessing, dispatch]);

  useEffect(() => {
    if (activeBetId && cashOutVisible) {
      const activeBetIndex = activeBets.findIndex((x) => x.betBucketId === activeBetId);
      if (activeBetIndex > -1 && elementRefs.length > activeBetIndex) {
        elementRefs[activeBetIndex].current.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [activeBetId, cashOutVisible]);

  const handleCashoutMessageAcknowledgement = () => {
    // When the bet cashout is acknowledged - cleanly reload list of active bets
    dispatch(getActiveBetDetail({ compactSpread: true }));
    // clear the redux cashout flags
    dispatch(clearCashoutState());

    // reset various states to their initial values
    setCashOutVisible(false);
    setActiveBetId(undefined);
    setSliderValue([1]);
  };

  // end my bets related

  function handleToggle(e) {
    if (e.target.checked) {
      setToggle(true);
    } else {
      setToggle(false);
      setCashOutVisible(false);
    }
  }

  function handleSliderValue(values) {
    const value = values[0];
    setSliderValue([value]);
    if (value < validRangeSteps[0]) {
      setSliderValue([validRangeSteps[0]]);
    } else {
      setSliderValue([value]);
    }
  }

  function handleCashOutVisible(activeBet) {
    setCashOutVisible(true);
    if (activeBet.betBucketId === activeBetId && cashOutVisible) {
      setCashOutVisible(false);
    }
    setActiveBetId(activeBet.betBucketId);
    const validRangeSteps = [];
    if (activeBet) {
      activeBet.cashoutQuotePercentageList.forEach((quote) => {
        if (quote.stake > 0.99) {
          validRangeSteps.push(quote.percentage);
          setValidRangeSteps(validRangeSteps);
        }
        if (quote.stake <= 0.99) {
          setValidRangeSteps([1]);
        }
      });
    }
  }

  const onCashoutHandler = (betBucketId, stake, quote, percentage) => {
    dispatch(cashout({ betBucketId, percentage, quote, stake }));
  };

  return myBetLoading ? (
    <Spinner className={classes.loader} />
  ) : (
    <div
      className={`${classes["mybets"]} ${classes["active"]}`}
      style={{ maxHeight: betslipMaxHeight - 25, overflowY: "auto" }}
    >
      {cashoutConfirmed && (
        <div className={cx(classes["new-popup"], { [classes["active"]]: cashoutConfirmed })}>
          <div className={classes["new-popup__body"]}>
            <div className={classes["new-popup__container"]}>
              <div className={classes["new-popup__content"]}>
                <div className={classes["new-popup__text"]}>
                  <div className={classes["new-popup__title"]}>{t("city.successful_message")}</div>
                </div>
                <div className={classes["new-popup__buttons"]}>
                  <button
                    className={classes["new-popup__button"]}
                    type="button"
                    onClick={handleCashoutMessageAcknowledgement}
                  >
                    {t("ok")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cashoutFailed && (
        <div className={cx(classes["new-popup"], { [classes["active"]]: cashoutFailed })}>
          <div className={classes["new-popup__body"]}>
            <div className={classes["new-popup__container"]}>
              <div className={classes["new-popup__content"]}>
                <div className={classes["new-popup__text"]}>
                  <div className={classes["new-popup__title"]}>{t("city.failed_message")}</div>
                  <div className={classes["new-popup__buttons"]}>
                    <button
                      className={classes["new-popup__button"]}
                      type="button"
                      onClick={handleCashoutMessageAcknowledgement}
                    >
                      {t("ok")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!process.env.REACT_APP_HITBET_DISABLE_CASHOUT && activeBets.length > 0 && (
        <div className={classes["cashout-switcher"]}>
          <label className={cx(classes["switch"], classes["cash-out-switch"])} htmlFor="cash-out-switch">
            <input checked={toggle} id="cash-out-switch" type="checkbox" onChange={handleToggle} />
            <span className={cx(classes["switch-slider"], classes["round"])} />
          </label>
          <span>{t("city.cash_out_activation")}</span>
        </div>
      )}

      {activeBets.map((activeBet, activeBetIndex) => (
        <div className={classes["mybets__body"]} key={activeBet.betBucketId}>
          <div className={classes["mybets__items"]}>
            {activeBet.cashoutBetDescriptions.map((selection) => (
              <div className={classes["bet-item"]} key={selection.eventDescription}>
                <div className={classes["mybets__item"]}>
                  <div className={classes["mybets__row"]}>
                    <p className={classes["mybets__text"]}>
                      {dayjs
                        .unix(selection.epoch / 1000)
                        .utcOffset(timezoneOffset)
                        .format(dateFormat)}
                    </p>
                  </div>
                  <div className={classes["mybets__row"]}>
                    <div className={classes["mybets__text"]}>
                      <h5>{selection.outcomeDescription}</h5>

                      {activeBet.betBucketId && toggle && !activeBet.disabled && activeBet.quote > 0 && (
                        <div
                          className={cx(classes["down-wrapper"], {
                            [classes["active"]]: cashOutVisible && activeBet.betBucketId === activeBetId,
                          })}
                          onClick={() => handleCashOutVisible(activeBet)}
                        >
                          <svg
                            height="13"
                            // viewBox="0 0 13 13"
                            width="13"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <image
                              height="13"
                              width="13"
                              xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAWpJREFUOE9jZGBgYAgNDWVbvXr1LxCbWgBmJqOUvLwVJzPTsu9//0U9e/jwGDUsQDaTUUVFde6/f3+TGBiZP/z488ubUktAhnOwsG1l+P9XgImJeR4jyCvnzl1Y8f//30BKLUE2nJGRef3du7eDGGFBoqysuo4SS9ANNzIyiADFK9wCdJ98+fzR5NWrV3eJiRMxMTFlHl7+M6BgAbkcZjhIL9wCWGpCDi5iLMFnOIYFMEvOnL+0k/HfbwdQnOCzBNnw/0ysB0wM9dzRkzuKD2DBAQoumCWMDP8ffv7y1Rk9uECG8/Jw7/3PwCiPy3CsPiDGEmINx2sBenDBfAISJ8blMIdiDSLklKMrxy/4hU1iHShOQJaA5GDBwvPrRdDlRx/f40tpBC0AaQZZ8pVNfB/Dvz8GYMOYWC5w/3rpRMhwgkGE7DIDAQGBTyLiexkY/jMRazhJFoAUG0tJcbH8+MFy8t27T8RkQJAaAD1T/axze9yJAAAAAElFTkSuQmCC"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={classes["mybets__row"]}>
                    <div className={classes["mybets__text"]}>
                      <p className={classes["mybets__text"]}>{selection.eventDescription}</p>
                    </div>
                  </div>
                  <div className={classes["mybets__row"]}>
                    <p className={classes["mybets__text"]}>
                      {`${selection.marketDescription} - ${selection.periodDescription}`}
                    </p>
                    <span className={classes["mybets__coeficient"]}>{selection.price}</span>
                  </div>
                </div>
                <hr />
              </div>
            ))}
          </div>
          <div ref={elementRefs[activeBetIndex]} />
          <div className={`${classes["mybets__results"]} ${classes["active"]}`}>
            <div className={classes["mybets__result"]}>
              <span>{t("city.mob_navigation.odds")}</span>
              <span>{activeBet.totalOdds}</span>
            </div>
            <div className={classes["mybets__result"]}>
              <span>{t("city.mob_navigation.total_betting")}</span>
              <span>{activeBet.stake.toLocaleString()}</span>
            </div>
            <div className={classes["mybets__result"]}>
              <span>{t("city.mob_navigation.total_return")}</span>
              <span>{activeBet.potentialWin.toLocaleString()}</span>
            </div>
          </div>
          <br />
          {cashOutVisible &&
            activeBet.betBucketId === activeBetId &&
            (bet && activeQuote ? (
              <div className={classes["cashout-range"]} id={activeBet.betBucketId}>
                <div className={classes["range-wrapper"]}>
                  <span className={classes["arrow"]} />
                  <div className={classes["cashout-range__text"]}>
                    <span className={classes["cashout-range__value"]}>{sliderValue * 100}</span>
                    <span className={classes["cashout-range__unit"]}>%</span>
                  </div>
                  <div className={classes["cashout-range__slider"]}>
                    <Range
                      max={1}
                      min={0}
                      renderThumb={({ props }) => (
                        <div
                          {...props}
                          style={{
                            // eslint-disable-next-line react/prop-types
                            ...props.style,
                            backgroundColor: "#79e5e3",
                            borderRadius: "100%",
                            height: "20px",
                            width: "20px",
                            // border: "1px solid #000",
                          }}
                        />
                      )}
                      renderTrack={({ children, props }) => (
                        <div
                          {...props}
                          style={{
                            // eslint-disable-next-line react/prop-types
                            ...props.style,
                            // border: "1px solid white",
                            // boxShadow: "1px 1px 1px 1px #33333314",
                            // borderRadius: "4px",
                            background: getTrackBackground({
                              colors: ["#79e5e3", "#D3D3D2"],
                              max: 1,
                              min: 0,
                              values: sliderValue,
                            }),

                            backgroundColor: "#79e5e3",

                            height: "6px",

                            width: "100%",
                          }}
                        >
                          {children}
                        </div>
                      )}
                      step={0.1}
                      values={sliderValue}
                      onChange={(values) => handleSliderValue(values)}
                    />
                    <br />
                    <p>
                      {t("city.cash_out_amount", {
                        activeQuote: activeQuote && activeQuote.quote.toLocaleString(),
                      })}
                    </p>
                  </div>
                </div>
                <hr />
                <div className={classes["cashout-footer"]}>
                  <button
                    disabled={cashoutProcessing}
                    type="button"
                    onClick={() =>
                      onCashoutHandler(activeBet.betBucketId, activeQuote.stake, activeQuote.quote, sliderValue[0])
                    }
                  >
                    {cashoutProcessing ? <FontAwesomeIcon className="fa-spin" icon={faSpinner} /> : t("city.cashout")}
                  </button>
                </div>
              </div>
            ) : (
              <Spinner className={classes.loader} />
            ))}
        </div>
      ))}
    </div>
  );
};

const propTypes = {
  betslipMaxHeight: PropTypes.number.isRequired,
};

const defaultProps = {};

MyBets.propTypes = propTypes;
MyBets.defaultProps = defaultProps;

export default MyBets;
