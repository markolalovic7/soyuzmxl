import PropTypes from "prop-types";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLiveData } from "applications/common/hooks/useLiveData";
import LiveEuropeanMatch from "applications/vanillamobile/common/components/LiveEuropeanMatch";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { makeGetEuropeanDashboardLiveDataBySportCode } from "redux/reselect/live-selector";
import { isNotEmpty } from "utils/lodash";

const propTypes = {
  activeSportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

const EuropeanLiveHomeTab = ({ activeSportCode }) => {
  const dispatch = useDispatch();
  const getEuropeanDashboardLiveDataBySportCode = useMemo(() => makeGetEuropeanDashboardLiveDataBySportCode(), []);
  const liveEuropeanData = useSelector((state) =>
    getEuropeanDashboardLiveDataBySportCode(state, {
      sportCode: activeSportCode,
    }),
  );

  useLiveData(dispatch, "european-dashboard");

  return (
    isNotEmpty(liveEuropeanData) && (
      <div className={classes["main"]}>
        <div className={classes["bets"]}>
          <div className={classes["bets__container"]}>
            {Object.values(liveEuropeanData).map((match) => (
              <LiveEuropeanMatch key={match.eventId} {...match} />
            ))}
          </div>
        </div>
      </div>
    )
  );
};

EuropeanLiveHomeTab.propTypes = propTypes;
EuropeanLiveHomeTab.defaultProps = defaultProps;

export default EuropeanLiveHomeTab;
