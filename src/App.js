import PropTypes from "prop-types";
import React, { Suspense, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useThirdPartyBalance } from "./utils/AppUtils";

import withCms from "hocs/withCms";
import { useAssets } from "hooks/assets-hooks";
import { useBalance } from "hooks/balance-hooks";
import { useSports } from "hooks/sports-hooks";
import { useWindowSize } from "hooks/window-hooks";
import { getAuthDesktopView, getAuthMobileView } from "redux/reselect/auth-selector";
import { getAppDesktop, getAppMobile } from "utils/app";

const SlipstreamApp = React.lazy(() => import("applications/slipstream/SlipstreamApp"));
const BetPointApp = React.lazy(() => import("applications/betpoint/BetPointApp"));

const propTypes = {
  isBetPoint: PropTypes.bool.isRequired,
  isMobileDevice: PropTypes.bool.isRequired,
  isSlipstream: PropTypes.bool.isRequired,
};

const defaultProps = {};

// https://github.com/flexdinesh/react-socks
// { xsmall: 0 }, // all mobile devices
// { small: 576 }, // mobile devices (not sure which one's this big)
// { medium: 768 }, // ipad, ipad pro, ipad mini, etc
// { large: 992 }, // smaller laptops
// { xlarge: 1200 } // laptops and desktops
const App = ({ isBetPoint, isMobileDevice, isSlipstream }) => {
  // Obtain the CMS configuration
  const dispatch = useDispatch();

  // Used for iframe mode, where we will notify the parent on our size
  useWindowSize();

  const authMobileView = useSelector(getAuthMobileView);
  const authDesktopViewType = useSelector(getAuthDesktopView);

  // Switch case based on CMS data...  (but we can override via env variables for dev purposes).
  const [mobileViewType, setMobileViewType] = useState(authMobileView);

  // If the user is logged in, load the balance upon page refresh or initial login...
  useBalance(dispatch);

  // Third party balance
  useThirdPartyBalance(dispatch);

  // If we don't know about the sports, ask for them now...
  useSports(isMobileDevice, dispatch);

  useAssets(dispatch);

  useLayoutEffect(() => {
    if (isMobileDevice && authMobileView) {
      setMobileViewType(authMobileView);
    }
  }, [isMobileDevice, authMobileView]);

  if (isMobileDevice) {
    // Mobile - Switch case based on CMS data...
    // if `cms` still loading, display loading screen.
    if (!mobileViewType) {
      return <div>Loading...</div>;
    }

    const AppMobile = getAppMobile(mobileViewType);

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AppMobile />
      </Suspense>
    );
  }

  if (isSlipstream) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SlipstreamApp />
      </Suspense>
    );
  }

  if (isBetPoint) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BetPointApp />
      </Suspense>
    );
  }

  // Desktop - Switch case based on CMS data...
  if (!authDesktopViewType) {
    return <div>Loading...</div>;
  }
  const AppDesktop = getAppDesktop(authDesktopViewType);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppDesktop />
    </Suspense>
  );
};

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default withCms(App);
