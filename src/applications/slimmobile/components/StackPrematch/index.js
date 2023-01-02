import PropTypes from "prop-types";
import { lazy, Suspense } from "react";
import { Route, Switch } from "react-router";

import NavigationBar from "../Navigation/NavigationBar";

import SportBar from "applications/slimmobile/common/components/SportBar";
import { getPatternPrematchEvent, getPatternPrematchMain, getPatternSearchResults } from "utils/route-patterns";

const SlimEventPathCoupon = lazy(() =>
  import("../Sports/Prematch/SlimMobilePrematch/SlimMobileCoupons/SlimEventPathCoupon"),
);
const SlimSearchCoupon = lazy(() =>
  import("applications/slimmobile/components/Sports/Prematch/SlimMobilePrematch/SlimMobileCoupons/SlimSearchCoupon"),
);

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {};

const StackPrematch = ({ match, ...props }) => (
  <>
    <NavigationBar {...props} />
    <SportBar />
    <Suspense fallback={null}>
      <Switch>
        <Route exact component={SlimEventPathCoupon} path={getPatternPrematchEvent()} />
        <Route exact component={SlimEventPathCoupon} path={getPatternPrematchMain()} />
        <Route
          exact
          path={getPatternSearchResults()}
          render={(routerProps) => (
            <>
              <NavigationBar {...routerProps} />
              <SportBar />
              <SlimSearchCoupon {...routerProps} />
            </>
          )}
        />
      </Switch>
    </Suspense>
  </>
);

StackPrematch.propTypes = propTypes;
StackPrematch.defaultProps = defaultProps;

export default StackPrematch;
