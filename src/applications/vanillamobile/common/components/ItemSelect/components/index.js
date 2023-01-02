import PropTypes from "prop-types";

import classes from "../styles/index.module.scss";

const propTypes = {
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onSetFieldValue: PropTypes.func,
  value: PropTypes.string,
};
const defaultProps = {
  isDisabled: false,
  isRequired: false,
  label: undefined,
  onChange: undefined,
  onSetFieldValue: undefined,
  value: undefined,
};

const ItemSelect = ({ isDisabled, isRequired, items, label, name, onChange, onSetFieldValue, value }) => {
  const itemSelected = items.find((item) => item.value === value);

  if (!itemSelected) {
    return null;
  }

  const onChangePressed = (event) => {
    if (onSetFieldValue) {
      onSetFieldValue(name, event.target.value);
    }
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className={classes["item-select-wrapper"]}>
      {label && (
        <h4 className={classes["input__title"]}>
          <span>{`${label} `}</span>
          {isRequired && <span className={classes["input__star"]}>*</span>}
        </h4>
      )}
      <div className={classes["item-select-input-wrapper"]} disabled={isDisabled}>
        <select
          className={classes["item-select"]}
          disabled={isDisabled || items.length === 1}
          value={value}
          onChange={onChangePressed}
        >
          {items.map((item) => (
            <option key={item.key} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

ItemSelect.propTypes = propTypes;
ItemSelect.defaultProps = defaultProps;

export default ItemSelect;
