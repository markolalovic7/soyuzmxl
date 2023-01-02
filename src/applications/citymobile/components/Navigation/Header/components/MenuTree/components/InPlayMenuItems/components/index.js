import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";

import RegularMenuItemLink from "../../RegularMenuItemLink";

const InPlayMenuItems = ({ onClick }) => {
  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData); // Initialised in CityMobileApp.

  return (
    <React.Fragment style={{ overflowY: "auto" }}>
      {sportsTreeData &&
        sportsTreeData.ept &&
        sportsTreeData.ept
          .filter((s) => s.criterias?.live > 0)
          .map((sport) => {
            const sportsKey = `sports-${sport.id}`;

            return (
              <RegularMenuItemLink
                count={sport.criterias?.live}
                key={sportsKey}
                label={sport.desc}
                path={`/live/${sport.code}`}
                onClick={onClick}
              />
            );
          })}
    </React.Fragment>
  );
};

InPlayMenuItems.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default InPlayMenuItems;
