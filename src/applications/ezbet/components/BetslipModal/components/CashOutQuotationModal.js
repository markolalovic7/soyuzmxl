import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrackBackground, Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import SimpleBetslipSuccessModal from "./SimpleBetslipSuccessModal";

import classes from "applications/ezbet/scss/ezbet.module.scss";
import { cashout, getActiveBetDetail, getFreshQuotation } from "redux/slices/cashoutSlice";
import { acknowledgeSubmission } from "utils/betslip-utils";
import { isNotEmpty } from "utils/lodash";

const propTypes = {
  forwardedBet: PropTypes.object,
  setCashOutModalOpen: PropTypes.func.isRequired,
  setCashOutScreenVisible: PropTypes.func,
  setNetworkStatusUnstable: PropTypes.func.isRequired,
  style: PropTypes.any,
};

const defaultProps = {
  forwardedBet: undefined,
  setCashOutScreenVisible: undefined,
  style: undefined,
};

const CashOutQuotationModal = ({ forwardedBet, setCashOutModalOpen, setNetworkStatusUnstable }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const activeBet = forwardedBet.betBucketId;

  const cashoutProcessing = useSelector((state) => state.cashout.cashoutProcessing);
  const cashoutConfirmed = useSelector((state) => state.cashout.cashoutConfirmed);
  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);

  const activeBets = useSelector((state) => state.cashout.activeBets);

  const [sliderValue, setSliderValue] = useState([1]);
  const [toggle, setToggle] = useState(true);

  const [bet, setBet] = useState(forwardedBet);

  const activeQuote = bet && bet.cashoutQuotePercentageList.find((quote) => quote.percentage === sliderValue[0]);
  const minQuote = bet && isNotEmpty(bet.cashoutQuotePercentageList) ? bet.cashoutQuotePercentageList[0].quote : 0;
  const maxQuote =
    bet && isNotEmpty(bet.cashoutQuotePercentageList)
      ? bet.cashoutQuotePercentageList[bet.cashoutQuotePercentageList.length - 1].quote
      : 0;

  const [validRangeSteps, setValidRangeSteps] = useState([]);
  const [partialValue, setPartialValue] = useState([]);
  const location = useLocation();

  const [modalContent, setModalContent] = useState(true);

  useEffect(() => {
    if (cashoutConfirmed) {
      setModalContent(false);
      dispatch(getActiveBetDetail()); // force an immediate refresh
    }
  }, [cashoutConfirmed]);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (activeBet && !cashoutProcessing) {
      const bet = activeBets.find((bet) => bet.betBucketId === activeBet);
      setBet(bet);
    }

    return undefined;
  }, [activeBet, cashoutProcessing, activeBets]);

  useEffect(() => {
    // When the tab is selected, load the bet history
    if (bet && !cashoutProcessing) {
      const intervalId = setInterval(() => {
        // if an active bet has been selected for possible cashout, pro-actively refresh often
        const activeQuote = bet.cashoutQuotePercentageList.find((quote) => quote.percentage === sliderValue[0]);
        if (activeQuote) dispatch(getFreshQuotation({ betBucketId: bet.betBucketId, quote: activeQuote.quote }));
      }, 3000);

      return () => clearInterval(intervalId);
    }

    return undefined;

    // note - "bet" is not a dependency as the "activeQuote.quote" itself serves no purpose and we want to avoid the interval constantly resetting.
  }, [cashoutProcessing, dispatch, sliderValue]);

  useEffect(() => {
    const validRangeSteps = [];
    if (bet) {
      bet.cashoutQuotePercentageList.forEach((quote) => {
        if (quote.stake > 0.99) {
          validRangeSteps.push(quote.percentage);
          setValidRangeSteps(validRangeSteps);
          setPartialValue([validRangeSteps[0]]);
        }
        if (quote.stake <= 0.99) {
          setValidRangeSteps([1]);
          setPartialValue([1]);
        }
      });
    }
  }, [bet]);

  useEffect(() => {
    if (cashoutFailed) {
      setNetworkStatusUnstable(true);
    }
  }, [cashoutFailed]);

  function handleSliderValue(values) {
    const value = values[0];
    setSliderValue([value]);
    setPartialValue([value]);
    if (value <= 0.9) {
      setToggle(false);
    }
    if (value === 0) {
      setSliderValue([0.1]);
    }
    if (value === 1) {
      setToggle(true);
      setPartialValue([validRangeSteps[0]]);
    }
    if (partialValue[0] === 1) {
      setToggle(true);
    }
    if (toggle === false && value < validRangeSteps[0]) {
      setSliderValue([validRangeSteps[0]]);
    }
  }

  function handleToggle(e) {
    setToggle(!toggle);
    if (e.target.checked) {
      setSliderValue([1]);
    } else {
      setSliderValue([validRangeSteps[0]]);
      setToggle(false);
    }
    if (partialValue[0] === 1) {
      setToggle(true);
    }
  }

  const onCashoutHandler = (betBucketId, stake, quote, percentage) => {
    dispatch(cashout({ betBucketId, percentage, quote, stake }));
  };

  return (
    <>
      {cashoutConfirmed && (
        <SimpleBetslipSuccessModal
          setCashOutModalOpen={setCashOutModalOpen}
          onClose={() => {
            acknowledgeSubmission(dispatch, location.pathname, true);
          }}
        />
      )}
      <div className={classes["cash-out-modal"]} id="cash-out-modal">
        {modalContent && (
          <div className={classes["cash-out-modal-content"]}>
            <div className={classes["cash-out-modal-header"]}>
              <i className={classes["icon-inbox-out-solid"]} />
              <h2>{t("ez.set_cashout_amount")}</h2>
              <label className={cx(classes["switch"], classes["cash-out-switch"])} htmlFor="cash-out-switch">
                <input checked={toggle} id="cash-out-switch" type="checkbox" onChange={handleToggle} />
                <span className={cx(classes["switch-slider"], classes["round"])}>
                  <span>{toggle ? t("ez.cashout_mode_full") : t("ez.cashout_mode_partial")}</span>
                </span>
              </label>
            </div>
            <div className={classes["cash-out-modal-body"]}>
              <div>
                <h3>{t("ez.set_target_amount")}</h3>
                <div className={cx(classes["flex-al-center"], classes["krw-wrapper"])}>
                  <h2>
                    KRW
                    <span>{activeQuote && Math.floor(activeQuote.quote).toLocaleString()}</span>
                    <span className={classes["percentage"]}>{sliderValue * 100}%</span>
                  </h2>
                  <div>
                    <p>
                      {t("ez.min_cashout_amount")}
                      <span>{minQuote && Math.floor(minQuote).toLocaleString()}</span>
                      KRW
                    </p>
                    <p>
                      {t("ez.max_cashout_amount")}
                      <span>{maxQuote && Math.floor(maxQuote).toLocaleString()}</span>
                      KRW
                    </p>
                  </div>
                </div>

                <div className={classes["progress-bar-wrapper"]}>
                  <Range
                    max={1}
                    min={0}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          background: "#fd8f1f",
                          border: "0.5px solid #4e4e4e",
                          borderRadius: "100%",
                          height: "23px",
                          width: "23px",
                        }}
                      />
                    )}
                    renderTrack={({ children, props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,

                          background: getTrackBackground({
                            colors: ["#00acee", "#ffffff"],
                            max: 1,
                            min: 0,
                            values: sliderValue,
                          }),
                          border: "1px solid #e6e6e6",
                          borderRadius: "16px",
                          boxShadow: "0 2px 2px rgba(0, 0, 0, 0.08)",
                          height: "8px",
                          width: "247px",
                        }}
                      >
                        {children}
                      </div>
                    )}
                    step={0.1}
                    values={sliderValue}
                    onChange={(values) => handleSliderValue(values)}
                    onClick={(values) => handleSliderValue(values)}
                  />

                  <div className={cx(classes["flex-al-center"], classes["under-progress-bar"])}>
                    <small>
                      {t("ez.min_cashout_amount")}
                      <span>{minQuote && Math.floor(minQuote).toLocaleString()}</span>
                      KRW
                    </small>
                    <small style={{ marginRight: "-8px" }}>
                      {t("ez.max_cashout_amount")}
                      <span>{maxQuote && Math.floor(maxQuote).toLocaleString()}</span>
                      KRW
                    </small>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes["cash-out-modal-footer"]}>
              <button
                className={cx(classes["primary"], classes["confirmation-button"])}
                disabled={cashoutProcessing}
                type="button"
                onClick={() => {
                  onCashoutHandler(activeBet, activeQuote?.stake, activeQuote?.quote, sliderValue[0]);
                }}
              >
                {cashoutProcessing ? (
                  <FontAwesomeIcon
                    className="fa-spin"
                    icon={faSpinner}
                    style={{ "--fa-primary-color": "#00ACEE", "--fa-secondary-color": "#E6E6E6" }}
                  />
                ) : (
                  t("confirm")
                )}
              </button>
              <button
                className={cx(classes["default"], classes["close-cash-out-modal"])}
                type="button"
                onClick={() => setCashOutModalOpen(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        )}
      </div>

      {cashoutProcessing && (
        <div style={{ height: "100vh", left: "0", position: "fixed", top: "0", width: "100vw", zIndex: "50000" }} />
      )}
    </>
  );
};

CashOutQuotationModal.propTypes = propTypes;

CashOutQuotationModal.defaultProps = defaultProps;

export default CashOutQuotationModal;
