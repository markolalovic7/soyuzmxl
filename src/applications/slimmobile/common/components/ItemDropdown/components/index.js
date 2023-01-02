import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { memo, useCallback, useRef, useState } from "react";

const propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      img: PropTypes.shape({
        alt: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }),
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  renderIcon: PropTypes.func,
  value: PropTypes.string.isRequired,
};

const defaultProps = {
  renderIcon: undefined,
};

const ItemDropdown = ({ items, onChange, renderIcon, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const itemSelected = items.find((item) => item.value === value);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const renderOptions = useCallback(
    () =>
      items.map((item) => (
        <li
          className={`${classes["settings__subli"]} ${item.value === value && classes["settings__subli_active"]}`}
          key={item.value}
          onClick={() => onChange(item.value)}
        >
          <span className={classes["settings__subli-icon"]}>
            {item.img?.src && <img alt={item.img.alt} src={item.img.src} />}
          </span>
          <span className={classes["settings__subli-text"]}>{item.label}</span>
          <span className={classes["settings__subli-check"]}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
        </li>
      )),
    [items, value, onChange],
  );

  if (!itemSelected) {
    return null;
  }

  return (
    <li
      className={`${classes["settings__li"]} ${isOpen ? classes["active"] : ""}`}
      ref={dropdownRef}
      onClick={() => setIsOpen((isOpen) => !isOpen)}
    >
      {renderIcon ? (
        <span className={classes["settings__icon"]}>{renderIcon()}</span>
      ) : (
        itemSelected?.img?.src && (
          <span className={classes["settings__icon"]}>
            <i>
              <img alt={itemSelected.img.alt} src={itemSelected.img.src} />
            </i>
          </span>
        )
      )}
      <div className={classes["settings__li-body"]}>
        <span className={classes["settings__text"]}>{itemSelected.label}</span>
        <span className={classes["settings__arrow"]}>
          <span />
        </span>
      </div>
      <ul className={`${classes["settings__sublist"]} ${isOpen ? classes["active"] : ""}`}>{renderOptions()}</ul>
    </li>
  );
};

ItemDropdown.propTypes = propTypes;
ItemDropdown.defaultProps = defaultProps;

export default memo(ItemDropdown);
