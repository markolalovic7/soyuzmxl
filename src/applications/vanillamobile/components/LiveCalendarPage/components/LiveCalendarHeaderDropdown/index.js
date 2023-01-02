import { faCheck } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

import FontIcon from "applications/vanillamobile/common/components/FontIcon";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { useOnClickOutside } from "hooks/utils-hooks";

const propTypes = {
  bodyClassId: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func,
  renderDropdownIcon: PropTypes.func,
  renderItemIcon: PropTypes.func,
  selected: PropTypes.number,
};
const defaultProps = {
  isDisabled: false,
  onChange: undefined,
  renderDropdownIcon: undefined,
  renderItemIcon: undefined,
  selected: PropTypes.string,
};

const LiveCalendarHeaderDropdown = ({
  bodyClassId,
  isDisabled,
  items,
  onChange,
  renderDropdownIcon,
  renderItemIcon,
  selected,
}) => {
  const [isActive, setIsActive] = useState(false);

  const menuRef = useRef();
  useOnClickOutside(menuRef, () => setIsActive(false));

  const itemSelected = items.find((item) => item.value === selected);
  if (!itemSelected) {
    return null;
  }

  return (
    <li className={classes["live-calendar-select"]} id={bodyClassId}>
      <div
        className={classes["live-calendar-select__body"]}
        disabled={isDisabled}
        role="button"
        tabIndex={0}
        onClick={() => setIsActive(!isActive)}
      >
        {renderItemIcon && (
          <span className={classes["live-calendar-select__icon"]}>{renderItemIcon(itemSelected)}</span>
        )}
        {renderDropdownIcon && <span className={classes["live-calendar-select__icon"]}>{renderDropdownIcon()}</span>}
        <span className={classes["live-calendar-select__text"]}>{itemSelected.label}</span>
        <span className={`${classes["live-calendar-select__arrow"]} ${classes["active"]}`}>
          <span />
        </span>
      </div>
      <ul
        className={`${classes["live-calendar-select__sublist"]} ${classes["live-calendar-select"]} ${
          isActive ? classes["active"] : "none"
        }`}
        ref={menuRef}
      >
        {items.map((item) => {
          const isItemSelected = item.value === selected;
          const onItemClick = () => {
            onChange(item.value);
            setIsActive(false);
          };

          return (
            <li
              className={`${classes["live-calendar-select__subli"]} ${
                isItemSelected ? classes["live-calendar-select__subli_active"] : "none"
              }`}
              key={item.value}
              onClick={onItemClick}
            >
              {renderItemIcon && (
                <span className={classes["live-calendar-select__subli-icon"]}>{renderItemIcon(item)}</span>
              )}
              <span className={classes["live-calendar-select__subli-text"]}>{item.label}</span>
              {isItemSelected && (
                <span className={classes["live-calendar-select__subli-check"]}>
                  <FontIcon icon={faCheck} />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
};

LiveCalendarHeaderDropdown.propTypes = propTypes;
LiveCalendarHeaderDropdown.defaultProps = defaultProps;

export default LiveCalendarHeaderDropdown;
