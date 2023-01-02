import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import classes from "../../../scss/citywebstyle.module.scss";

import LeaguePageCentralContent from "./LeaguepageCentralContent/LeaguePageGameOddsCentralContent";

const LeaguepageCentralContent = (props) => {
  const [activeEventPathId, setActiveEventPathId] = useState(props.eventPathId);
  const [activeCentralContentTab, setActiveCentralContentTab] = useState("GAME_ODDS"); // GAME_ODDS, OUTRIGHT

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData);

  useEffect(() => {
    if (props.eventPathId) {
      setActiveEventPathId(props.eventPathId);
    }
  }, [props.eventPathId]);

  const [gameOddsTabEnabled, setGameOddsTabEnabled] = useState(false);
  const [outrightTabEnabled, setOutrightTabEnabled] = useState(false);

  const recursiveItemSearch = (obj, pathId) => {
    let match = null;
    if (obj) {
      const childMatch = obj.find((item) => parseInt(item.id) === pathId);
      if (childMatch) {
        match = childMatch;
      } else {
        for (let i = 0; i < obj.length; i++) {
          const result = recursiveItemSearch(obj[i].path, pathId);
          if (result) {
            match = result;
            break;
          }
        }
      }
    }

    return match;
  };

  useEffect(() => {
    if (sportsTreeData) {
      const match = recursiveItemSearch(sportsTreeData.ept, parseInt(props.eventPathId));

      if (match) {
        if (Object.keys(match.criterias).findIndex((criteria) => criteria.startsWith("d")) > -1) {
          setGameOddsTabEnabled(true);
        } else {
          setGameOddsTabEnabled(false);
        }
        if (Object.keys(match.criterias).findIndex((criteria) => criteria.startsWith("o")) > -1) {
          setOutrightTabEnabled(true);
        } else {
          setOutrightTabEnabled(false);
        }
      }
    }
  }, [sportsTreeData, props.eventPathId]);

  useEffect(() => {
    if (gameOddsTabEnabled) {
      setActiveCentralContentTab("GAME_ODDS");
    } else if (outrightTabEnabled) {
      setActiveCentralContentTab("OUTRIGHT");
    }
  }, [gameOddsTabEnabled, outrightTabEnabled]);

  return (
    <section className={classes["content"]}>
      <LeaguePageCentralContent
        activeCentralContentTab={activeCentralContentTab}
        activeEventPathId={activeEventPathId}
        gameOddsTabEnabled={gameOddsTabEnabled}
        outrightTabEnabled={outrightTabEnabled}
        setActiveCentralContentTab={setActiveCentralContentTab}
        sportCode={props.sportCode}
      />
    </section>
  );
};

export default React.memo(LeaguepageCentralContent);
