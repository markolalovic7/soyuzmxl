import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";

const propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

const defaultProps = {
  placeholder: undefined,
  value: undefined,
};

const InputSearchWithDebounce = ({ onChange, placeholder, value }) => {
  const [searchValue, setSearchValue] = useState(value);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceOnChange = useCallback(
    debounce((searchValue) => onChange(searchValue), 200),
    [onChange],
  );

  const onSearchValueChange = (event) => {
    setSearchValue(event.target.value);
    debounceOnChange(event.target.value);
  };

  const onSearchValueClear = () => {
    setSearchValue("");
    onChange("");
  };

  return (
    <div className={classes["overlay-burger__search"]}>
      <span className={`${classes["qicon-search"]} ${classes["menu-search"]}`} />
      <input id="text" placeholder={placeholder} type="text" value={searchValue} onChange={onSearchValueChange} />
      <span className={`${classes["close"]} ${classes["close-search"]}`} onClick={onSearchValueClear} />
    </div>
  );
};

InputSearchWithDebounce.propTypes = propTypes;
InputSearchWithDebounce.defaultProps = defaultProps;

export default InputSearchWithDebounce;
