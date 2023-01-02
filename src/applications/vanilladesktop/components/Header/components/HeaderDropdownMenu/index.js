import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";

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
  const iframeMode = useSelector(getCmsConfigIframeMode);

  const [isOpened, setIsOpened] = useState(false);

  const selectedOption = options.find((option) => value === option.value);

  useOnClickOutside(menuRef, () => setIsOpened(false));

  return (
    <div className={classes["header__dropdown"]} ref={menuRef}>
      <ul className={classes["header__dropdown-list"]} onClick={() => setIsOpened((isOpened) => !isOpened)}>
        <li>
          <div
            className={cx(classes["header__dropdown-current"], classes["dropdown"], {
              [classes["active"]]: isOpened,
            })}
          >
            <span className={classes["header__dropdown-icon"]}>
              {selectedOption?.renderIcon?.() || renderDropdownIcon?.()}
            </span>
            {selectedOption?.label && (
              <div className={classes["header__dropdown-body"]}>
                <span className={classes["header__dropdown-title"]}>{selectedOption.label}</span>
                {/* <span className={classes["header__dropdown-arrow"]} /> */}
              </div>
            )}
          </div>
          <div
            className={cx(
              classes["header__dropdown-content"],
              { [classes["iframe"]]: iframeMode },
              classes["dropdown"],
              {
                [classes["open"]]: isOpened,
              },
            )}
          >
            <ul>
              {options.map((option) => (
                <li
                  className={cx(classes["header__dropdown-theme"], {
                    [classes["active"]]: value === option.value,
                  })}
                  key={option.value}
                  onClick={() => onChange(option.value)}
                >
                  <span className={classes["header__dropdown-docket"]}>{option.renderIcon?.()}</span>
                  <span className={classes["header__dropdown-label"]}>{option.label}</span>
                  <span className={classes["header__dropdown-check"]}>
                    <FontAwesomeIcon icon={faCheck} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

HeaderDropdownMenu.propTypes = propTypes;
HeaderDropdownMenu.defaultProps = defaultProps;

export default React.memo(HeaderDropdownMenu);
