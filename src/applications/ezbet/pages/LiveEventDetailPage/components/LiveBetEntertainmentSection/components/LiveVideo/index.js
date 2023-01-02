import cx from "classnames";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { isNotEmpty } from "../../../../../../../../utils/lodash";
import AVLiveContainer from "../../../../../../components/AVLiveContainer";
import classes from "../../../../../../scss/ezbet.module.scss";
import { useSelector } from "react-redux";
import { getAuthIsIframe } from "../../../../../../../../redux/reselect/auth-selector";

const LiveVideo = ({ eventId, hasData }) => {
  const isInIframe = useSelector(getAuthIsIframe);

  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollEffectActive, setScrollEffectActive] = useState(false);
  const [scrollEffectFixed, setScrollEffectFixed] = useState(false); // step into fixed position to force an animation
  const [scrollEffectMinimise, setScrollEffectMinimise] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState(undefined);

  useEffect(() => {
    // make sure we do not end up with inconsistent data
    if (scrollEffectMinimise) setScrollEffectFixed(true);
  }, [scrollEffectMinimise]);

  useEffect(() => {
    const onScroll = (e) => {
      const newScrollTop = e.target.documentElement.scrollTop;

      setScrollTop(newScrollTop);
      setScrolling(newScrollTop > scrollTop);

      if (newScrollTop > 5) {
        // add active
        setScrollEffectActive(true);
        if (newScrollTop > scrollTop) {
          if (newScrollTop > 270) {
            // add scrolled
            setScrollEffectFixed(true);
            setTimeout(() => setScrollEffectMinimise(true), 100);
          }
        } else {
          // remove scrolled
          if (newScrollTop < 270) {
            setScrollEffectMinimise(false);
            setScrollEffectFixed(false);
            // setTimeout(() => setScrollEffectFixed(false), 300);
          }
        }
      } else {
        // remove active and scrolled...
        setScrollEffectActive(false);
        setScrollEffectMinimise(false);
        setScrollEffectFixed(false);
        // setTimeout(() => setScrollEffectFixed(false), 100);
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

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

  useEffect(() => {
    // if we run out of markets, force remove any minimised effect
    if (hasData) {
      setScrollTop(0);
      setScrolling(false);
      setScrollEffectMinimise(false);
      setScrollEffectFixed(false);
    }
  }, [hasData]);

  return (
    <div
      className={cx(
        classes["tv-animation"],
        { [classes["fixed"]]: scrollEffectFixed },
        { [classes["minimised"]]: scrollEffectMinimise },
        { [classes["iframe"]]: isInIframe },
      )}
      id={`mobile-tv-${scrollEffectMinimise ? "minimised" : "regular"}`}
      style={{
        right: `${(window.innerWidth - document.getElementById("card-left").clientWidth) / 2}px`,
        width: scrollEffectMinimise ? `${document.getElementById("card-left").clientWidth * 0.75}px` : "100%",
      }}
    >
      <AVLiveContainer eventId={eventId} showLoading={!scrollEffectFixed} />
    </div>
  );
};

const propTypes = {
  eventId: PropTypes.number.isRequired,
  hasData: PropTypes.bool.isRequired,
};

LiveVideo.propTypes = propTypes;

export default React.memo(LiveVideo);
