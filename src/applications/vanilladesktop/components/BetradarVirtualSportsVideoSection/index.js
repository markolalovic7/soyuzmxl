import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  getBetradarVirtualSportList,
  isResponsiveIntegration,
  isWidgetTypeIntegration,
} from "../../../../utils/betradar-virtual-utils";
import ResponsiveBetradarVirtualSportsFrame from "../../../common/components/BetradarVirtualSports/ResponsiveBetradarVirtualSportsFrame";
import WidgetBetradarVirtualSportsFrame from "../../../common/components/BetradarVirtualSports/WidgetBetradarVirtualSportsFrame";

const BetradarVirtualSportsVideoSection = ({ feedCode, setCurrentCodes }) => {
  const { t } = useTranslation();

  return (
    <div className={classes["upcoming-matches-banner"]}>
      <div className={classes["main-title"]}>
        <span className={classes["main-title__text"]}>
          {getBetradarVirtualSportList(t).filter((b) => feedCode === b.code).label}
        </span>
      </div>
      <div className={classes["upcoming-matches-banner__game"]} style={{ padding: "5px" }}>
        {feedCode && isResponsiveIntegration(feedCode) && (
          <div style={{ paddingBottom: "5px", position: "relative", width: "100%" }}>
            <ResponsiveBetradarVirtualSportsFrame feedCode={feedCode} setCurrentCodes={setCurrentCodes} />
          </div>
        )}
        {feedCode && isWidgetTypeIntegration(feedCode) && (
          <div style={{ paddingBottom: "5px" }}>
            <WidgetBetradarVirtualSportsFrame feedCode={feedCode} setCurrentCodes={setCurrentCodes} />
          </div>
        )}
      </div>
    </div>
  );
};

const propTypes = {
  feedCode: PropTypes.string.isRequired,
  setCurrentCodes: PropTypes.func.isRequired,
};
const defaultProps = {};

BetradarVirtualSportsVideoSection.propTypes = propTypes;
BetradarVirtualSportsVideoSection.defaultProps = defaultProps;

export default BetradarVirtualSportsVideoSection;
