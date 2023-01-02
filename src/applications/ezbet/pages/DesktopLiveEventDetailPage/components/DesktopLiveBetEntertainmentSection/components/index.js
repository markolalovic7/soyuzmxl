import cx from "classnames";
import { isEmpty } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { getAuthLoggedIn } from "../../../../../../../redux/reselect/auth-selector";

import LiveMatchTracker from "./LiveMatchTracker";
import LiveScoreboard from "./LiveScoreboard";
import LiveVideo from "./LiveVideo";

import classes from "applications/ezbet/scss/ezbet.module.scss";

/* not supported in icomoon */
const MatchTrackerIconSvg = () => (
  <svg height="18" viewBox="0 0 27 18" width="27" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="pc47a">
        <path d="M4 18a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h19a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4z" fill="#fff" />
      </clipPath>
      <clipPath id="pc47b">
        <path d="M13 17V1h1v16z" fill="#fff" />
      </clipPath>
      <clipPath id="pc47c">
        <path d="M0 13V5h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z" fill="#fff" />
      </clipPath>
      <clipPath id="pc47d">
        <path d="M23 13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4v8z" fill="#fff" />
      </clipPath>
      <clipPath id="pc47e">
        <path d="M9.5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" fill="#fff" />
      </clipPath>
    </defs>
    <g>
      <g>
        <g>
          <g>
            <path
              clipPath='url("#pc47a")'
              d="M4 18a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h19a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="20"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              clipPath='url("#pc47b")'
              d="M13 17v0V1v0h1v16z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="20"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              clipPath='url("#pc47c")'
              d="M0 13v0-8 0h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="20"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              clipPath='url("#pc47d")'
              d="M23 13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4v8z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="20"
              strokeWidth="2"
            />
          </g>
          <g>
            <path
              clipPath='url("#pc47e")'
              d="M9.5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"
              fill="none"
              stroke="currentColor"
              strokeMiterlimit="20"
              strokeWidth="2"
            />
          </g>
        </g>
        <g />
      </g>
    </g>
  </svg>
);

const TVIconSvg = () => (
  <svg height="19" viewBox="0 0 19 19" width="19" xmlns="http://www.w3.org/2000/svg">
    <g>
      <g>
        <path
          d="M15.44 11.396V11.1c0-.245.2-.446.445-.446h.297c.245 0 .445.2.445.446v.296c0 .245-.2.446-.445.446h-.297a.447.447 0 0 1-.445-.446zM8.314 5.941c4.75 0 5.64.297 5.64.297s.298 0 .298 4.416c0 4.491-.297 4.491-.297 4.491s-.89.297-5.641.297-5.642-.297-5.642-.297-.297 0-.297-4.49c0-4.417.297-4.417.297-4.417s.891-.297 5.642-.297zm-4.65 1.347c-.05.534-.101 1.54-.101 3.366 0 1.874.052 2.895.1 3.444.713.07 2.097.156 4.65.156 2.554 0 3.938-.085 4.651-.156.048-.545.1-1.57.1-3.444 0-1.826-.052-2.832-.1-3.366-.709-.074-2.097-.16-4.65-.16-2.554 0-3.942.086-4.65.16zm14.15-1.978a.596.596 0 0 0-.593-.594H1.781a.596.596 0 0 0-.593.594v10.689c0 .326.267.593.593.593h15.44a.596.596 0 0 0 .594-.593zm1.188 0v10.689c0 .983-.797 1.781-1.781 1.781h-.594v1.225h-.594l-.408-1.225H3.377l-.408 1.225h-.594V17.78h-.594A1.782 1.782 0 0 1 0 16V5.309c0-.983.798-1.78 1.781-1.78h5.942L4.947 1.037a.594.594 0 1 1 .79-.887l3.764 3.377h.03L13.26.155a.593.593 0 1 1 .794.883l-2.754 2.49h5.92c.984 0 1.781.798 1.781 1.782zM15.44 9.02v-.297c0-.245.2-.445.445-.445h.297c.245 0 .445.2.445.445v.297c0 .245-.2.446-.445.446h-.297a.447.447 0 0 1-.445-.446z"
          fill="currentColor"
        />
      </g>
    </g>
  </svg>
);

const LiveBetEntertainmentSection = ({
  eventId,
  feedcode,
  hasAVLive,
  hasMatchTracker,
  scrollEffectActive,
  scrollEffectFixed,
  scrollEffectMinimise,
  selectedButton,
  setSelectedButton,
}) => {
  const { t } = useTranslation();

  const [collapsed, setCollapsed] = useState(false);

  const isLoggedIn = useSelector(getAuthLoggedIn);

  useEffect(() => {
    if (!selectedButton) {
      if (hasMatchTracker) {
        setSelectedButton("MATCH_TRACKER");
      } else if (hasAVLive) {
        setSelectedButton("TV");
      }
    }
  }, [hasAVLive, hasMatchTracker]);

  if (isEmpty(feedcode)) return null;

  if (!hasAVLive && !hasMatchTracker) return null;

  // TODO - effect to load match tracker. Consider if height should be flexible or fixed.
  // TODO - effect to load video streaming
  // TODO - Enable right sports for match tracker only...

  return (
    <section className={classes["bet-entertainment"]}>
      <section className={classes["bet-entertainment-wrapper"]}>
        <header className={cx(classes["bet-entertainment-header"], { [classes["bet-entertainment-header-active"]]: !collapsed })}>
          <div className={classes["bet-entertainment-header-text"]}>
            <p>{selectedButton === "TV" ? "실시간 중계 방송" : "매치 트래커"}</p>
          </div>
          <div className={cx(classes["bet-entertainment-header-down-wrapper"], { [classes["active"]]: !collapsed })}>
            <i
              className={cx(classes["icon-down-arrow"], classes["white"])}
              onClick={() => setCollapsed((prevState) => !prevState)}
            />
          </div>
        </header>
        {!collapsed && (
          <>
            <section className={classes["bet-entertainment-toolbar"]}>
              <div
                className={cx(
                  classes["bet-entertainment-toolbar-button"],
                  classes["match-tracker"],
                  { [classes["active"]]: selectedButton === "MATCH_TRACKER" },
                  { [classes["disabled"]]: !hasMatchTracker },
                )}
                onClick={() => setSelectedButton("MATCH_TRACKER")}
              >
                <MatchTrackerIconSvg />
              </div>
              {hasAVLive && (
                <div
                  className={cx(
                    classes["bet-entertainment-toolbar-button"],
                    classes["tv"],
                    { [classes["active"]]: selectedButton === "TV" },
                    { [classes["disabled"]]: !isLoggedIn || !hasAVLive },
                  )}
                  onClick={() => setSelectedButton("TV")}
                >
                  <TVIconSvg />
                </div>
              )}
              <div className={classes["bet-entertainment-toolbar-text"]}>
                <p>
                  {selectedButton === "MATCH_TRACKER"
                    ? t("ez.bet_entertainment_header_match_tracker")
                    : t("ez.bet_entertainment_header_tv")}
                </p>
              </div>
            </section>

            <section
              className={cx(
                classes["bet-entertainment-content"],
                { [classes["tv"]]: selectedButton === "TV" },
                { [classes["match-tracker"]]: selectedButton === "MATCH_TRACKER" },
              )}
            >
              {selectedButton === "MATCH_TRACKER" && (
                <>
                  <LiveScoreboard feedcode={feedcode} />
                  <LiveMatchTracker
                    feedcode={feedcode}
                    scrollEffectActive={scrollEffectActive}
                    scrollEffectFixed={scrollEffectFixed}
                    scrollEffectMinimise={scrollEffectMinimise}
                  />
                </>
              )}
              {selectedButton === "TV" && (
                <LiveVideo
                  eventId={eventId}
                  scrollEffectActive={scrollEffectActive}
                  scrollEffectFixed={scrollEffectFixed}
                  scrollEffectMinimise={scrollEffectMinimise}
                />
              )}
            </section>
          </>
        )}
      </section>
    </section>
  );
};

LiveBetEntertainmentSection.propTypes = {
  eventId: PropTypes.number.isRequired,
  feedcode: PropTypes.string,
  hasAVLive: PropTypes.bool.isRequired,
  hasMatchTracker: PropTypes.bool.isRequired,
  scrollEffectActive: PropTypes.bool.isRequired,
  scrollEffectFixed: PropTypes.bool.isRequired,
  scrollEffectMinimise: PropTypes.bool.isRequired,
  selectedButton: PropTypes.string.isRequired,
  setSelectedButton: PropTypes.func.isRequired,
};

LiveBetEntertainmentSection.defaultProps = {
  feedcode: undefined,
};

export default React.memo(LiveBetEntertainmentSection);
