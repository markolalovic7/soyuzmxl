import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { Range } from "react-range";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {
  rangeValue: PropTypes.array.isRequired,
  setRangeValue: PropTypes.func.isRequired,
  validRangeSteps: PropTypes.array.isRequired,
};

const CashoutRange = ({ rangeValue, setRangeValue, validRangeSteps }) => {
  if (isEmpty(validRangeSteps)) return null;

  return (
    <div className={classes["mybets__cash-range"]}>
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
          <div className={classes["mybets__range"]}>
            <div className={classes["mybets__range-result"]}>
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
        }}
      />
    </div>
  );
};

CashoutRange.propTypes = propTypes;

export default CashoutRange;
