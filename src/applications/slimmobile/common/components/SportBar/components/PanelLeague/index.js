import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getHrefPrematch } from "utils/route-href";

const propTypes = {
  backdropClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {};

// todo: fix here.
const getFeaturedLeagues = (cmsConfig) => {
  const viewLayouts = cmsConfig?.layouts?.MOBILE_SLIM_VIEW;
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

const getAllLeagues = (sports, topLeagues) => {
  const leagues = [];
  sports.forEach((s) => {
    if (s.path) {
      s.path.forEach((c) => {
        if (c.path) {
          c.path.forEach((l) => {
            if (topLeagues.includes(l.id)) {
              leagues.push({ ...l, code: s.code });
            }
          });
        }
      });
    }
  });

  return leagues;
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

const PanelLeague = ({ backdropClick, open }) => {
  const cmsConfig = useSelector((state) => state.cms.config);
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  const topLeagues = cmsConfig ? getFeaturedLeagues(cmsConfig) : [];
  const allLeagues =
    sportsTreeData && sportsTreeData.ept && topLeagues.length > 0 ? getAllLeagues(sportsTreeData.ept, topLeagues) : [];
  const leagueRows = getRows(allLeagues);

  return (
    <div className={`${classes["overlay-league"]} ${open ? classes["active"] : ""}`} onClick={backdropClick}>
      <div className={`${classes["overlay-league__container"]} ${open ? classes["active"] : ""}`}>
        <div className={classes["overlay-league__body"]}>
          {leagueRows.map((row) => {
            const firstLeague = row[0];
            const secondLeague = row.length > 1 ? row[1] : null;

            return (
              <div className={classes["overlay-league__row"]} key={row[0].id}>
                <Link className={classes["overlay-league__item"]} to={getHrefPrematch(`p${firstLeague.id}`)}>
                  <span
                    className={cx(classes["qicon-default"], classes[`qicon-${firstLeague.code.toLowerCase()}`])}
                    style={{ paddingRight: "5px" }}
                  />
                  {firstLeague.desc}
                  <span className={classes["overlay-league__item__count"]}>{firstLeague.eventCount2}</span>
                </Link>
                {secondLeague && (
                  <Link className={classes["overlay-league__item"]} to={getHrefPrematch(`p${secondLeague.id}`)}>
                    <span
                      className={cx(classes["qicon-default"], classes[`qicon-${secondLeague.code.toLowerCase()}`])}
                      style={{ paddingRight: "5px" }}
                    />
                    {secondLeague.desc}
                    <span className={classes["overlay-league__item__count"]}>{secondLeague.eventCount2}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

PanelLeague.propTypes = propTypes;
PanelLeague.defaultProps = defaultProps;

export default memo(PanelLeague);
