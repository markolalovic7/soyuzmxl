import { lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import { useSportsTree } from "../../hooks/sports-tree-hooks";

import ScrollToTopButton from "./common/components/ScrollToTopButton";
import NavigationBar from "./components/Navigation/NavigationBar";
import Toolbar from "./components/Navigation/Toolbar";
import classes from "./scss/slimmobilestyle.module.scss";

import ScrollToTop from "applications/common/components/ScrollToTop/ScrollToTop";
import PrivateRoute from "components/PrivateRoute";
import PublicRoute from "components/PublicRoute";
import withFavicon from "hocs/withFavicon";
import withTitleBrandName from "hocs/withTitleBrandName";
import {
  getPatternAccountCreate,
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternConfirmPasswordReset,
  getPatternContentPage,
  getPatternHome,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternMyBets,
  getPatternMyStatements,
  getPatternPrematch,
  getPatternRequestPasswordReset,
  getPatternResults,
} from "utils/route-patterns";

const AccountCreatePage = lazy(() => import("./components/AccountCreatePage"));
const AccountEditPage = lazy(() => import("./components/AccountEditPage"));
const AccountPasswordEditPage = lazy(() => import("./components/AccountPasswordEditPage"));
const ConfirmPasswordResetPage = lazy(() => import("./components/ConfirmPasswordResetPage"));
const ContentPage = lazy(() => import("./components/ContentPage"));
const HomePage = lazy(() => import("./components/HomePage"));
const LivePage = lazy(() => import("./components/LivePage"));
const LiveCalendarPage = lazy(() => import("./components/LiveCalendarPage"));
const MyBetsPage = lazy(() => import("./components/MyBetsPage"));
const MyStatementsPage = lazy(() => import("./components/MyStatementsPage"));
const RequestPasswordResetPage = lazy(() => import("./components/RequestPasswordResetPage"));
const ResultsPage = lazy(() => import("./components/ResultsPage"));
const StackPrematch = lazy(() => import("./components/StackPrematch"));

const SlimMobileApp = () => {
  const dispatch = useDispatch();
  useSportsTree({ standard: true }, dispatch);

  return (
    // Setup Routing here
    <div className={classes["slimmobile-body"]}>
      <ScrollToTop />
      <div className={classes.wrapper}>
        <ScrollToTopButton />
        <Toolbar
          renderBody={(toolbarProps) => (
            <Suspense fallback={null}>
              <Switch>
                <Route
                  path={getPatternPrematch()}
                  render={(routerProps) => <StackPrematch {...toolbarProps} {...routerProps} />}
                />
                <Route
                  exact
                  path={getPatternLive()}
                  render={(routerProps) => (
                    <>
                      <NavigationBar {...toolbarProps} />
                      <LivePage {...routerProps} />
                    </>
                  )}
                />
                <Route
                  exact
                  path={getPatternContentPage()}
                  render={(routerProps) => (
                    <>
                      <NavigationBar {...toolbarProps} />
                      <ContentPage {...routerProps} />
                    </>
                  )}
                />
                <Route
                  exact
                  path={getPatternLiveCalendar()}
                  render={(routerProps) => (
                    <>
                      <NavigationBar {...toolbarProps} />
                      <LiveCalendarPage {...routerProps} />
                    </>
                  )}
                />
                <Route
                  exact
                  path={getPatternResults()}
                  render={(routerProps) => (
                    <>
                      <NavigationBar {...toolbarProps} />
                      <ResultsPage {...routerProps} />
                    </>
                  )}
                />

                {/* Public routes */}
                <Route
                  exact
                  path={getPatternAccountCreate()}
                  render={(routerProps) => (
                    <PublicRoute renderAppUnauthorized={() => <AccountCreatePage {...routerProps} />} />
                  )}
                />
                <Route
                  exact
                  path={getPatternRequestPasswordReset()}
                  render={(routerProps) => (
                    <PublicRoute renderAppUnauthorized={() => <RequestPasswordResetPage {...routerProps} />} />
                  )}
                />
                <Route
                  exact
                  path={getPatternConfirmPasswordReset()}
                  render={(routerProps) => (
                    <PublicRoute renderAppUnauthorized={() => <ConfirmPasswordResetPage {...routerProps} />} />
                  )}
                />

                {/* Private routes */}

                <Route
                  exact
                  path={getPatternAccountSecurityEdit()}
                  render={(routerProps) => (
                    <PrivateRoute renderAppAuthorized={() => <AccountPasswordEditPage {...routerProps} />} />
                  )}
                />
                <Route
                  exact
                  path={getPatternAccountEdit()}
                  render={(routerProps) => (
                    <PrivateRoute renderAppAuthorized={() => <AccountEditPage {...routerProps} />} />
                  )}
                />
                <Route
                  exact
                  path={getPatternMyBets()}
                  render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <MyBetsPage {...routerProps} />} />}
                />
                <Route
                  exact
                  path={getPatternMyStatements()}
                  render={(routerProps) => (
                    <PrivateRoute renderAppAuthorized={() => <MyStatementsPage {...routerProps} />} />
                  )}
                />

                {/* Home */}
                <Route
                  exact
                  path={getPatternHome()}
                  render={(routerProps) => (
                    <>
                      <NavigationBar {...toolbarProps} />
                      <HomePage {...routerProps} />
                    </>
                  )}
                />

                {/* Handler for deep links for sports path */}
                <Route
                  exact
                  path="/sports/:sportCode/:eventPathId"
                  render={(props) => (
                    // eslint-disable-next-line react/prop-types
                    <Redirect to={`/prematch/eventpath/s${props.match.params.sportCode}`} />
                  )}
                />

                {/* If we are here, send the user to the home page */}
                <Redirect to={getPatternHome()} />
              </Switch>
            </Suspense>
          )}
        />
      </div>
    </div>
  );
};

export default withFavicon(withTitleBrandName(SlimMobileApp));
