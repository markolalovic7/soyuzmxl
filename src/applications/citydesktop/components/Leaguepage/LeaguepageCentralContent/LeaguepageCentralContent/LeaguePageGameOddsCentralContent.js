import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import classes from "../../../../scss/citywebstyle.module.scss";
import PagePath from "../../../Navigation/PagePath/PagePath";

import LeaguepageGameOddsContent from "./LeaguepageGameOddsContent/LeaguepageGameOddsContent";
import LeaguepageNavigation from "./LeaguepageNavigation/LeaguepageNavigation";
import LeaguepageOutrightContent from "./LeaguepageOutrightContent";

const LeaguePageCentralContent = (props) => {
  const { t } = useTranslation();
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);
  const sports = useSelector((state) => state.sport.sports);
  //
  // const recursivePathSearch = (obj, pathId) => {
  //     let match = null;
  //     if (obj) {
  //         const childMatch = obj.find(item => parseInt(item.id) === pathId);
  //         if (childMatch) {
  //             match = childMatch;
  //         } else {
  //             for (let i = 0; i < obj.length; i++) {
  //                 const result = recursivePathSearch(obj[i].path, pathId);
  //                 if (result) {
  //                     match = result;
  //                     break;
  //                 }
  //             }
  //         }
  //     }
  //     return match;
  // }

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

  const paths =
    sportsTreeData && props.activeEventPathId
      ? getPaths(sportsTreeData.ept, parseInt(props.activeEventPathId))?.slice(1, 10) || []
      : [];

  return (
    <>
      {paths.length >= 2 ? (
        <PagePath
          paths={[
            {
              description: t("home_page"),
              target: "/",
            },
            {
              description: sports ? sports[props.sportCode].description : "",
              target: `/sports/${props.sportCode}`,
            },
            {
              description: paths[0].desc,
              target:
                Object.keys(paths[0].criterias).filter((c) => c !== "oc").length > 0
                  ? `/countries/${props.sportCode}/${paths[0].id}`
                  : null,
            },
            {
              description: paths[1].desc,
              target: `/leagues/${props.sportCode}/${paths[1].id}`,
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
              description: t("matches"),
            },
          ]}
        />
      )}

      <div className={classes["content__container"]}>
        <LeaguepageNavigation
          activeCentralContentTab={props.activeCentralContentTab}
          activeEventPathId={props.activeEventPathId}
          gameOddsTabEnabled={props.gameOddsTabEnabled}
          outrightTabEnabled={props.outrightTabEnabled}
          setActiveCentralContentTab={props.setActiveCentralContentTab}
        />
        {props.activeCentralContentTab === "GAME_ODDS" ? (
          <LeaguepageGameOddsContent activeEventPathId={props.activeEventPathId} sportCode={props.sportCode} />
        ) : (
          <LeaguepageOutrightContent activeEventPathId={props.activeEventPathId} showFullDescription={false} />
        )}
      </div>
    </>
  );
};

export default React.memo(LeaguePageCentralContent);
