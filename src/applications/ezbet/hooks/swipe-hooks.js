import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import useScrollLock from "use-scroll-lock";

import { getAuthIsIframe } from "../../../redux/reselect/auth-selector";
import { getPatternLive } from "../../../utils/route-patterns";
import {
  PHANTOM_CAROUSEL_SLIDE_THRESHOLD,
  PHANTOM_CAROUSEL_THRESHOLD,
} from "../components/PhantomSlider/constants/constants";
import classes from "../scss/ezbet.module.scss";
import { ALL_KEY } from "../utils/constants";

const preventSwipeOnElement = (event) => {
  // if we are swiping on an element in a scroll, or one that was explicitly marked not to be scrolled - do not go on
  const target = event.target;
  const parentTarget = target.parentElement;

  if (target.hasAttribute("disable-draggable") || parentTarget.hasAttribute("disable-draggable")) return true;

  const hasHorizontalScroll =
    target.scrollWidth > target.clientWidth || parentTarget.scrollWidth > parentTarget.clientWidth;

  return hasHorizontalScroll;
};

const alignFixedElements = (current, initial) => {
  const delta = Number(current.replace("px", "")) - initial;

  const leftOffset = document.getElementById("card-left")?.getBoundingClientRect()?.left ?? 0;
  const rightOffset =
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0) -
    (document.getElementById("card-left")?.getBoundingClientRect()?.right ?? 0);

  const mobileBanner = document.getElementById("mobile-match-banner-minimised");
  const mobileMatchTracker = document.getElementById("mobile-match-tracker-minimised");
  const mobileTv = document.getElementById("mobile-tv-minimised");
  const betslip = document.getElementById("betslip");

  if (mobileBanner) mobileBanner.style.left = `${leftOffset}px`;
  if (betslip) {
    betslip.style.left = `${delta}px`;
    betslip.style.right = `${-delta}px`;
  }

  if (mobileMatchTracker) {
    if (delta) {
      // 0 or not
      mobileMatchTracker.style.right = `${rightOffset}px`;
      mobileMatchTracker.style.transition = delta ? "none" : "all 0.3s";
    } else {
      mobileMatchTracker.style.transition = delta ? "none" : "all 0.3s";
      mobileMatchTracker.style.right = `${rightOffset}px`;
    }
  }

  if (mobileTv) {
    if (delta) {
      mobileTv.style.right = `${rightOffset}px`;
      mobileTv.style.transition = delta ? "none" : "all 0.3s";
    } else {
      mobileTv.style.transition = delta ? "none" : "all 0.3s";
      mobileTv.style.right = `${rightOffset}px`;
    }
  }
};

export function useEZSwipeable() {
  const history = useHistory();
  const location = useLocation();

  const isLive = location.pathname.startsWith("/live");
  const isPrematch = !isLive;

  const isInIframe = useSelector(getAuthIsIframe);
  const [stopScroll, setStopScroll] = useState(false);
  const [slideSize, setSlideSize] = useState(Math.max(document.documentElement.clientWidth, window.innerWidth || 0));

  // const slideSize = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  const phantomSliderSettings = useRef({
    // used to qualify when we allow transitions. 1) Enabled by default, 2) Disabled when a transition commences, 3) enabled when a swipe is confirmed (left or right), 4) disabled again after the swipe ends and until the transition ends (to avoid race conditions) 5) enabled after the transition ends (back to default)
    allowShift: true,
    allowSwiping: false,
    appliedDelta: 0,
    index: isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0),
    maxLeftPosition: 0,
    minLeftPosition: isInIframe ? -3 * slideSize : -1 * slideSize,
    pendingDelta: 0,
    posFinal: -(isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0)) * slideSize,
    posInitial: -(isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0)) * slideSize,
    slideSize,
    slideThreshold: PHANTOM_CAROUSEL_SLIDE_THRESHOLD,
    slidesLength: isInIframe ? 4 : 2,
    threshold: PHANTOM_CAROUSEL_THRESHOLD,
  });

  // Track dimensions for carousel purposes
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const latestSlideSize = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

      if (latestSlideSize !== slideSize) {
        setSlideSize(latestSlideSize);

        phantomSliderSettings.current.minLeftPosition = isInIframe ? -3 * latestSlideSize : -1 * latestSlideSize;
        phantomSliderSettings.current.posFinal =
          -(isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0)) * latestSlideSize;
        phantomSliderSettings.current.posInitial =
          -(isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0)) * latestSlideSize;
      }
    });

    // start observing a DOM node
    resizeObserver.observe(document.body);
  }, [slideSize]); // Empty array ensures that effect is only run on mount

  useEffect(() => {
    const items = document.getElementById("phantom-slider-items");

    items.style.left = `${-(isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0)) * slideSize}px`;
    alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);

    // this can cause race conditions, but basically we want to ensure the page is always where it should be...
    phantomSliderSettings.current.index = isLive ? 0 + (isInIframe ? 1 : 0) : 1 + (isInIframe ? 1 : 0);

    // setDebugText(`isLive: ${isLive}, index: ${phantomSliderSettings.current.index}`);
  }, [isPrematch, isLive, isInIframe, slideSize]);

  const DEBUG = process.env.REACT_APP_EZBET_SWIPE_DEBUG_ON;

  const onSwipeStartHandler = useCallback(
    (eventData) => {
      const onSwipeStartHandler = (eventData) => {
        const isSwipeUp = eventData.dir.toUpperCase() === "Up".toUpperCase();
        const isSwipeDown = eventData.dir.toUpperCase() === "Down".toUpperCase();

        if (isSwipeUp || isSwipeDown) {
          // this is a scroll, nothing to do with swipes.

          // Reset state for x axis (same we do at the end of this very method)
          phantomSliderSettings.current.allowShift = false;
          phantomSliderSettings.current.allowSwiping = false;
          const items = document.getElementById("phantom-slider-items");
          phantomSliderSettings.current.posInitial = items.offsetLeft;
          phantomSliderSettings.current.appliedDelta = 0; // Track where the carousel panel (main content) starting delta (axis movement)

          return;
        }

        if (preventSwipeOnElement(eventData.event)) {
          return;
        }

        // Prevent swiping when a confirmation modal is open
        if (document.getElementById("confirmation-modal") || document.getElementById("cash-out-modal")) {
          return;
        }

        if (!eventData.event.cancelable) return; // if the event cannot be canceled, don't do anything. The user is possibly in the middle of a scroll action.

        eventData.event.stopPropagation();
        if (eventData.event.cancelable) eventData.event.preventDefault();

        // Is this actionable?
        const isSwipeLeft = eventData.dir.toUpperCase() === "Left".toUpperCase();
        const isSwipeRight = eventData.dir.toUpperCase() === "Right".toUpperCase();

        // If the user is in prematch and the user swipes left (PREV)  - let it continue. If it ends in a panel change, call the parent and notify.
        if (isPrematch && isSwipeLeft) {
          if (!isInIframe) {
            return;
          }

          if (DEBUG) console.log("isPrematch and user swiped right --> possible parent notification!");
        }

        // If the user is in live and the user swipes right (NEXT)  - let it continue. If it ends in a panel change, call the parent and notify.
        if (isLive && isSwipeRight) {
          if (!isInIframe) {
            return;
          }

          if (DEBUG) console.log("isLive and user swiped left --> possible parent notification!");
        }

        // If the user is in prematch and swiped left...
        if (isPrematch && isSwipeRight) {
          // If HOME and the user swipes right let it continue. If it ends in a panel change, redirect to live on completion.
          // const isPrematchHomePage = !!matchPath(location.pathname, {
          //   exact: true,
          //   path: getPatternPrematchSports(),
          // });
          //
          // if (!isPrematchHomePage) {
          //   // the user is NOT in the home page?
          //   // no navigation allowed here
          //   return;
          // }
        }

        // If the user is in live and swiped right...
        if (isLive && isSwipeLeft) {
          // If LIVE HOME and the user left right let it continue. If it ends in a panel change, redirect to home on completion.
          // const isLiveHomePage = !!(
          //   matchPath(location.pathname, {
          //     exact: true,
          //     path: getPatternLiveSportDetail(),
          //   }) ||
          //   matchPath(location.pathname, {
          //     exact: true,
          //     path: getPatternLive(),
          //   })
          // );
          //
          // if (!isLiveHomePage) {
          //   // the user is NOT in the live home page?
          //   // no navigation allowed here
          //   return;
          // }
        }
        // prevent scrolling while we are in the middle of a drag and drop swiper action...
        // scrollLock.disablePageScroll();

        // multiple efforts to prevent vertical scrolling while swiping
        setStopScroll(true);
        const prematchContainer = document.getElementById("prematch-slide-card");
        const liveContainer = document.getElementById("live-slide-card");
        if (prematchContainer) prematchContainer.style.touchAction = "none";
        if (liveContainer) liveContainer.style.touchAction = "none";

        // Track actions for the draggable effect
        const items = document.getElementById("phantom-slider-items");
        phantomSliderSettings.current.posInitial = items.offsetLeft;
        phantomSliderSettings.current.appliedDelta = 0; // Track where the carousel panel (main content) starting delta (axis movement)

        phantomSliderSettings.current.allowSwiping = true;

        // Lock the shift of slides until we see this come through at onSwipeLeft / onSwipeRight
        phantomSliderSettings.current.allowShift = false;
      };

      return onSwipeStartHandler(eventData);
    },
    [isLive, isPrematch, location.pathname, isInIframe],
  );

  const onSwipingHandler = useCallback((eventData) => {
    const onSwipingHandler = (eventData) => {
      // Is this actionable?
      const isSwipeLeft = eventData.dir.toUpperCase() === "Left".toUpperCase();
      const isSwipeRight = eventData.dir.toUpperCase() === "Right".toUpperCase();

      if (!(isSwipeLeft || isSwipeRight)) return;

      if (preventSwipeOnElement(eventData.event)) {
        return;
      }

      if (!phantomSliderSettings.current.allowSwiping) return;

      if (!eventData.event.cancelable) return; // if the event cannot be canceled, don't do anything. The user is possibly in the middle of a scroll action.

      // Do this after verifying if it's swipe left or right, to avoid killing a scroll action.
      if (eventData.event.cancelable) eventData.event.preventDefault();
      eventData.event.stopPropagation();

      // Track actions for the draggable effect

      // alert(
      //   `minLeftPosition: ${phantomSliderSettings.current.minLeftPosition}, maxLeftPosition: ${
      //     phantomSliderSettings.current.maxLeftPosition
      //   }, target: ${
      //     phantomSliderSettings.current.posInitial - (phantomSliderSettings.current.appliedDelta - eventData.deltaX)
      //   }`,
      // );
      if (
        phantomSliderSettings.current.minLeftPosition < phantomSliderSettings.current.posInitial + eventData.deltaX &&
        phantomSliderSettings.current.maxLeftPosition > phantomSliderSettings.current.posInitial + eventData.deltaX
      ) {
        phantomSliderSettings.current.pendingDelta = phantomSliderSettings.current.appliedDelta - eventData.deltaX; // track the current delta we are applying (the movement of the swipe)
        phantomSliderSettings.current.appliedDelta = eventData.deltaX; // And where the component is now in absolute terms
        // setDebugText(
        //   `minLeftPosition: ${phantomSliderSettings.current.minLeftPosition}, maxLeftPosition: ${
        //     phantomSliderSettings.current.maxLeftPosition
        //   }, posInitial: ${phantomSliderSettings.current.posInitial}, appliedDelta: ${
        //     phantomSliderSettings.current.appliedDelta
        //   }, deltaX: ${eventData.deltaX}, target: ${phantomSliderSettings.current.posInitial + eventData.deltaX}`,
        // );

        // Animate the carousel (move the component)
        const items = document.getElementById("phantom-slider-items");
        items.style.left = `${items.offsetLeft - phantomSliderSettings.current.pendingDelta}px`;
        alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);
      } else {
        //   setDebugText(
        //     `minLeftPosition: ${phantomSliderSettings.current.minLeftPosition}, maxLeftPosition: ${
        //       phantomSliderSettings.current.maxLeftPosition
        //     }, posInitial: ${phantomSliderSettings.current.posInitial}, appliedDelta: ${
        //       phantomSliderSettings.current.appliedDelta
        //     }, deltaX: ${eventData.deltaX}, target: ${phantomSliderSettings.current.posInitial + eventData.deltaX}`,
        //   );
      }
    };

    return onSwipingHandler(eventData);
  }, []);

  const onSwipedRightHandler = useCallback(
    (eventData) => {
      const onSwipedRightHandler = (eventData) => {
        const event = eventData.event;

        if (preventSwipeOnElement(event)) {
          // alert("Swiped Right Prevented due to scroll!" + event.target);
          return;
        }

        // Prevent swiping when a confirmation modal is open
        if (document.getElementById("confirmation-modal") || document.getElementById("cash-out-modal")) {
          return;
        }

        if (!eventData.event.cancelable) return; // if the event cannot be canceled, don't do anything. The user is possibly in the middle of a scroll action.

        if (event.cancelable) event.preventDefault();
        event.stopPropagation();

        if (eventData.absX < PHANTOM_CAROUSEL_SLIDE_THRESHOLD) {
          return;
        }

        if (location.pathname.startsWith("/live")) {
          // we are in live, notify EZ the user swiped right.
          // alert("Swiped Right!" + event.target);
          window.parent.postMessage(
            {
              action: "app.ez.swipe_right", // bad naming
            },
            "*",
          );
        } else {
          // const isPrematchHomePage = matchPath(location.pathname, { exact: true, path: getPatternPrematchSports() });

          // we are in the prematch section, send the user right to live...
          // if (isPrematchHomePage) {
          history.push(getPatternLive());
          // }
        }
      };

      return onSwipedRightHandler(eventData);
    },
    [location.pathname],
  );

  const onSwipedLeftHandler = useCallback(
    (eventData) => {
      const onSwipedLeftHandler = (eventData) => {
        const event = eventData.event;

        if (preventSwipeOnElement(event)) {
          // alert("Swiped Right Prevented due to scroll!" + event.target);
          return;
        }

        // Prevent swiping when a confirmation modal is open
        if (document.getElementById("confirmation-modal") || document.getElementById("cash-out-modal")) {
          return;
        }

        if (!eventData.event.cancelable) return; // if the event cannot be canceled, don't do anything. The user is possibly in the middle of a scroll action.

        if (event.cancelable) event.preventDefault();
        event.stopPropagation();

        if (eventData.absX < PHANTOM_CAROUSEL_SLIDE_THRESHOLD) {
          return;
        }

        if (!location.pathname.startsWith("/live")) {
          // we are in prematch, notify EZ the user swiped left - we are done.
          // alert("Swiped Left!" + event.target);
          window.parent.postMessage(
            {
              action: "app.ez.swipe_left", // bad naming
            },
            "*",
          );
        } else {
          // If we are in live section though, go to prematch...
          // const isLiveHomePage = matchPath(location.pathname, { exact: true, path: getPatternLiveSportDetail() });

          // if (isLiveHomePage) {
          history.push(`/prematch/sport/${ALL_KEY}`);
          // }
        }
      };

      return onSwipedLeftHandler(eventData);
    },
    [location.pathname],
  );

  const onSwipeEnded = useCallback((eventData) => {
    function shiftSlide(dir, action) {
      const items = document.getElementById("phantom-slider-items");

      items.classList.add(classes["shifting"]);

      // setDebugText(` SWIPE ENDED - allowShift: ${phantomSliderSettings.current.allowShift}`);
      if (phantomSliderSettings.current.allowShift) {
        if (!action) {
          phantomSliderSettings.current.posInitial = items.offsetLeft;
        }
        // alert(
        //   "index = " +
        //     phantomSliderSettings.current.index +
        //     1 +
        //     ", left: " +
        //     `${phantomSliderSettings.current.posInitial - phantomSliderSettings.current.slideSize}px`,
        // );

        if (dir === 1) {
          // alert(
          //   `posInitial: ${phantomSliderSettings.current.posInitial}, slideSize: ${phantomSliderSettings.current.slideSize}`,
          // );
          // alert(`left: ${phantomSliderSettings.current.posInitial - phantomSliderSettings.current.slideSize + "px"}`);

          items.style.left = `${phantomSliderSettings.current.posInitial - phantomSliderSettings.current.slideSize}px`;
          alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);

          // phantomSliderSettings.current.index++;
          phantomSliderSettings.current.index += 1;
        } else if (dir === -1) {
          items.style.left = `${phantomSliderSettings.current.posInitial + phantomSliderSettings.current.slideSize}px`;
          alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);

          // phantomSliderSettings.current.index--;
          phantomSliderSettings.current.index -= 1;
        }

        phantomSliderSettings.current.allowShift = false;
      } else {
        // For whatever reason we ended up here, make sure to leave the carousel in a stable known condition
        items.style.left = `${phantomSliderSettings.current.posInitial}px`;
        alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);
      }
    }

    const onSwipeEnded = (eventData) => {
      // Do not uncomment - required to make sure the slides are aligned at the end of the process
      // // Is this actionable?
      // const isSwipeLeft = eventData.dir.toUpperCase() === "Left".toUpperCase();
      // const isSwipeRight = eventData.dir.toUpperCase() === "Right".toUpperCase();
      //
      // if (!(isSwipeLeft || isSwipeRight)) return;
      const isSwipeLeft = eventData.dir.toUpperCase() === "Left".toUpperCase();
      const isSwipeRight = eventData.dir.toUpperCase() === "Right".toUpperCase();

      if (isSwipeRight || isSwipeLeft) {
        phantomSliderSettings.current.allowShift = true; // allow the transition to complete
        // if the shift is not allowed, the code below will reset the position
      }

      const items = document.getElementById("phantom-slider-items");

      phantomSliderSettings.current.posFinal = items.offsetLeft;

      if (phantomSliderSettings.current.allowShift) {
        if (
          phantomSliderSettings.current.posFinal - phantomSliderSettings.current.posInitial <
          -phantomSliderSettings.current.slideThreshold
        ) {
          shiftSlide(1, "drag");
        } else if (
          phantomSliderSettings.current.posFinal - phantomSliderSettings.current.posInitial >
          phantomSliderSettings.current.slideThreshold
        ) {
          shiftSlide(-1, "drag");
        } else {
          // reset
          items.style.left = `${phantomSliderSettings.current.posInitial}px`;
          alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);
        }
      } else {
        // reset
        items.style.left = `${phantomSliderSettings.current.posInitial}px`;
        alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);
      }

      phantomSliderSettings.current.allowSwiping = false;

      // revert scroll locks...
      setStopScroll(false);
      const prematchContainer = document.getElementById("prematch-slide-card");
      const liveContainer = document.getElementById("live-slide-card");
      if (prematchContainer) prematchContainer.style.touchAction = "auto";
      if (liveContainer) liveContainer.style.touchAction = "auto";
    };

    return onSwipeEnded(eventData);
  }, []);

  const checkIndex = useCallback(() => {
    function checkIndex() {
      const items = document.getElementById("phantom-slider-items");

      items.classList.remove(classes["shifting"]);

      if (phantomSliderSettings.current.index === -1) {
        items.style.left = `${-(isInIframe ? 1 : 0) * slideSize}px`;
        alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);
        phantomSliderSettings.current.index = isInIframe ? 1 : 0;
      }

      if (phantomSliderSettings.current.index === phantomSliderSettings.current.slidesLength) {
        items.style.left = `${-(1 + (isInIframe ? 1 : 0)) * slideSize}px`;
        alignFixedElements(items.style.left, phantomSliderSettings.current.posInitial);
        phantomSliderSettings.current.index = 1 + (isInIframe ? 1 : 0);
      }

      phantomSliderSettings.current.allowShift = true;
    }

    return checkIndex();
  }, []);

  useEffect(() => {
    setTimeout(
      () => document.getElementById("phantom-slider-items").addEventListener("transitionend", checkIndex),
      500,
    );
  }, []);

  const swipeHandlers = useSwipeable({
    delta: PHANTOM_CAROUSEL_THRESHOLD, // must match the threshold in PhantomSlider!
    onSwipeStart: (eventData) => onSwipeStartHandler(eventData),
    onSwiped: (eventData) => onSwipeEnded(eventData), // this executes on parallel to onSwipedLeft/Right
    onSwipedLeft: (eventData) => onSwipedLeftHandler(eventData),
    onSwipedRight: (eventData) => onSwipedRightHandler(eventData),
    onSwiping: (eventData) => onSwipingHandler(eventData),
    preventScrollOnSwipe: false,
    // swipeDuration: 250, // only swipes under 250ms will trigger callbacks
    touchEventOptions: { passive: false }, // we need this to be "active" so we can cancel default behaviour (such as scrolls) when the user is swiping right or left
  });

  useScrollLock(stopScroll); // prevent scroll kicking off as we did with preventScrollOnSwipe

  return { swipeHandlers };
}
