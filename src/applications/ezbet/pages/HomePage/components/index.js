import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { useCurrentBreakpointName } from "react-socks";

import { TWO_DAY_SPORTS_KEY } from "../../../utils/constants";

import CountryTree from "./CountryTree";

import classes from "applications/ezbet/scss/ezbet.module.scss";

const HomePage = () => {
  const breakpoint = useCurrentBreakpointName();
  const isMobileDeviceOrTablet = breakpoint === "xsmall" || breakpoint === "small" || breakpoint === "tablet";

  const sportsTreeData = useSelector((state) =>
    state.sportsTree.sportsTreeCache ? state.sportsTree.sportsTreeCache[TWO_DAY_SPORTS_KEY]?.ept ?? [] : [],
  );

  if (isEmpty(sportsTreeData) && !isMobileDeviceOrTablet) {
    return (
      <div className={classes["desktop-card-placeholder"]}>
        <FontAwesomeIcon
          className="fa-spin"
          icon={faSpinner}
          size="3x"
          style={{
            "--fa-primary-color": "#00ACEE",
            "--fa-secondary-color": "#E6E6E6",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
    );
  }

  return <CountryTree />;
};

export default HomePage;
