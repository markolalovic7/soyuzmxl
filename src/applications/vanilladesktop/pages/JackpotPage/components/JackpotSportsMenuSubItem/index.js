import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";

const JackpotSportsMenuSubItem = ({ activeJackpotId, isOpened, jackpotId, label, setActiveJackpotId }) => (
  <ul className={classes["menu-sports__sublist"]}>
    <li className={cx(classes["menu-sports__subitem"])} onClick={() => setActiveJackpotId(jackpotId)}>
      <div
        className={cx(
          classes["menu-sports__subitem-content"],
          classes["menu-sports__subitem-content_jackpot"],
          classes["accordion"],
          { [classes["open"]]: isOpened },
          {
            [classes["active"]]: activeJackpotId === jackpotId,
          },
        )}
      >
        <h5 className={cx(classes["menu-sports__subitem-jackpot"])}>{label}</h5>
      </div>
    </li>
  </ul>
);

JackpotSportsMenuSubItem.propTypes = {
  activeJackpotId: PropTypes.number,
  isOpened: PropTypes.bool.isRequired,
  jackpotId: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  setActiveJackpotId: PropTypes.func.isRequired,
};

JackpotSportsMenuSubItem.defaultProps = {
  activeJackpotId: undefined,
};

export default JackpotSportsMenuSubItem;
