import SportsMenuItem from "applications/vanilladesktop/pages/EuropeanSportsPage/components/SportsMenuSport";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router";

import { getSortedSportTreesBySportsOrder } from "../../../../utils/sort/sport-tree-sort";

const SportsMenu = ({ sportMenuWidget }) => {
  const { eventPathId: eventPathIdStr } = useParams();

  const eventPathId = eventPathIdStr ? parseInt(eventPathIdStr, 10) : undefined;

  const history = useHistory();
  const { t } = useTranslation();

  const { countType, hiddenSports, showCount, sportsOrder } = sportMenuWidget;

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData?.ept);

  const sportsTreeDataFiltered = useMemo(() => {
    if (isEmpty(sportsTreeData)) {
      return [];
    }

    return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter(
      (sportTree) => !hiddenSports?.includes(sportTree.code),
    );
  }, [hiddenSports, sportsOrder, sportsTreeData]);

  const [activeIndex, setActiveIndex] = useState(null);

  const [treeItemsDefaultOpen, setTreeItemsDefaultOpen] = useState([]);

  // Initialise the state of the tree (as it was before a page refresh), if we are in a location other than the root of prematch.
  useEffect(() => {
    if (sportsTreeDataFiltered && eventPathId) {
      for (let i = 0; i < sportsTreeDataFiltered.length; i += 1) {
        // make sure this appears expanded in the tree...
        const item = sportsTreeDataFiltered[i];
        const sportsKey = `sport-${item.id}`;

        if (eventPathId === item.id) {
          setTreeItemsDefaultOpen([sportsKey]);
          setActiveIndex(sportsKey);

          return; // break hard
        }

        if (item.path) {
          for (let j = 0; j < item.path.length; j += 1) {
            const country = item.path[j];
            const countryKey = `country-${country.id}`;

            if (eventPathId === country.id) {
              setTreeItemsDefaultOpen([sportsKey, countryKey]);
              setActiveIndex(countryKey);

              return; // break hard
            }

            if (country.path) {
              for (let k = 0; k < country.path.length; k += 1) {
                const league = country.path[k];
                const leagueKey = `league-${league.id}`;

                if (eventPathId === league.id) {
                  setTreeItemsDefaultOpen([sportsKey, countryKey]);
                  setActiveIndex(leagueKey);

                  return; // break hard
                }
              }
            }
          }
        }
      }
    }
  }, [eventPathId, sportsTreeDataFiltered]);

  const location = useLocation();
  useEffect(() => {
    // if no eventPathId set, go to the first one
    if (
      location.pathname.startsWith("/prematch") &&
      !location.pathname.startsWith("/prematch/search") &&
      sportsTreeDataFiltered?.length > 0 &&
      !eventPathId
    ) {
      history.push(`/prematch/eventpath/${sportsTreeDataFiltered.filter((sport) => sport.eventCount2 > 0)[0].id}`);
    }
  }, [location, eventPathId, sportsTreeDataFiltered]);

  return (
    <>
      <h3 className={classes["left-section__title"]}>{t("sports")}</h3>
      <div className={classes["menu-sports"]}>
        <ul className={classes["menu-sports__list"]}>
          {sportsTreeDataFiltered?.map((data) => {
            const sportKey = `sport-${data.id}`;

            if (Object.keys(data.criterias).filter((c) => c !== "live").length === 0) return null;

            return (
              <SportsMenuItem
                activeIndex={activeIndex}
                countType={countType}
                data={data}
                key={sportKey}
                setActiveIndex={setActiveIndex}
                showCount={!!showCount}
                sportId={data.id}
                sportKey={sportKey}
                treeItemsDefaultOpen={treeItemsDefaultOpen}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

const propTypes = {
  sportMenuWidget: PropTypes.object.isRequired,
};

SportsMenu.propTypes = propTypes;

export default React.memo(SportsMenu);
