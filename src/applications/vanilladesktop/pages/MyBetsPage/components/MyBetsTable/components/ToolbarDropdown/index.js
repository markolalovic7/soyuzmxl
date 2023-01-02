import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import { useOnClickOutside } from "hooks/utils-hooks";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { BET_TYPE_PENDING, BET_TYPE_SETTLED } from "../../../../../../../../constants/bet-types";

const ToolbarDropdown = ({ setTabActive, tabActive }) => {
  const { t } = useTranslation();
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
                {tabActive === BET_TYPE_SETTLED
                  ? t("vanilladesktop.financial_table.settled")
                  : t("vanilladesktop.financial_table.pending")}
              </span>
              <span className={classes["filter__dropdown-arrow"]} />
            </div>
          </div>
          <div
            className={cx(classes["filter__dropdown-content"], classes["dropdown"], {
              [classes["open"]]: isOpened,
            })}
          >
            <ul>
              <li
                className={cx(
                  classes["filter__dropdown-theme"],
                  tabActive === BET_TYPE_SETTLED ? classes["active"] : null,
                )}
                onClick={() => setTabActive(BET_TYPE_SETTLED)}
              >
                <span className={classes["filter__dropdown-label"]}>settled bets</span>
              </li>
              <li
                className={cx(
                  classes["filter__dropdown-theme"],
                  tabActive === BET_TYPE_PENDING ? classes["active"] : null,
                )}
                onClick={() => setTabActive(BET_TYPE_PENDING)}
              >
                <span className={classes["filter__dropdown-label"]}>Pending Bets</span>
              </li>
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
};

export default ToolbarDropdown;
