import isEmpty from "lodash.isempty";
import { useDispatch, useSelector } from "react-redux";

import { getSortedLiveMatches } from "../../../utils";

import ListItemLiveMatch from "./ListItemLiveMatch";
import { useLiveData } from "applications/common/hooks/useLiveData";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getLiveEuropeanDashboardData } from "redux/reselect/live-selector";
import { getSportsSelector } from "redux/reselect/sport-selector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const propTypes = {};
const defaultProps = {};

const LiveEuropeanPage = () => {
  const dispatch = useDispatch();

  const liveDataEuropeanDashboard = useSelector(getLiveEuropeanDashboardData);
  const sports = useSelector(getSportsSelector);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  if (!liveDataEuropeanDashboard) {
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );
  }

  return (
    <div className={classes["main"]}>
      {Object.keys(liveDataEuropeanDashboard)
        .filter((sport) => !isEmpty(liveDataEuropeanDashboard[sport]))
        .map((sport, index) => (
          <ListItemLiveMatch
            isDefaultExpanded={index === 0}
            key={sport}
            matches={getSortedLiveMatches(Object.values(liveDataEuropeanDashboard[sport]))}
            sportCode={sport.toLowerCase()}
            sportsDescription={sports[sport]?.description}
          />
        ))}
    </div>
  );
};

LiveEuropeanPage.propTypes = propTypes;
LiveEuropeanPage.defaultProps = defaultProps;

export default LiveEuropeanPage;
