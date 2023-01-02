import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";

const propTypes = {
  activeEventId: PropTypes.number,
  matches: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
};
const defaultProps = {
  activeEventId: undefined,
};

const UpcomingMatchesTabs = ({ activeEventId, matches, onSelect }) => {
  const currentIndex = matches.findIndex((m) => m.id === activeEventId);

  const selectPreviousTab = () => {
    if (currentIndex > 0) {
      onSelect(matches[currentIndex - 1].id);
    }
  };

  const selectNextTab = () => {
    if (currentIndex < matches.length - 1) {
      onSelect(matches[currentIndex + 1].id);
    }
  };

  return (
    <div className={classes["matches-tabs"]}>
      {matches.map((m, index) => {
        const matchDay = m.desc.split(" ")[0];

        return (
          <div
            className={cx(classes["match-tab"], { [classes["active"]]: activeEventId === m.id })}
            key={index}
            onClick={() => onSelect(m.id)}
          >
            {matchDay}
          </div>
        );
      })}
      {matches?.length > 0 && (
        <>
          <div
            className={classes["matches-tabs__button"]}
            style={{
              cursor: currentIndex > 0 ? "pointer" : "default",
              opacity: currentIndex > 0 ? 1 : 0.5,
              pointerEvents: currentIndex > 0 ? "auto" : "none",
            }}
            onClick={selectPreviousTab}
          >
            <span />
          </div>
          <div
            className={classes["matches-tabs__button"]}
            style={{
              cursor: currentIndex < matches.length - 1 ? "pointer" : "default",
              opacity: currentIndex < matches.length - 1 ? 1 : 0.5,
              pointerEvents: currentIndex < matches.length - 1 ? "auto" : "none",
            }}
            onClick={selectNextTab}
          >
            <span />
          </div>
        </>
      )}
    </div>
  );
};

UpcomingMatchesTabs.propTypes = propTypes;
UpcomingMatchesTabs.defaultProps = defaultProps;

export default UpcomingMatchesTabs;
