import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { isLiveBetradarVirtualSports } from "../../../../../../utils/betradar-virtual-utils";
import { getEvents } from "../../../../../../utils/prematch-data-utils";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import UpcomingMatchDropdownPanel from "../../../../components/UpcomingMatchDropdownPanel";
import UpcomingMatchesTable from "../../../../components/UpcomingMatchesTable";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const UpcomingMatches = ({ currentCodes, feedCode }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isResultsPopupOpen, setIsResultsPopupOpen] = useState(false);

  const searchCode = currentCodes.join(",");

  const pathCouponData = useSelector((state) => state.coupon.couponData[searchCode]);
  const pathLoading = useSelector((state) => state.coupon.couponLoading[searchCode]);

  // ['THREE_WAYS_MONEY_LINE', 'TWO_WAYS_MONEY_LINE', 'TWO_WAYS_TOTAL', 'TWO_WAYS_SPREAD']
  useCouponData(
    dispatch,
    searchCode,
    "ALL",
    true,
    null,
    isLiveBetradarVirtualSports(feedCode),
    true,
    true,
    false,
    null,
  );

  const matches = pathCouponData ? getEvents(Object.values(pathCouponData)).sort(sortEvents) : [];

  return (
    <div className={classes["upcoming-matches"]}>
      <div className={classes["main-title"]}>
        <span className={classes["main-title__text"]}>{t("upcoming_matches")}</span>
      </div>
      {matches ? (
        <>
          <UpcomingMatchesTable />
          <div className={classes["central-section__container"]}>
            <div className={classes["upcoming-matches__matches"]}>
              {matches
                .filter((match) => Object.values(match.children).findIndex((market) => !market.flags) > -1)
                .map((match) => (
                  <UpcomingMatchDropdownPanel
                    expandByDefault={isLiveBetradarVirtualSports(feedCode)}
                    key={match.id}
                    match={match}
                  />
                ))}
            </div>
          </div>
        </>
      ) : (
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      )}
    </div>
  );
};

const propTypes = {
  currentCodes: PropTypes.array.isRequired,
};
const defaultProps = {};

UpcomingMatches.propTypes = propTypes;
UpcomingMatches.defaultProps = defaultProps;

export default UpcomingMatches;
