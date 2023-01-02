import * as PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import PagePath from "../../../../Navigation/PagePath/components";
import SportsContainer from "../../../../SportsContainer";

import AllLeaguesSection from "./AllLeaguesSection";
import SportPageLinks from "./SportPageLinks";

const SportsSectionContent = ({ sportCode }) => {
  const { t } = useTranslation();

  // Track the state of the active tab in use. Notice DAILY_MATCH_LIST is not always available - only when GAMe exists
  const [activeTab, setActiveTab] = useState("TOP_LEAGUES"); // INPLAY, TOP_LEAGUES , ALL_LEAGUES, DAILY_MATCH_LIST

  const sports = useSelector((state) => state.sport.sports);
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData); // Initialised in CityMobileApp.
  const liveSupported = !!(
    sportsTreeData?.ept && sportsTreeData?.ept?.find((s) => s.code === sportCode)?.criterias?.live
  );

  return (
    <>
      <PagePath
        paths={[
          {
            description: t("home_page"),
            target: "/",
          },
          { description: sports ? sports[sportCode].description : "..." },
        ]}
      />

      <SportPageLinks activeTab={activeTab} liveOn={liveSupported} setActiveTab={setActiveTab} sportCode={sportCode} />

      {activeTab !== "ALL_LEAGUES" ? (
        <SportsContainer
          dateSelectorModeOn={activeTab === "DAILY_MATCH_LIST"}
          eventPathFilter={null}
          highlightsOn={false}
          liveModeOn={["INPLAY"].includes(activeTab)}
          maxMatchesPerLeague={activeTab === "TOP_LEAGUES" ? 5 : null}
          prematchDateFromIndex={null}
          prematchDateToIndex={null}
          prematchModeOn={["TOP_LEAGUES", "DAILY_MATCH_LIST"].includes(activeTab)}
          sportFilter={sportCode}
          sportSelectorModeOn={false}
          topLeagueOn={activeTab === "TOP_LEAGUES"}
        />
      ) : (
        <AllLeaguesSection sportCode={sportCode} />
      )}
    </>
  );
};

const propTypes = {
  sportCode: PropTypes.string.isRequired,
};

const defaultProps = {};

SportsSectionContent.propTypes = propTypes;
SportsSectionContent.defaultProps = defaultProps;

export default SportsSectionContent;
