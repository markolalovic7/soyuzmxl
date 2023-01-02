import classes from "applications/slimdesktop/scss/slimdesktop.module.scss";
import cx from "classnames";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

const ToolbarDropdown = ({ setTabActive, tabActive, tabs }) => {
  const ref = useRef();
  const [isOpened, setIsOpened] = useState(false);

  useOnClickOutside(ref, () => setIsOpened(false));

  return (
    <div className={classes["filter__dropdown"]} ref={ref} onClick={() => setIsOpened((isOpened) => !isOpened)}>
      <ul className={classes["filter__dropdown-list"]}>
        <li>
          <div
            className={cx(classes["filter__dropdown-current"], classes["dropdown"], {
              [classes["active"]]: isOpened,
            })}
          >
            <div className={classes["filter__dropdown-body"]}>
              <span className={classes["filter__dropdown-title"]}>
                {tabs.find((tab) => tabActive === tab.value)?.label}
              </span>
              <span
                className={classes["filter__dropdown-arrow"]}
                style={{ display: "inline-block", margin: "0 0 0 20px", position: "unset", transform: "unset" }}
              />
            </div>
          </div>
          <div
            className={cx(classes["filter__dropdown-content"], classes["dropdown"], {
              [classes["open"]]: isOpened,
            })}
          >
            <ul>
              {tabs.map((tab) => (
                <li
                  className={cx(classes["filter__dropdown-theme"], tabActive === tab.value ? classes["active"] : null)}
                  key={tab.value}
                  onClick={() => setTabActive(tab.value)}
                >
                  <span className={classes["filter__dropdown-label"]}>{tab.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

ToolbarDropdown.propTypes = {
  setTabActive: PropTypes.func.isRequired,
  tabActive: PropTypes.string.isRequired,
  tabs: PropTypes.array.isRequired,
};

export default ToolbarDropdown;
