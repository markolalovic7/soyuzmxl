import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getEvent } from "../../../../../../utils/eventsHelpers";
import { isNotEmpty } from "../../../../../../utils/lodash";
import { useCouponData } from "../../../../../common/hooks/useCouponData";
import classes from "../../../../scss/citywebstyle.module.scss";
import CustomBet from "../../../CustomBet/CustomBet";
import PagePath from "../../../Navigation/PagePath/PagePath";
import EventDetailPageLinks from "../../common/EventDetailPageLinks";
import { getGroupedMarketsForActiveTab } from "../../common/EventDetailUtils";
import MarketColumn from "../../common/MarketColumn";

import EventDetailPageHeader from "./PrematchEventDetailPageHeader/PrematchEventDetailPageHeader";

import Spinner from "applications/common/components/Spinner";

const PrematchEventDetailPageCentralContent = ({ eventId }) => {
  const { t } = useTranslation();

  const [cmsFilterOn, setCmsFilterOn] = useState(true);
  const [cmsFilterEnabled, setCmsFilterEnabled] = useState(true);

  const eventCouponData = useSelector((state) => state.coupon.couponData[`e${eventId}`]);
  const eventLoading = useSelector((state) => state.coupon.couponLoading[`e${eventId}`]);
  const cmsMarketFilterEventCouponData = useSelector((state) => state.coupon.couponData[`cms-e${eventId}`]);
  const cmsMarketFilterEventLoading = useSelector((state) => state.coupon.couponLoading[`cms-e${eventId}`]);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sports = useSelector((state) => state.sport.sports);

  const dispatch = useDispatch();

  const code = `e${eventId}`;
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null, true, null, null, false);
  useCouponData(dispatch, code, "ALL", true, null, false, false, false, false, null, true, null, null, true);

  const [activeTab, setActiveTab] = useState("ALL");

  const [listOfFavouriteMarkets, setListOfFavouriteMarkets] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("favouriteMarketGroups")) {
      setListOfFavouriteMarkets(localStorage.getItem("favouriteMarketGroups").split(","));
    }
  }, []);

  useEffect(() => {
    // if we have no "filtered markets" - disable the flag right away...
    if (!cmsMarketFilterEventLoading && cmsMarketFilterEventCouponData && isEmpty(cmsMarketFilterEventCouponData)) {
      // bit tricky - make sure it's not loading, that we already have some data (not undefined), and that it happens to be empty
      setCmsFilterOn(false);
      setCmsFilterEnabled(false);
    }

    // in case of updates re-enabling or suspending
    if (!cmsMarketFilterEventLoading && cmsMarketFilterEventCouponData && isNotEmpty(cmsMarketFilterEventCouponData)) {
      // just to protect against updates where everything is suspended... check any valid market exists...
      const event = getEvent(cmsMarketFilterEventCouponData);
      const valid = event && event?.children && Object.values(event?.children).findIndex((x) => x.open) > -1;

      if (valid) {
        // if this is valid data - go ahead
        setCmsFilterEnabled(true);
      } else if (!valid) {
        // else, if just closed / suspended markets - hide!
        setCmsFilterOn(false);
        setCmsFilterEnabled(false);
      }
    }
  }, [cmsMarketFilterEventLoading, cmsMarketFilterEventCouponData]);

  const getPaths = (obj, pathId) => {
    let paths = null;
    if (obj) {
      const childMatch = obj.find((item) => parseInt(item.id) === pathId);
      if (childMatch) {
        paths = [childMatch];
      } else {
        for (let i = 0; i < obj.length; i++) {
          const result = getPaths(obj[i].path, pathId);
          if (result) {
            paths = [obj[i], ...result];
            break;
          }
        }
      }
    }

    return paths;
  };

  const match = getEvent(cmsFilterOn ? cmsMarketFilterEventCouponData : eventCouponData);
  const groupedMarkets =
    match &&
    match.children &&
    ["ALL", "MATCH", "OVER_UNDER", "HANDICAP", "ODD_EVEN", "PERIOD", "RAPID", "OTHER"].includes(activeTab)
      ? getGroupedMarketsForActiveTab(activeTab, Object.values(match.children), listOfFavouriteMarkets)
      : [];

  const paths =
    sportsTreeData && match
      ? getPaths(sportsTreeData.ept, parseInt(match.parent.substring(1, match.parent.length))).slice(1, 10)
      : [];

  return (
    <section className={classes["content"]}>
      {paths.length >= 2 ? (
        <PagePath
          paths={[
            {
              description: t("home_page"),
              target: "/",
            },
            {
              description: sports ? sports[match.code].description : "",
              target: `/sports/${match.code}`,
            },
            {
              description: paths[0].desc,
              target: `/countries/${match.code}/${paths[0].id}`,
            },
            {
              description: paths[1].desc,
              target: `/leagues/${match.code}/${paths[1].id}`,
            },
            {
              description: match ? match.desc : "",
            },
          ]}
        />
      ) : (
        <PagePath
          paths={[
            {
              description: t("home_page"),
              target: "/",
            },
            {
              description: "",
            },
          ]}
        />
      )}

      <div className={classes["content__container"]}>
        {!match && ((!cmsFilterOn && eventLoading) || (cmsFilterOn && cmsMarketFilterEventLoading)) ? (
          <div className={classes["homepage-spinner"]}>
            <Spinner className={classes.loader} />
          </div>
        ) : match ? (
          <>
            <EventDetailPageHeader match={match} />

            <EventDetailPageLinks
              activeTab={activeTab}
              brMatchId={match.brMatchId}
              cmsFilterEnabled={cmsFilterEnabled}
              cmsFilterOn={cmsFilterOn}
              markets={Object.values(match.children)}
              setActiveTab={setActiveTab}
              setCmsFilterOn={setCmsFilterOn}
              sportCode={match.code}
            />

            {activeTab === "CUSTOM_BET" && (
              <div
                className={classes["event-content"]}
                style={{ alignItems: "center", display: "flex", justifyContent: "center" }}
              >
                <CustomBet feedcode={match.brMatchId} live={false} sportCode={match.code} />
              </div>
            )}

            {activeTab !== "CUSTOM_BET" && (
              <div className={classes["event-content"]}>
                <MarketColumn
                  brMatchId={match.brMatchId}
                  eventId={eventId}
                  index={0}
                  listOfFavouriteMarkets={listOfFavouriteMarkets}
                  marketGroups={groupedMarkets}
                  setListOfFavouriteMarkets={setListOfFavouriteMarkets}
                />
                <MarketColumn
                  brMatchId={match.brMatchId}
                  eventId={eventId}
                  index={1}
                  listOfFavouriteMarkets={listOfFavouriteMarkets}
                  marketGroups={groupedMarkets}
                  setListOfFavouriteMarkets={setListOfFavouriteMarkets}
                />
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
};
PrematchEventDetailPageCentralContent.propTypes = propTypes;

export default React.memo(PrematchEventDetailPageCentralContent);
