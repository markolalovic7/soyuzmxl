import classes from "applications/betpoint/scss/betpoint.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import PrivateRoute from "../../components/PrivateRoute/components";
import PublicRoute from "../../components/PublicRoute/components";
import { useRetailUUID } from "../../hooks/auth-hooks";
import { useAvailablePromotions } from "../../hooks/bonus-hooks";
import { useSportsTree } from "../../hooks/sports-tree-hooks";
import { getAuthLoggedIn } from "../../redux/reselect/auth-selector";
import {
  getPatternLive,
  getPatternLiveEventDetail,
  getPatternLiveSportDetail,
  getPatternMyBets,
  getPatternPrematchEventDetail,
} from "../../utils/route-patterns";

import LiveLayout from "./components/LiveLayout";
import BetHistoryPage from "./pages/BetHistoryPage";
import BetslipPage from "./pages/BetslipPage";
import Homepage from "./pages/Homepage";
import LiveDashboardPage from "./pages/LiveDashboardPage";
import LiveDetailPage from "./pages/LiveDetailPage";
import LoginPage from "./pages/LoginPage";
import PrematchPage from "./pages/PrematchPage";
import PromotionPage from "./pages/PromotionPage";
import VirtualPage from "./pages/VirtualPage";

const BetPointApp = () => {
  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();
  useSportsTree({ standard: true }, dispatch);

  const isLoggedIn = useSelector(getAuthLoggedIn);

  useRetailUUID(dispatch);

  // Load the available promotions for the user (whether logged in or not)
  useAvailablePromotions(dispatch);

  return (
    <div className={classes["betpoint-body"]}>
      <Switch>
        {/* Public Routes */}
        <Route
          exact
          path="/login"
          render={(routerProps) => <PublicRoute renderAppUnauthorized={() => <LoginPage {...routerProps} />} />}
        />

        {/* Private Routes */}
        <Route
          exact
          path="/home"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <Homepage {...routerProps} />} />}
        />
        <Route
          exact
          path="/promotions"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <PromotionPage {...routerProps} />} />}
        />
        <Route
          exact
          path="/prematch/sport/:sportCode"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <PrematchPage {...routerProps} />} />}
        />
        <Route
          exact
          path="/prematch/sport/:sportCode/eventpath/:eventPathId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <PrematchPage {...routerProps} />} />}
        />
        <Route
          exact
          path="/prematch/sport/:sportCode/eventpath/:eventPathId/event/:eventId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <PrematchPage {...routerProps} />} />}
        />
        <Route
          exact
          path={getPatternPrematchEventDetail()}
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <PrematchPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/virtual"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <VirtualPage {...routerProps} />} />}
        />
        <Route
          exact
          path="/virtual/eventpath/:eventPathId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <VirtualPage {...routerProps} />} />}
        />
        <Route
          exact
          path="/virtual/eventpath/:eventPathId/event/:eventId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <VirtualPage {...routerProps} />} />}
        />

        <Route
          exact
          path={getPatternLive()}
          render={(routerProps) => (
            <PrivateRoute
              renderAppAuthorized={() => (
                <LiveLayout {...routerProps}>
                  <LiveDashboardPage {...routerProps} />
                </LiveLayout>
              )}
            />
          )}
        />
        <Route
          exact
          path={getPatternLiveSportDetail()}
          render={(routerProps) => (
            <PrivateRoute
              renderAppAuthorized={() => (
                <LiveLayout {...routerProps}>
                  <LiveDashboardPage {...routerProps} />
                </LiveLayout>
              )}
            />
          )}
        />
        <Route
          exact
          path={getPatternLiveEventDetail()}
          render={(routerProps) => (
            <PrivateRoute
              renderAppAuthorized={() => (
                <LiveLayout {...routerProps}>
                  <LiveDetailPage {...routerProps} />
                </LiveLayout>
              )}
            />
          )}
        />

        <Route
          exact
          path="/betslip/:betTypeId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <BetslipPage {...routerProps} />} />}
        />

        <Route
          exact
          path={getPatternMyBets()}
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <BetHistoryPage {...routerProps} />} />}
        />

        {/* If we are here, send the user to the home page. This includes /, for which a specific route does not exist */}
        <Redirect to={isLoggedIn ? "/home" : "/login"} />
      </Switch>
    </div>
  );
};

export default BetPointApp;
