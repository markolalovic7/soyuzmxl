import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import RegularMenuItemLink from "../../RegularMenuItemLink";

const SportMenuItems = ({ onClick }) => {
  const { t } = useTranslation();
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData); // Initialised in CityMobileApp.

  return (
    <React.Fragment style={{ overflowY: "auto" }}>
      <RegularMenuItemLink label={t("todays_events")} path="/today" onClick={onClick} />
      <RegularMenuItemLink label={t("bet_search")} path="/search" onClick={onClick} />

      {sportsTreeData &&
        sportsTreeData.ept &&
        sportsTreeData.ept.map((sport) => {
          const sportsKey = `sports-${sport.id}`;

          return (
            <RegularMenuItemLink
              key={sportsKey}
              label={sport.desc}
              path={`/sports/${sport.code.toUpperCase()}`}
              onClick={onClick}
            />
          );
        })}
    </React.Fragment>
  );
};

SportMenuItems.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SportMenuItems;
