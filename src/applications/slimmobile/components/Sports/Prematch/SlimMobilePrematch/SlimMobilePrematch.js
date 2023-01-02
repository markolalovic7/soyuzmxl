import SportBar from "applications/slimmobile/common/components/SportBar";
import PropTypes from "prop-types";
import { Route, Switch } from "react-router";

import SlimEventPathCoupon from "./SlimMobileCoupons/SlimEventPathCoupon";
import SlimSearchCoupon from "./SlimMobileCoupons/SlimSearchCoupon";

const propTypes = {
  match: PropTypes.object.isRequired,
};

const defaultProps = {};

const SlimMobilePrematch = ({ match }) => (
  <>
    <SportBar />
    <Switch>
      <Route exact component={SlimEventPathCoupon} path={`${match.path}/eventpath/:eventPathCodes/:eventId`} />
      <Route exact component={SlimEventPathCoupon} path={`${match.path}/eventpath/:eventPathCodes`} />
      <Route exact component={SlimSearchCoupon} path={`${match.path}/search/:searchKeyword`} />
    </Switch>
  </>
);

SlimMobilePrematch.propTypes = propTypes;
SlimMobilePrematch.defaultProps = defaultProps;

export default SlimMobilePrematch;
