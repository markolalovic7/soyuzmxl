import { useCouponData } from "applications/common/hooks/useCouponData";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { filterMarkets, getEvent, getPathDescription, groupMarkets } from "utils/eventsHelpers";

import { getCmsConfigIframeMode } from "../../../../../../redux/reselect/cms-selector";
import CentralColumnWidgets from "../../../../components/CentralColumnWidgets";
import PrematchNavigationTabs from "../../../../components/PrematchNavigationTabs";
import { getNavigationTabs } from "../../../../components/PrematchNavigationTabs/constants";
import MatchOverview from "../MatchOverview";
import MatchSpoilers from "../MatchSpoilers";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CentralColumn = ({ eventId }) => {
  const { t } = useTranslation();

  const navigationTabs = useMemo(() => getNavigationTabs(t), [t]);
  const [selectedMarketTypeGroupTab, setSelectedMarketTypeGroupTab] = useState(navigationTabs[0].code);

  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const dispatch = useDispatch();
  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const eventCouponLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);

  const code = `e${eventId}`;
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null);

  const match = getEvent(eventCouponData);

  const markets = match ? Object.values(match.children) : [];

  const pathDescription = match && getPathDescription(eventCouponData);

  return (
    <div className={cx(classes["central-section"], { [classes["iframe"]]: isApplicationEmbedded })}>
      <div className={classes["central-section__content"]}>
        <div className={classes["central-section__container"]}>
          <CentralColumnWidgets />
          {match ? (
            <>
              <MatchOverview
                leagueName={pathDescription}
                matchId={match.id}
                playerLeft={match.a}
                playerRight={match.b}
                sportCode={match.code}
                time={dayjs.unix(match.epoch / 1000).format("D MMMM hh:mm A")}
              />
              <PrematchNavigationTabs
                markets={markets}
                selectedMarketTypeGroupTab={selectedMarketTypeGroupTab}
                setSelectedMarketTypeGroupTab={setSelectedMarketTypeGroupTab}
              />
              <MatchSpoilers
                markets={groupMarkets(filterMarkets(selectedMarketTypeGroupTab, markets))}
                matchId={match.id}
              />
            </>
          ) : (
            eventCouponLoading && (
              <div className={classes["spinner-container"]}>
                <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
};

CentralColumn.propTypes = propTypes;

export default CentralColumn;
