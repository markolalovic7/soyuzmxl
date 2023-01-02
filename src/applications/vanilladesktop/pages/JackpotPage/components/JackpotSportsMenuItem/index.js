import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";

import JackpotSportsMenuSubItem from "../JackpotSportsMenuSubItem";

const propTypes = {
  activeJackpotId: PropTypes.number,
  icon: PropTypes.string.isRequired,
  jackpots: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired }).isRequired).isRequired,
  label: PropTypes.string.isRequired,
  setActiveJackpotId: PropTypes.func.isRequired,
};

const defaultProps = {
  activeJackpotId: undefined,
};

const JackpotSportsMenuItem = ({ activeJackpotId, icon, jackpots, label, setActiveJackpotId }) => {
  const [isOpened, setIsOpened] = useState(true);

  return (
    <li className={classes["menu-sports__item"]}>
      <div className={cx(classes["menu-sports__item-content"], classes["accordion"])}>
        <span className={classes["menu-sports__item-icon"]}>
          <span className={classes[`qicon-${icon}`]} />
        </span>
        <h4 className={classes["menu-sports__item-title"]}>{label}</h4>
        <span
          className={cx(classes["menu-sports__item-arrow"], classes["accordion-arrow"], {
            [classes["active"]]: isOpened,
          })}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpened((isSelected) => !isSelected);
          }}
        />
      </div>
      {jackpots?.length &&
        jackpots.map(({ description, id }, index) => (
          <JackpotSportsMenuSubItem
            activeJackpotId={activeJackpotId}
            isOpened={isOpened}
            jackpotId={id}
            key={index}
            label={description}
            setActiveJackpotId={setActiveJackpotId}
          />
        ))}
    </li>
  );
};

JackpotSportsMenuItem.propTypes = propTypes;
JackpotSportsMenuItem.defaultProps = defaultProps;

export default JackpotSportsMenuItem;
