import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

import { useOnClickOutside } from "../../../../../../../../hooks/utils-hooks";

const propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      renderIcon: PropTypes.func,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  renderDropdownIcon: PropTypes.func,
  value: PropTypes.string.isRequired,
};

const defaultProps = {
  renderDropdownIcon: null,
};
const HeaderDropdownMenu = ({ onChange, options, renderDropdownIcon, value }) => {
  const menuRef = useRef();
  const [isOpened, setIsOpened] = useState(false);
  const selectedOption = options.find((option) => value === option.value);

  useOnClickOutside(menuRef, () => setIsOpened(false));

  return (
    <div
      className={cx(classes["header-controls__item"], {
        [classes["active"]]: isOpened,
      })}
      ref={menuRef}
      onClick={() => setIsOpened((isOpened) => !isOpened)}
    >
      <div className={classes["header-controls__icon"]}>{selectedOption?.renderIcon?.() || renderDropdownIcon?.()}</div>
      {selectedOption?.label && <div className={classes["header-controls__text"]}>{selectedOption.label}</div>}
      <div className={classes["header-controls__arrow"]}>
        <FontAwesomeIcon icon={faChevronDown} />
      </div>
      <ul className={classes["header-controls__dd"]}>
        {options.map((option) => (
          <li
            className={classes["header-controls__dd-item"]}
            key={option.value}
            onClick={() => {
              onChange(option.value);
            }}
          >
            {option.renderIcon && <span className={classes["header-controls__dd-icon"]}>{option.renderIcon?.()}</span>}
            <span className={classes["header-controls__dd-text"]}>{option.label}</span>
            {value === option.value && <span className={classes["header-controls__dd-checkmark"]} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

HeaderDropdownMenu.propTypes = propTypes;
HeaderDropdownMenu.defaultProps = defaultProps;

export default React.memo(HeaderDropdownMenu);
