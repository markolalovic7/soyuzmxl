import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useEventStreamUrl } from "../../../../hooks/avlive-hooks";
import classes from "../../scss/ezbet.module.scss";

const propTypes = {
  eventId: PropTypes.number.isRequired,
  showLoading: PropTypes.bool.isRequired,
};

const AVLiveContainer = ({ eventId, showLoading }) => {
  const dispatch = useDispatch();
  const streamUrl = useEventStreamUrl(dispatch, eventId); // HLS stream URL

  const config = {
    id: "playercontainer",
  };

  useEffect(() => {
    if (streamUrl) {
      if (window.avvpl) {
        // window avvpl script loaded in the EZMobileApp top component
        // eslint-disable-next-line new-cap
        try {
          const avvplInstance = new window.avvpl.setupPlayer(config);
        } catch (err) {
          console.log("av setup error");
        }
      } else {
        console.log("Unable to initialise video stream - AVVPL library not loaded!");
      }
    }
  }, [eventId, streamUrl]);

  console.log("streamUrl", streamUrl)

  return (
    <>
      {showLoading && !streamUrl && (
        <div style={{ width: "auto" }}>
          <FontAwesomeIcon
            className="fa-spin"
            icon={faSpinner}
            size="3x"
            style={{
              "--fa-primary-color": "#00ACEE",
              "--fa-secondary-color": "#E6E6E6",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </div>
      )}
      {streamUrl && <div className={classes["player-container"]} id="playercontainer">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video>
          {/* <source src="http://dl5.webmfiles.org/big-buck-bunny_trailer.webm" type="video/webm" /> */}
          {streamUrl && <source src={streamUrl} type="application/x-mpegURL" />}
        </video>
      </div>}
    </>
  );
};

AVLiveContainer.propTypes = propTypes;

export default React.memo(AVLiveContainer);
