/**
 * Created by brett.hadley on 29/07/2015.
 */
import cx from "classnames";
import React from "react";

export default class ReactSlider extends React.Component {
  static defaultProps = {
    alignInputToStep: true,
    barClassName: "slider__bar",
    className: "slider",
    containerClassName: "slider__container",
    defaultValue: 0,
    disabled: false,
    editable: false,
    evenStepSpacing: false,
    handleActiveClassName: "slider__handle--active",
    handleClassName: "slider__handle",
    inputClassName: "slider__input",
    invert: false,
    labelClassName: "slider__label",
    max: 100,
    min: 0,
    orientation: "horizontal",
    outputClassName: "slider__output",
    snapDragDisabled: false,
    valuePrefix: null,
    valueSuffix: null,
  };

  state = {
    sliderLength: 0,
    sliderStart: 0,
    upperBound: 0,
  };

  componentWillReceiveProps(nextProps) {
    const value = nextProps.value
      ? this._trimValue(nextProps.value, nextProps)
      : this._trimValue(nextProps.defaultValue, nextProps);

    if (this.state.value != value) {
      // eslint-disable-line
      this.setState({
        enteredValue: value,
        value,
      });
    }
  }

  componentWillMount() {
    // props as initial state is anti pattern so moving to willMount hook.
    // also fixes bugwith IE9/10 where this.props in undefined when used with state = { ... }
    this.setState({
      enteredValue: this.props.value ? this.props.value : this.props.defaultValue,
      value: this.props.value ? this.props.value : this.props.defaultValue,
    });
  }

  componentDidMount() {
    window.addEventListener("resize", this._handleResize);
    this._handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this._handleResize);
  }

  getValue() {
    return this.state.value;
  }

  _handleResize = () => {
    const slider = this.refs.slider;
    const handle = this.refs.handle;

    if (slider) {
      const rect = slider.getBoundingClientRect();
      const size = this._sizeKey();

      const sliderMax = rect[this._stylePositionMaxOffset()];
      const sliderMin = rect[this._stylePositionMinOffset()];

      this.setState({
        handleSize: handle[size],
        sliderLength: Math.abs(sliderMax - sliderMin),
        sliderStart: sliderMin,
        upperBound: slider[size] - handle[size],
      });
    } else {
      this.forceUpdate();
    }
  };

  _calcOffset(val = this.state.value) {
    const ratio = (val - this.props.min) / (this.props.max - this.props.min);

    return ratio * 100;
  }

  _calcDisplayOffset(val = this.state.value) {
    if (this.props.evenStepSpacing) {
      const indexOfVal = this.props.step.findIndex((ele) => val === ele);

      return this._calcEvenStepPosition()[indexOfVal];
    }

    return this._calcOffset(val);
  }

  _calcValue(offset) {
    const ratio = offset / this.state.upperBound;

    return ratio * (this.props.max - this.props.min) + this.props.min;
  }

  _calcOffsetFromPosition = (position) => {
    let pixelOffset = position - this.state.sliderStart;
    pixelOffset -= this.state.handleSize / 2;

    return pixelOffset;
  };

  _forceValueFromPosition = (position) => {
    const pixelOffset = this._calcOffsetFromPosition(position);
    const nextValue = this._trimAlignValue(this._calcValue(pixelOffset));

    this.setState({
      enteredValue: nextValue,
      value: nextValue,
    });
  };

  _getMousePosition = (e) => [e[`page${this._axisKey()}`], e[`page${this._orthogonalAxisKey()}`]];

  _getTouchPosition = (e) => {
    const touch = e.touches[0];

    return [touch[`page${this._axisKey()}`], touch[`page${this._orthogonalAxisKey()}`]];
  };

  _getMouseEventMap = () => ({
    mousemove: this._onMouseMove,
    mouseup: this._onMouseUp,
  });

  _getTouchEventMap = () => ({
    touchend: this._onTouchEnd,
    touchmove: this._onTouchMove,
  });

  _createMouseEvent = (e) => {
    if (this.props.disabled) return;
    const position = this._getMousePosition(e);
    this._start(position[0]);
    this._addHandlers(this._getMouseEventMap());
    e.preventDefault();
  };

  _createOnTouchStart = (e) => {
    if (this.props.disabled || e.touches.length > 1) return;
    const position = this._getTouchPosition(e);

    this.isScrolling = undefined; // don't know yet if the user is trying to scroll
    this._start(position[0]);
    this._addHandlers(this._getTouchEventMap());
    e.stopPropagation();
  };

  _addHandlers = (eventMap) => {
    for (const key in eventMap) {
      if (eventMap.hasOwnProperty(key)) {
        document.addEventListener(key, eventMap[key], false);
      }
    }
  };

  _removeHandlers(eventMap) {
    for (const key in eventMap) {
      if (eventMap.hasOwnProperty(key)) {
        document.removeEventListener(key, eventMap[key], false);
      }
    }
  }

  _start = (position) => {
    // if activeElement is body window will lost focus in IE9
    if (document.activeElement && document.activeElement != document.body) {
      // eslint-disable-line
      document.activeElement.blur();
    }

    this.hasMoved = false;

    this._fireChangeEvent("onBeforeChange");

    this.setState({
      startPosition: position,
      startValue: this.state.value,
    });
  };

  _onMouseUp = () => {
    this._onEnd(this._getMouseEventMap());
    this._fireChangeEvent("onSliderRelease");
  };

  _onTouchEnd = () => {
    this._onEnd(this._getTouchEventMap());
    this._fireChangeEvent("onSliderRelease");
  };

  _onEnd = (eventMap) => {
    this._removeHandlers(eventMap);
    this._fireChangeEvent("onAfterChange");
  };

  _onMouseMove = (e) => {
    const position = this._getMousePosition(e);
    this._move(position[0]);
  };

  _onTouchMove = (e) => {
    if (e.touches.length > 1) return;

    const position = this._getTouchPosition(e);

    if (typeof this.isScrolling === "undefined") {
      const diffMainDir = position[0] - this.state.startPosition[0];
      const diffScrollDir = position[1] - this.state.startPosition[1];
      this.isScrolling = Math.abs(diffScrollDir) > Math.abs(diffMainDir);
    }

    e.preventDefault();

    this._move(position[0]);
  };

  _move(position) {
    this.hasMoved = true;

    const diffPosition = position - this.state.startPosition;

    const diffValue =
      (diffPosition / (this.state.sliderLength - this.state.handleSize)) * (this.props.max - this.props.min);
    const newValue = this._trimAlignValue(this.state.startValue + diffValue);

    if (newValue !== this.state.value) {
      this.setState(
        {
          enteredValue: newValue,
          value: newValue,
        },
        this._fireChangeEvent("onChange"),
      );
    }
  }

  _axisKey() {
    if (this.props.orientation === "vertical") {
      return "Y";
    }

    return "X";
  }

  _orthogonalAxisKey() {
    if (this.props.orientation === "vertical") {
      return "X";
    }

    return "Y";
  }

  _stylePositionMinOffset() {
    if (this.props.orientation === "vertical") {
      return "top";
    }

    return "left";
  }

  _stylePositionMaxOffset() {
    if (this.props.orientation === "vertical") {
      return "bottom";
    }

    return "right";
  }

  _sizeKey() {
    if (this.props.orientation === "vertical") return "clientHeight";

    return "clientWidth";
  }

  _trimAlignValue(val) {
    return this._alignValue(this._trimValue(val));
  }

  _trimValue(val, props = this.props) {
    let newVal = val;

    if (newVal < props.min) newVal = props.min;
    if (newVal > props.max) newVal = props.max;

    return newVal;
  }

  _alignValue(val) {
    if (Array.isArray(this.props.step)) {
      return this.alignValueToSteps(val);
    }

    const valModStep = (val - this.props.min) % this.props.step;
    let alignValue = val - valModStep;

    if (Math.abs(valModStep) * 2 >= this.props.step) {
      alignValue += valModStep > 0 ? this.props.step : -this.props.step;
    }

    if (alignValue + this.props.step > this.props.max) {
      alignValue = this.props.max;
    }

    return parseFloat(alignValue.toFixed(5));
  }

  alignValueToSteps(val) {
    const percentOfSlider = Math.abs(this._calcOffset(val));
    const range = this.props.max - this.props.min;
    const onePercent = range / 100;
    let normalisedSteps;

    if (this.props.evenStepSpacing) {
      normalisedSteps = this._calcEvenStepPosition();
    } else {
      normalisedSteps = this.props.step.map((step) => Math.abs((step - this.props.min) / onePercent));
    }

    let index = -1;

    normalisedSteps.some((step, i) => {
      if (step === percentOfSlider) {
        index = i;

        return true;
      }

      if (step > percentOfSlider) {
        const lastVal = normalisedSteps[i - 1];
        const curr = step;

        const a = percentOfSlider - lastVal;
        const b = curr - percentOfSlider;

        index = a > b ? i : i - 1;

        return true;
      }

      return false;
    });

    return this.props.step[index];
  }

  _onSliderClick = (e) => {
    e.preventDefault();
    this._fireChangeEvent("onSliderClick");
  };

  _onSliderMouseDown = (e) => {
    if (this.props.disabled) return;

    this.hasMoved = false;

    if (!this.props.snapDragDisabled) {
      const position = this._getMousePosition(e);

      this._forceValueFromPosition(position[0]);

      this._start(position[0]);
      this._addHandlers(this._getMouseEventMap());
    }

    e.preventDefault();
  };

  _fireChangeEvent(event) {
    if (this.props[event]) {
      this.props[event](this.state.value);
    }
  }

  _onInputChange = (e) => {
    const value = e.target.value;
    this.setState({
      enteredValue: value,
    });
  };

  _onInputBlur = (e) => {
    let newValue;
    if (!e.target.value) {
      newValue = this.state.value;
    } else {
      newValue = this.state.enteredValue;
    }

    newValue = this._trimValue(parseInt(newValue, 10));

    if (this.props.alignInputToStep) {
      newValue = this._alignValue(newValue);
    }

    const input = this.refs.input;

    input.value = newValue;

    this.setState({
      enteredValue: newValue,
      value: newValue,
    });

    if (this.props.onInputChange) {
      this.props.onInputChange(newValue);
    }
  };

  _onInputFocus = () => {
    const input = this.refs.input.getDOMNode();

    input.value = "";
  };

  _onKeyUp = (e) => {
    const enterKey = 13;
    if (e.which === enterKey) {
      this._onInputBlur(e);
    }
  };

  _calcEvenStepPosition() {
    const ticks = [];
    const range = this.props.max - this.props.min;
    let stepCount;
    let tickSpace;

    if (Array.isArray(this.props.step)) {
      stepCount = this.props.step.length;
      tickSpace = 100 / (stepCount - 1);
    } else {
      stepCount = range / this.props.step + 1;
      tickSpace = 100 / (stepCount - 1);
    }

    for (let i = 0; i < stepCount; i++) {
      ticks.push(tickSpace * i);
    }

    return ticks;
  }

  _buildHandleStyle(offset) {
    // console.log(offset);
    const style = {
      position: "absolute",
      zIndex: 10,
    };

    style[this._stylePositionMinOffset()] = `${offset}%`;

    return style;
  }

  _buildBarStyle(left, right) {
    const style = {
      position: "absolute",
    };

    const _left = isNaN(left) ? 0 : left;
    const _right = isNaN(right) ? 0 : right;

    style[this._stylePositionMinOffset()] = `${_left}%`;
    style[this._stylePositionMaxOffset()] = `${100 - _right}%`;

    return style;
  }

  _renderHandle() {
    const offset = this._calcDisplayOffset();
    const classes = {};
    classes[this.props.handleClassName] = true;
    const handleClass = cx(classes);
    const style = this._buildHandleStyle(offset);

    return (
      <div
        aria-labelledby={this.props.labelClassName}
        aria-valuemax={this.props.max}
        aria-valuemin={this.props.min}
        aria-valuenow={this.props.value}
        className={handleClass}
        key="handle"
        ref="handle"
        role="slider"
        style={style}
        onMouseUp={this._createMouseEvent}
        onTouchStart={this._createOnTouchStart}
      />
    );
  }

  _renderBar = (i, left, right) => {
    const classes = {};
    classes[this.props.barClassName] = true;
    classes[`${this.props.barClassName}--${i}`] = true;
    const barclass = cx(classes);
    const style = this._buildBarStyle(left, right);

    return <div className={barclass} key={`bar${i}`} ref={`bar${i}`} style={style} />;
  };

  _renderTick = (left) => {
    const style = {
      backgroundColor: "red",
      bottom: "0px",
      left: `${left}%`,
      position: "absolute",
      top: "0px",
      width: "1px",
    };

    return <span style={style} />;
  };

  _renderTicks = () => {
    const range = this.props.max - this.props.min;

    if (Array.isArray(this.props.step) && !this.props.evenStepSpacing) {
      const onePercent = range / 100;

      return this.props.step.map((step) => this._renderTick(Math.abs((step - this.props.min) / onePercent)));
    }

    return this._calcEvenStepPosition().map((offset) => this._renderTick(offset));
  };

  _renderBars = () => {
    const offset = this._calcDisplayOffset();
    const bars = [];

    bars.push(this._renderBar(0, 0, offset));
    bars.push(this._renderBar(1, offset, 100));

    return bars;
  };

  _renderInputOutput() {
    const label = this.props.label ? (
      <span className={`${this.props.labelClassName} ${this.props.labelClassName}--before`}>{this.props.label}</span>
    ) : null;
    const labelAfter = this.props.labelAfter ? (
      <span className={`${this.props.labelClassName} ${this.props.labelClassName}--after`}>
        {this.props.labelAfter}
      </span>
    ) : null;
    const prefix = this.props.valuePrefix ? (
      <span className="slider__value__prefix">{this.props.valuePrefix}</span>
    ) : null;
    const suffix = this.props.valueSuffix ? (
      <span className="slider__value__suffix">{this.props.valueSuffix}</span>
    ) : null;

    if (this.props.editable) {
      return (
        <div className={this.props.inputClassName}>
          {label}
          <div className="slider__value-prefix-suffix">
            {prefix}
            <input
              className="slider__value"
              max={this.props.max}
              min={this.props.min}
              ref="input"
              type="number"
              value={this.state.enteredValue}
              onBlur={this._onInputBlur}
              onChange={this._onInputChange}
              onFocus={this._onInputFocus}
              onKeyUp={this._onKeyUp}
            />
            {suffix}
          </div>
          {labelAfter}
        </div>
      );
    }

    return (
      <div className={this.props.outputClassName}>
        {label}
        <div className="slider__value-prefix-suffix">
          <div className="slider__value">
            {prefix}
            {this.state.value}
            {suffix}
          </div>
        </div>
        {labelAfter}
      </div>
    );
  }

  render() {
    const bars = this._renderBars();
    const handle = this._renderHandle();
    const output = this._renderInputOutput();

    const sliderClass = cx({
      [this.props.className]: true,
      disabled: this.props.disabled,
    });

    return (
      <div className={this.props.containerClassName}>
        {output}
        <div className="slider__holder">
          <div className={sliderClass} ref="slider" onClick={this._onSliderClick} onMouseDown={this._onSliderMouseDown}>
            {bars}
            {this._renderTicks()}
            {handle}
          </div>
        </div>
      </div>
    );
  }
}
