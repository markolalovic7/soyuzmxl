import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import PagePath from "../../../../Navigation/PagePath/components";

import GameOddsSection from "./GameOddsSection";
import LeaguePageLinks from "./LeaguePageLinks";
import OutrightSection from "./OutrightSection";

const recursivePathSearch = (obj, pathId) => {
  let match = null;
  if (obj) {
    const childMatch = obj.find((item) => parseInt(item.id) === pathId);
    if (childMatch) {
      match = childMatch;
    } else {
      for (let i = 0; i < obj.length; i++) {
        const result = recursivePathSearch(obj[i].path, pathId);
        if (result) {
          match = result;
          break;
        }
      }
    }
  }

  return match;
};

const LeagueSectionContent = ({ eventPathId, sportCode }) => {
  const { t } = useTranslation();

  // Track the state of the active tab in use
  const [activeTab, setActiveTab] = useState(null); // GAME_ODDS, OUTRIGHT
  const [gameAllowed, setGameAllowed] = useState(false);
  const [outrightAllowed, setOutrightAllowed] = useState(false);

  const sports = useSelector((state) => state.sport.sports);
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData); // Initialised in CityMobileApp.

  const path = sportsTreeData && eventPathId ? recursivePathSearch(sportsTreeData.ept, parseInt(eventPathId)) : {};

  useEffect(() => {
    if (!activeTab && path && Object.keys(path).length > 0) {
      const tempGameAllowed = Object.keys(path.criterias).filter((c) => c !== "oc").length > 0;
      setGameAllowed(tempGameAllowed);
      const tempRankAllowed = Object.keys(path.criterias).filter((c) => c === "oc").length > 0;
      setOutrightAllowed(tempRankAllowed);

      if (tempGameAllowed) {
        setActiveTab("GAME_ODDS");
      } else if (tempRankAllowed) {
        setActiveTab("OUTRIGHT");
      }
    }
  }, [path]);

  const liveOn = path?.criterias ? Object.keys(path.criterias).filter((c) => c === "live").length > 0 : false;
  const prematchOn = path?.criterias
    ? Object.keys(path.criterias).filter((c) => c !== "oc" && c !== "live").length > 0
    : false;

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          {
            description: sports ? sports[sportCode].description : "",
            target: `/sports/${sportCode}`,
          },
          {
            description: path && path.desc ? path.desc : "",
          },
        ]}
      />

      <LeaguePageLinks
        activeTab={activeTab}
        gameAllowed={gameAllowed}
        outrightAllowed={outrightAllowed}
        setActiveTab={setActiveTab}
      />

      {activeTab === "GAME_ODDS" ? (
        <GameOddsSection
          eventPathId={eventPathId}
          liveOn={liveOn}
          prematchOn={prematchOn}
          sportCode={sportCode}
          strictLive={liveOn && !prematchOn}
        />
      ) : null}
      {activeTab === "OUTRIGHT" ? <OutrightSection eventPathId={eventPathId} sportCode={sportCode} /> : null}
    </>
  );
};

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

LeagueSectionContent.propTypes = propTypes;
LeagueSectionContent.defaultProps = defaultProps;

export default LeagueSectionContent;
