import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { isNotEmpty } from "../../../../../../../../utils/lodash";
import AVLiveContainer from "../../../../../../components/AVLiveContainer";
import classes from "../../../../../../scss/ezbet.module.scss";

const LiveVideo = ({ eventId, scrollEffectFixed, scrollEffectMinimise }) => {
  const [videoDimensions, setVideoDimensions] = useState(undefined);

  useEffect(() => {
    if (scrollEffectFixed) {
      // Track the original (regular mode) height and width of the video component (third party)

      const elements = document.getElementsByClassName("sravvpl_wrapper");
      const containerElement = document.getElementById("card-left");

      if (isNotEmpty(elements)) {
        const element = elements[0];
        const height = element.clientHeight;
        const width = element.clientWidth;

        setVideoDimensions({ height, width });

        // And set the new one to a 75%
        // console.log(`Height: ${((containerElement.clientWidth * 0.75) / width) * height}px`);
        // console.log(`Width: ${containerElement.clientWidth * 0.75}px`);
        element.style.height = `${((containerElement.clientWidth * 0.75) / width) * height}px`;
        element.style.width = `${containerElement.clientWidth * 0.75}px`;
      }
    } else if (videoDimensions) {
      // revert dimensions
      const elements = document.getElementsByClassName("sravvpl_wrapper");
      const element = elements[0];
      element.style.height = `${videoDimensions.height}px`;
      element.style.width = `${videoDimensions.width}px`;
    }
  }, [scrollEffectFixed]);

  return (
    <div
      className={cx(
        classes["tv-animation"],
        { [classes["fixed"]]: scrollEffectFixed },
        { [classes["minimised"]]: scrollEffectMinimise },
      )}
    >
      <AVLiveContainer eventId={eventId} />
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  scrollEffectFixed: PropTypes.bool.isRequired,
  scrollEffectMinimise: PropTypes.bool.isRequired,
};

LiveVideo.propTypes = propTypes;

export default React.memo(LiveVideo);
