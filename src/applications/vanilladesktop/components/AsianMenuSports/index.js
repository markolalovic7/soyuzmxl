import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import { getSportsSelector } from "../../../../redux/reselect/sport-selector";
import { ASIAN_EARLIER_TAB, ASIAN_LIVE_TAB, ASIAN_TODAY_TAB } from "../../pages/AsianSportsPage/components/constants";

const BLACKLISTED_CRITERIAS = ["FOOT-OE-TG", "FOOT-CS", "FOOT-FH-CS"]; // CS has 26 outcomes and breaks the layout. FOOT-OE-TG has different outcomes in prematch and live, which we have no clear way to handle (up to 5+ for live, up to 6+ for prematch)

const AsianMenuSubItem = ({ activeTab, counter, criteria, isLive, isOpen, selected, sportCode }) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <ul className={classes["menu-sports__sublist"]}>
      <li className={classes["menu-sports__subitem"]}>
        <div
          className={cx(classes["menu-sports__subitem-content"], classes["accordion"], {
            [classes["active"]]: selected,
            [classes["open"]]: isOpen,
          })}
          onClick={() => history.push(`/sports/${sportCode}/${criteria}/${activeTab}`)}
        >
          <h5 className={classes["menu-sports__subitem-title"]}>
            {t(`vanilladesktop.criteria.${criteria.substr(criteria.indexOf("-") + 1)}`)}
          </h5>
          {isLive && <span className={classes["menu-sports__item-live"]}>Live</span>}
          <span className={classes["menu-sports__item-numbers"]}>{counter}</span>
        </div>
      </li>
    </ul>
  );
};
AsianMenuSubItem.propTypes = {
  activeTab: PropTypes.string.isRequired,
  counter: PropTypes.number.isRequired,
  criteria: PropTypes.string.isRequired,
  isLive: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const AsianMenuItem = ({
  activeCriteria,
  activeTab,
  autoExpand,
  criteria,
  iconName,
  marketGroupCriteria,
  sportCode,
  sportName,
  totalCounter,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (autoExpand) setIsOpen(true);
  }, [autoExpand]);

  return (
    <li className={classes["menu-sports__item"]}>
      <div
        className={cx(classes["menu-sports__item-content"], classes["accordion"])}
        onClick={() => setIsOpen((isOpen) => !isOpen)}
      >
        <span className={classes["menu-sports__item-icon"]}>
          <span className={cx(classes["qicon-default"], classes[`qicon-${iconName}`])} />
        </span>
        <h4 className={classes["menu-sports__item-title"]}>{sportName}</h4>
        {Object.values(marketGroupCriteria).find((criteria) => criteria.live) && (
          <span className={classes["menu-sports__item-live"]}>Live</span>
        )}
        <span className={classes["menu-sports__item-numbers"]}>{totalCounter}</span>
        <span
          className={cx(classes["menu-sports__item-arrow"], classes["accordion-arrow"], {
            [classes["active"]]: isOpen,
          })}
        />
      </div>
      {Object.entries(criteria).map((item, index) => {
        if (BLACKLISTED_CRITERIAS.includes(item[0])) return null;

        return (
          <AsianMenuSubItem
            activeTab={activeTab}
            counter={item[1]}
            criteria={item[0]}
            isLive={Object.entries(marketGroupCriteria).find((criteria) => criteria[0] === item[0])[1].live > 0}
            isOpen={isOpen}
            key={index}
            selected={activeCriteria === item[0]}
            sportCode={sportCode}
          />
        );
      })}
    </li>
  );
};
AsianMenuItem.propTypes = {
  activeCriteria: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  autoExpand: PropTypes.bool.isRequired,
  criteria: PropTypes.object.isRequired,
  iconName: PropTypes.string.isRequired,
  marketGroupCriteria: PropTypes.object.isRequired,
  sportCode: PropTypes.string.isRequired,
  sportName: PropTypes.string.isRequired,
  totalCounter: PropTypes.number.isRequired,
};

const AsianMenuSports = ({ active }) => {
  const { criteria, dateTab, sportCode } = useParams();
  const history = useHistory();
  const { t } = useTranslation();

  const sports = useSelector(getSportsSelector);

  const todaySportsTreeData = useSelector((state) => state.sportsTree.sportsTreeCache["TODAY"]);
  const earlierSportsTreeData = useSelector((state) => state.sportsTree.sportsTreeCache["EARLIER"]);

  // TODO CMS widget injection
  const sportsTreeDataFiltered =
    dateTab === ASIAN_EARLIER_TAB
      ? earlierSportsTreeData
      : dateTab === ASIAN_LIVE_TAB
      ? todaySportsTreeData
          ?.filter((sport) => Object.values(sport.marketGroupCriteria).find((criteria) => criteria.live))
          ?.map((sport) => ({
            ...sport,
            criteria: Object.fromEntries(
              Object.entries(sport.marketGroupCriteria)
                .filter((criteria) => criteria[1].live)
                .map((entry) => [entry[0], entry[1].live]),
            ),
            marketGroupCriteria: Object.fromEntries(
              Object.entries(sport.marketGroupCriteria).filter((criteria) => criteria[1].live),
            ),
          }))
      : todaySportsTreeData?.map((sport) =>
          // done to align API data to the format we want
          ({
            ...sport,
            criteria: Object.fromEntries(
              Object.entries(sport.marketGroupCriteria).map((entry) => [
                entry[0],
                (entry[1].live || 0) + (entry[1].d0 || 0),
              ]),
            ),
          }),
        ); // default is TODAY

  useEffect(() => {
    // If nothing selected - go to the first known sport and criteria
    if (sportsTreeDataFiltered && sportsTreeDataFiltered.length > 0) {
      if (!criteria || !sportCode || !dateTab) {
        const sportData =
          sportsTreeDataFiltered
            .filter((sport) => !sportCode || sport.code === sportCode)
            .find((sport) => Object.keys(sport.criteria).length > 0) ||
          sportsTreeDataFiltered.find((sport) => Object.keys(sport.criteria).length > 0);
        if (sportData) {
          history.push(`/sports/${sportData.code}/${Object.keys(sportData.criteria)[0]}/${dateTab || ASIAN_TODAY_TAB}`);
        } else {
          // if there is nothing, fallback to the EARLIER tab, where more data is expected to exist...
          history.push(`/sports/FOOT/FOOT-DEFAULT/${ASIAN_EARLIER_TAB}`);
        }
      } else {
        // Check if the user selection is valid (it might stop being when the user navigates between prematch and earlier, for example...
        const currentSportData = sportsTreeDataFiltered.find((sport) => sport.code === sportCode);
        const validCurrentSelection =
          currentSportData &&
          Object.keys(currentSportData.criteria).findIndex((thisCriteria) => thisCriteria === criteria) > -1;
        if (!validCurrentSelection) {
          // choose something else

          const sportsTreeData =
            sportsTreeDataFiltered
              .filter((sport) => !sportCode || sport.code === sportCode)
              .find((sport) => Object.keys(sport.criteria).length > 0) ||
            sportsTreeDataFiltered.find((sport) => Object.keys(sport.criteria).length > 0);
          if (sportsTreeData) {
            history.push(`/sports/${sportsTreeData.code}/${Object.keys(sportsTreeData.criteria)[0]}/${dateTab}`);
          } else {
            // if there is nothing, fallback to the EARLIER tab, where more data is expected to exist...
            history.push(`/sports/FOOT/FOOT-DEFAULT/${ASIAN_EARLIER_TAB}`);
          }
        }
      }
    }
  }, [sportsTreeDataFiltered, dateTab, criteria, sportCode]);

  if (!sportsTreeDataFiltered || !dateTab || !criteria || !sportCode) return null;

  return (
    <div className={cx(classes["asian-menu__sports"], { [classes["active"]]: active })}>
      <div className={classes["menu-sports-tabs"]}>
        <div
          className={cx(classes["menu-sports-tab"], classes["menu-sports-tab_today"], {
            [classes["active"]]: dateTab === ASIAN_TODAY_TAB,
          })}
          onClick={() => history.push(`/sports/${sportCode}/${criteria}/${ASIAN_TODAY_TAB}`)}
        >
          {t("today")}
        </div>
        <div
          className={cx(classes["menu-sports-tab"], classes["menu-sports-tab_earlier"], {
            [classes["active"]]: dateTab === ASIAN_EARLIER_TAB,
          })}
          onClick={() => history.push(`/sports/${sportCode}/${criteria}/${ASIAN_EARLIER_TAB}`)}
        >
          {t("upcoming")}
        </div>
        <div
          className={cx(classes["menu-sports-tab"], classes["menu-sports-tab_live"], {
            [classes["active"]]: dateTab === ASIAN_LIVE_TAB,
          })}
          onClick={() => history.push(`/sports/${sportCode}/${criteria}/${ASIAN_LIVE_TAB}`)}
        >
          {t("live")}
        </div>
      </div>
      <div className={classes["menu-sports"]}>
        <ul className={classes["menu-sports__list"]}>
          {sportsTreeDataFiltered?.map((data) => {
            const sportKey = `sport-${data.code}`;

            if (Object.keys(data.criteria).length === 0) return null;

            return (
              <AsianMenuItem
                activeCriteria={criteria}
                activeTab={dateTab}
                autoExpand={data.code === sportCode}
                criteria={data.criteria}
                iconName={data.code.toLowerCase()}
                key={sportKey}
                marketGroupCriteria={data.marketGroupCriteria}
                sportCode={data.code}
                sportName={sports ? sports[data.code].description : ""}
                totalCounter={Object.values(data.criteria).reduce((a, b) => a + b, 0)}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};
AsianMenuSports.propTypes = {
  active: PropTypes.bool.isRequired,
};
export default React.memo(AsianMenuSports);
