import isEmpty from "lodash.isempty";
import { useDispatch, useSelector } from "react-redux";

import { getSortedLiveMatches } from "../../../utils";

import ListItemLiveMatch from "./ListItemLiveMatch";
import { useLiveData } from "applications/common/hooks/useLiveData";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getSportsSelector } from "redux/reselect/sport-selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const LiveAsianPage = () => {
  const dispatch = useDispatch();

  const asianDashboardLiveData = useSelector((state) =>
    state.live.liveData["asian-dashboard"]
      ? Object.keys(state.live.liveData["asian-dashboard"])
          // .filter((key) => key === sportCode)
          .reduce((obj, key) => {
            obj[key] = state.live.liveData["asian-dashboard"][key];

            return obj;
          }, {})
      : undefined,
  );

  const sports = useSelector(getSportsSelector);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "asian-dashboard");

  if (!asianDashboardLiveData) {
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  return (
    <div className={classes["main"]}>
      {Object.keys(asianDashboardLiveData)
        .filter((sport) => !isEmpty(asianDashboardLiveData[sport]))
        .map((sport, index) => (
          <ListItemLiveMatch
            isDefaultExpanded={index === 0}
            key={sport}
            matches={getSortedLiveMatches(Object.values(asianDashboardLiveData[sport]))}
            sportCode={sport.toLowerCase()}
            sportsDescription={sports[sport]?.description}
          />
        ))}
    </div>
  );
};

LiveAsianPage.propTypes = propTypes;
LiveAsianPage.defaultProps = defaultProps;

export default LiveAsianPage;
