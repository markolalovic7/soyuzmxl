import ResultsPopup from "applications/vanilladesktop/components/ResultsPopup";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import trim from "lodash.trim";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getEvents } from "../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import { getAPIFeedCode } from "../../../../../vanillamobile/components/KironVirtualSportsPage/utils";
import UpcomingMatchDropdownPanel from "../../../../components/UpcomingMatchDropdownPanel";
import UpcomingMatchesTable from "../../../../components/UpcomingMatchesTable";
import UpcomingMatchesDescription from "../UpcomingMatchesDescription";
import UpcomingMatchesList from "../UpcomingMatchesList";
import UpcomingMatchesTabs from "../UpcomingMatchesTabs";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const isRankSport = (feedCode) => feedCode === "GREY" || feedCode === "HORS" || feedCode === "CAR";

const UpcomingMatches = ({ feedCode }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [activeEventId, setActiveEventId] = useState(null); // defaultActiveId is used when we navigate to a path where we preselect an eventId
  const [isResultsPopupOpen, setIsResultsPopupOpen] = useState(false);

  const searchCode = getAPIFeedCode(feedCode);

  const pathCouponData = useSelector((state) => state.coupon.couponData[searchCode]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[searchCode]);

  // When we navigate and change the effective search code, do clear out the "active event Id", so if we navigate back it's not automatically expanded.
  useEffect(() => {
    if (searchCode && trim(searchCode).length > 0) {
      setActiveEventId(null);
    }
  }, [dispatch, searchCode]);

  // ['THREE_WAYS_MONEY_LINE', 'TWO_WAYS_MONEY_LINE', 'TWO_WAYS_TOTAL', 'TWO_WAYS_SPREAD']
  useCouponData(dispatch, searchCode, "ALL", true, null, false, true, true, false, null);

  const onToggleActiveEventHandler = (eventId) => {
    if (activeEventId === eventId) {
      setActiveEventId(null);
    } else {
      setActiveEventId(eventId);
    }
  };

  const matches = pathCouponData
    ? getEvents(Object.values(pathCouponData)).filter(
        (match) => Object.values(match.children).findIndex((market) => !market.flags) > -1,
      )
    : [];

  useEffect(() => {
    if ((!activeEventId || matches.findIndex((m) => m.id === activeEventId) === -1) && matches.length > 0) {
      setActiveEventId(matches[0].id);
    }
  }, [activeEventId, dispatch, matches]);

  const activeMatch = matches.find((m) => m.id === activeEventId);

  return (
    <div className={classes["upcoming-matches"]}>
      <div className={classes["main-title"]}>
        <span className={classes["main-title__text"]}>{t("upcoming_matches")}</span>
        <button
          className={cx(classes["main-title__icon"], classes["popup-link"])}
          type="button"
          onClick={() => setIsResultsPopupOpen(true)}
        >
          <svg height="15" viewBox="0 0 18 15" width="18" xmlns="http://www.w3.org/2000/svg">
            <g>
              <g>
                <path d="M13.905 10.294L18 3.93V15H0V.445h1.8v10.14L6.75 2.87l5.85 3.056L16.416 0l1.557.809-4.707 7.318-5.859-3.033-5.328 8.289h2.034L8.064 7.27z" />
              </g>
            </g>
          </svg>
          <span>{t("results")}</span>
        </button>
      </div>
      {matches ? (
        isRankSport(feedCode) ? (
          <>
            <UpcomingMatchesTabs
              activeEventId={activeEventId}
              matches={matches}
              onSelect={onToggleActiveEventHandler}
            />
            {activeMatch && (
              <>
                <UpcomingMatchesDescription
                  desc={activeMatch.desc.split(" ")[0]}
                  startTime={dayjs.unix(activeMatch.epoch / 1000).format("D MMMM hh:mm A")}
                />
                <UpcomingMatchesList eventId={activeMatch.id} markets={Object.values(activeMatch.children)} />
              </>
            )}
          </>
        ) : (
          <>
            <UpcomingMatchesTable />
            <div className={classes["central-section__container"]}>
              <div className={classes["upcoming-matches__matches"]}>
                {matches
                  .filter((match) => Object.values(match.children).findIndex((market) => !market.flags) > -1)
                  .map((match) => (
                    <UpcomingMatchDropdownPanel key={match.id} match={match} />
                  ))}
              </div>
            </div>
          </>
        )
      ) : (
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      )}
      {isResultsPopupOpen && (
        <ResultsPopup feedCode={feedCode} isOpen={isResultsPopupOpen} onClose={() => setIsResultsPopupOpen(false)} />
      )}
    </div>
  );
};

const propTypes = {
  feedCode: PropTypes.string,
};
const defaultProps = {
  feedCode: undefined,
};

UpcomingMatches.propTypes = propTypes;
UpcomingMatches.defaultProps = defaultProps;

export default UpcomingMatches;
