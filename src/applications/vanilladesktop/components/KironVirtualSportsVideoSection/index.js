import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getCmsConfigKironVirtualVideoByFeedCode } from "../../../../redux/reselect/cms-selector";
import { getKironFeedCodeTranslated } from "../../../../utils/kiron-virtual-sport";

const KironVirtualSportsVideoSection = ({ feedCode }) => {
  const { t } = useTranslation();

  const videoURL = useSelector((state) => getCmsConfigKironVirtualVideoByFeedCode(state, feedCode));

  return (
    <div className={classes["upcoming-matches-banner"]}>
      <div className={classes["main-title"]}>
        <span className={classes["main-title__text"]}>{getKironFeedCodeTranslated(feedCode, t)}</span>
      </div>
      <div className={classes["upcoming-matches-banner__game"]} style={{ padding: "5px" }}>
        {videoURL && (
          <div style={{ height: "500px", paddingBottom: "5px", position: "relative", width: "100%" }}>
            <iframe
              frameBorder="0"
              height="100%"
              src={videoURL}
              style={{ left: "0", position: "absolute", top: "0" }}
              title={feedCode}
              width="100%"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const propTypes = {
  feedCode: PropTypes.string,
};
const defaultProps = {
  feedCode: undefined,
};

KironVirtualSportsVideoSection.propTypes = propTypes;
KironVirtualSportsVideoSection.defaultProps = defaultProps;

export default KironVirtualSportsVideoSection;
