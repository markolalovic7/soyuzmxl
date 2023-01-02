import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";

import SportItem from "./components/SportItem";

const propTypes = {
  backdropClick: PropTypes.func.isRequired,
  onLiveSportChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {};

const SportSelectorPanel = ({ backdropClick, onLiveSportChange, open }) => {
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  const sports = useSelector((state) => state.sport.sports);

  const treeSportArrays = useMemo(() => {
    let sportList = [];
    const treeSportArrays = [];
    const size = 3;
    if (europeanDashboardLiveData) {
      let totalCount = 0;
      Object.entries(europeanDashboardLiveData).forEach((entry) => {
        const sportCode = entry[0];
        const count = Object.keys(entry[1]).length;
        if (count > 0) {
          sportList.push({
            count,
            desc: sports ? sports[sportCode].description : "",
            iconSportCode: sportCode,
            sportCode,
          });
          totalCount += count;
        }
      });
      sportList = [{ count: totalCount, desc: "ALL", iconSportCode: "default", sportCode: "ALL" }, ...sportList];
    }
    for (let i = 0; i < sportList.length; i += size) {
      treeSportArrays.push(sportList.slice(i, i + size));
    }

    return treeSportArrays;
  }, [europeanDashboardLiveData]);

  return (
    <div className={`${classes["overlay-sports"]} ${open ? classes["active"] : ""}`} onClick={backdropClick}>
      <div className={`${classes["overlay-sports__container"]} ${open ? classes["active"] : ""}`}>
        <div className={classes["overlay-sports__body"]}>
          {treeSportArrays.map((row, index) => (
            <div
              className={classes["overlay-sports__row"]}
              id={`overlay-sports__row-${index}`}
              key={`overlay-sports__row-${index}`}
            >
              {row.map((sport) => (
                <SportItem
                  count={sport.count}
                  desc={sport.desc}
                  iconSportCode={sport.iconSportCode.toLowerCase()}
                  key={sport.sportCode}
                  sportCode={sport.sportCode}
                  onLiveSportChange={onLiveSportChange}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SportSelectorPanel.propTypes = propTypes;
SportSelectorPanel.defaultProps = defaultProps;

export default memo(SportSelectorPanel);
