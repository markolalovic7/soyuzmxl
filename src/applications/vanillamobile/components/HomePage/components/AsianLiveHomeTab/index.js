import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { getHrefLiveEventDetail } from "../../../../../../utils/route-href";
import AsianMatchContainer from "../../../../common/components/AsianMatchContainer";
import { getSortedLiveMatches } from "../../../LivePage/utils";

import { useLiveData } from "applications/common/hooks/useLiveData";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { isNotEmpty } from "utils/lodash";

const propTypes = {
  activeSportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

const AsianLiveHomeTab = ({ activeSportCode }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const asianDashboardLiveData = useSelector((state) =>
    state.live.liveData["asian-dashboard"]
      ? Object.keys(state.live.liveData["asian-dashboard"])
          .filter((key) => key === activeSportCode)
          .reduce((obj, key) => {
            obj[key] = state.live.liveData["asian-dashboard"][key];

            return obj;
          }, {})
      : undefined,
  );

  useLiveData(dispatch, "asian-dashboard");

  return (
    isNotEmpty(asianDashboardLiveData) && (
      <div className={classes["main"]}>
        <div className={classes["bets"]}>
          <div className={classes["bets__container"]}>
            {Object.keys(asianDashboardLiveData)
              .filter((sport) => sport === activeSportCode && !isEmpty(asianDashboardLiveData[sport]))
              .map((sport, index) =>
                getSortedLiveMatches(Object.values(asianDashboardLiveData[sport])).map((match) => (
                  <>
                    <div className={classes["bets__title"]}>{match.epDesc}</div>

                    <AsianMatchContainer
                      live
                      additionalMarketsExpanded={false}
                      event={match}
                      key={match.eventId}
                      markets={
                        isNotEmpty(match.marketViews) && match.marketViews["DEFAULT"]
                          ? match.marketViews["DEFAULT"]
                          : []
                      }
                      onToggleActiveEvent={() => history.push(getHrefLiveEventDetail(match.eventId))}
                    />
                  </>
                )),
              )}
          </div>
        </div>
      </div>
    )
  );
};

AsianLiveHomeTab.propTypes = propTypes;
AsianLiveHomeTab.defaultProps = defaultProps;

export default AsianLiveHomeTab;
