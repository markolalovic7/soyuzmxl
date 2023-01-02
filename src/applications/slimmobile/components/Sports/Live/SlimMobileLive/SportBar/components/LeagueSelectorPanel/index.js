import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import trim from "lodash.trim";
import PropTypes from "prop-types";
import { memo } from "react";
import { useSelector } from "react-redux";

import LeagueItem from "./components/LeagueItem";

const propTypes = {
  backdropClick: PropTypes.func.isRequired,
  onLeagueChange: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {};

const getFeaturedLeagues = (cmsConfig) => {
  const viewLayouts = cmsConfig.layouts.MOBILE_SLIM_VIEW;
  if (viewLayouts) {
    // find the top level prematch config.
    const targetLayout = viewLayouts.find((layout) => layout.route === "DASHBOARD");
    if (targetLayout) {
      const widget = targetLayout.widgets.find(
        (w) => w.section === "FEATURED_LEAGUES" && w.cmsWidgetType === "FEATURED_LEAGUES" && w.enabled === true,
      );

      if (widget) {
        const leagueCodes = widget.data.featuredLeagues.map((l) => l.eventPathId);
        if (leagueCodes.length > 0) {
          return leagueCodes;
        }
      }
    }
  }

  return [];
};

const getRows = (children) => {
  const size = 2;
  const arrays = [];
  if (children) {
    for (let i = 0; i < children.length; i += size) {
      arrays.push(children.slice(i, i + size));
    }
  }

  return arrays;
};

const LeagueSelectorPanel = ({ backdropClick, onLeagueChange, open }) => {
  const cmsConfig = useSelector((state) => state.cms.config);
  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"]);

  const featuredEventPathIds = cmsConfig ? getFeaturedLeagues(cmsConfig) : [];

  let topLeagues = [];
  if (europeanDashboardLiveData) {
    let totalCount = 0;
    Object.entries(europeanDashboardLiveData).forEach((entry) => {
      const sportCode = entry[0];
      Object.values(entry[1]).forEach((m) => {
        totalCount += 1;
        if (featuredEventPathIds.includes(m.leagueId)) {
          const existingTopLeague = topLeagues.find((l) => l.leagueId === m.leagueId);
          if (existingTopLeague) {
            existingTopLeague.count += 1;
          } else {
            topLeagues.push({
              count: 1,
              desc: trim(m.epDesc.split("/")[1]),
              iconSportCode: sportCode.toLowerCase(),
              leagueId: m.leagueId,
              sportCode,
            });
          }
        }
      });
    });
    topLeagues = [
      {
        count: totalCount,
        desc: "ALL",
        iconSportCode: "default",
        leagueId: null,
        sportCode: "ALL",
      },
      ...topLeagues,
    ];
  }

  const rows = getRows(topLeagues);

  return (
    <div className={`${classes["overlay-league"]} ${open ? classes["active"] : ""}`} onClick={backdropClick}>
      <div className={`${classes["overlay-league__container"]} ${open ? classes["active"] : ""}`}>
        <div className={classes["overlay-league__body"]}>
          {rows.map((row) => {
            const firstLeague = row[0];
            const secondLeague = row[1];

            return (
              <LeagueItem
                firstLeagueCount={firstLeague.count}
                firstLeagueDesc={firstLeague.desc}
                firstLeagueId={firstLeague.leagueId}
                firstLeagueSportCode={firstLeague.iconSportCode}
                key={`${firstLeague.leagueId} - ${secondLeague?.leagueId}`}
                secondLeagueCount={secondLeague?.count}
                secondLeagueDesc={secondLeague?.desc}
                secondLeagueId={secondLeague?.leagueId}
                secondLeagueSportCode={secondLeague?.iconSportCode}
                onLeagueChange={onLeagueChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

LeagueSelectorPanel.propTypes = propTypes;
LeagueSelectorPanel.defaultProps = defaultProps;

export default memo(LeagueSelectorPanel);
