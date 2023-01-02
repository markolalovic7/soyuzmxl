import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Range } from "react-range";
import { useDispatch, useSelector } from "react-redux";

import classes from "../../../../scss/betpoint.module.scss";

const propTypes = {
  active: PropTypes.bool.isRequired,
  betBucketId: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  onCashoutHandler: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
  onSliderValueChange: PropTypes.func.isRequired,
  quotes: PropTypes.object.isRequired,
  stake: PropTypes.number.isRequired,
};
const CashoutExpansionCard = ({
  active,
  betBucketId,
  disabled,
  onCashoutHandler,
  onExpand,
  onSliderValueChange,
  quotes,
  stake,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cashoutProcessing = useSelector((state) => state.cashout.cashoutProcessing);
  const cashoutConfirmed = useSelector((state) => state.cashout.cashoutConfirmed);
  const cashoutFailed = useSelector((state) => state.cashout.cashoutFailed);
  const currencyCode = useSelector((state) => state.auth.currencyCode);

  const [rangeValue, setRangeValue] = useState([100]);

  const activeQuote = quotes.find((quote) => quote.percentage * 100 === rangeValue[0]);
  const validRangeSteps = [];
  quotes.forEach((quote) => {
    if (quote.stake > 0.99) {
      validRangeSteps.push(quote.percentage * 100);
    }
  });

  useEffect(() => {
    if (cashoutConfirmed) {
      setRangeValue([100]);
    }
  }, [cashoutConfirmed]);

  return (
    <div className={cx(classes["cashout__cash"], classes["open"])}>
      <div className={classes["cashout__cash-top"]}>
        <div className={classes["cashout__cash-stake"]}>
          <span>Stake:</span> <span>{activeQuote ? activeQuote.stake : 0}</span>
        </div>
        <div className={classes["cashout__cash-profit"]}>
          <span>Profit:</span>
          <span>{(activeQuote ? activeQuote.quote - activeQuote.stake : 0).toLocaleString()}</span>
        </div>
      </div>
      {/* Do not show the range if the only option is "100%" */}
      {validRangeSteps.length > 1 && (
        <div className={classes["cashout__cash-range"]}>
          <Range
            max={100}
            min={validRangeSteps?.length > 0 ? validRangeSteps[0] : 10}
            renderThumb={({ props }) => (
              <div
                className={classes["ui-slider-handle"]}
                {...props}
                style={{
                  // eslint-disable-next-line react/prop-types
                  ...props.style,
                }}
              />
            )}
            renderTrack={({ children, props }) => (
              <div className={classes["cashout__range"]}>
                <div className={classes["cashout__range-result"]}>
                  <div>{`${[rangeValue]}%`}</div>
                </div>
                <div
                  className={classes["range-slider"]}
                  // eslint-disable-next-line react/prop-types
                  ref={props.ref}
                  // eslint-disable-next-line react/prop-types
                  onMouseDown={props.onMouseDown}
                  // eslint-disable-next-line react/prop-types
                  onTouchStart={props.onTouchStart}
                >
                  {children}
                </div>
              </div>
            )}
            step={10}
            values={rangeValue}
            onChange={(values) => {
              setRangeValue(values);
              onSliderValueChange(values[0]);
            }}
          />
        </div>
      )}

      <button
        className={classes["cashout__cash-button"]}
        disabled={cashoutProcessing || !activeQuote}
        type="submit"
        onClick={() => onCashoutHandler(betBucketId, activeQuote.stake, activeQuote.quote, rangeValue[0] / 100)}
      >
        {cashoutProcessing ? (
          <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
        ) : (
          t("betslip_panel.cash_out", {
            value: `${currencyCode} ${activeQuote ? activeQuote.quote.toLocaleString() : 0}`,
          })
        )}
      </button>
    </div>
  );
};

CashoutExpansionCard.propTypes = propTypes;

export default React.memo(CashoutExpansionCard);
