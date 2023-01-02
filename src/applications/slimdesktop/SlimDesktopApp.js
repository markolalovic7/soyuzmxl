import Layout from "applications/slimdesktop/components/Layout";
import React, { lazy, Suspense, useRef } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import PrivateRoute from "../../components/PrivateRoute/components";
import PublicRoute from "../../components/PublicRoute/components";
import { useGetMatchStatuses } from "../../hooks/matchstatus-hooks";
import { useSportsTree } from "../../hooks/sports-tree-hooks";
import {
  getPatternAccountCreate,
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternConfirmPasswordReset,
  getPatternContentPage,
  getPatternHome,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveEventPathAndEventDetail,
  getPatternLiveEventPathDetail,
  getPatternMyBets,
  getPatternMyStatements,
  getPatternPrematch,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
  getPatternRequestPasswordReset,
  getPatternResults,
  getPatternSearchResults,
} from "../../utils/route-patterns";

import LivePage from "./pages/LivePage";
import { getHrefPrematch } from "../../utils/route-href";

const AccountCreatePage = lazy(() => import("./pages/AccountCreatePage"));
const AccountUpdatePage = lazy(() => import("./pages/AccountUpdatePage"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const LiveCalendarPage = lazy(() => import("./pages/LiveCalendarPage"));
const MyBetsPage = lazy(() => import("./pages/MyBetsPage"));
const MyStatementsPage = lazy(() => import("./pages/MyStatementsPage"));
const ContentPage = lazy(() => import("./pages/ContentPage"));
const PrematchPage = lazy(() => import("./pages/PrematchPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));

export const UsernameContext = React.createContext();

const SlimDesktopApp = () => {
  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();
  useSportsTree({ standard: true }, dispatch);
  useGetMatchStatuses(dispatch);

  const usernameInput = useRef(null);

  return (
    <UsernameContext.Provider value={usernameInput}>
      <Layout>
        <Suspense fallback={null}>
          <Switch>
            <Route exact path={getPatternHome()}>
              <DashboardPage />
            </Route>

            <Route exact path={getPatternPrematch()}>
              <PrematchPage />
            </Route>

            <Route exact path={getPatternPrematchMain()}>
              <PrematchPage />
            </Route>

            <Route exact path={getPatternPrematchEventDetail()}>
              <PrematchPage />
            </Route>

            <Route exact path={getPatternSearchResults()}>
              <div />
            </Route>

            <Route exact path={getPatternResults()}>
              <ResultsPage />
            </Route>

            <Route exact path={getPatternLiveCalendar()}>
              <LiveCalendarPage />
            </Route>

            <Route exact path={getPatternLive()}>
              <LivePage />
            </Route>

            <Route exact path={getPatternLiveEventPathDetail()}>
              <LivePage />
            </Route>

            <Route exact path={getPatternLiveEventPathAndEventDetail()}>
              <LivePage />
            </Route>

            <Route exact path={getPatternContentPage()}>
              <ContentPage />
            </Route>

            {/* Public Routes */}
            <Route
              exact
              path={getPatternAccountCreate()}
              render={(routerProps) => (
                <PublicRoute renderAppUnauthorized={() => <AccountCreatePage {...routerProps} />} />
              )}
            />

            {/*   //TODO - confirm password pages (request and confirm reset) */}

            <Route
              exact
              path={getPatternRequestPasswordReset()}
              render={(routerProps) => <PublicRoute renderAppUnauthorized={() => <div {...routerProps} />} />}
            />
            <Route
              exact
              path={getPatternConfirmPasswordReset()}
              render={(routerProps) => <PublicRoute renderAppUnauthorized={() => <div {...routerProps} />} />}
            />

            {/* Private routes */}
            <Route
              exact
              path={getPatternAccountEdit()}
              render={(routerProps) => (
                <PrivateRoute renderAppAuthorized={() => <AccountUpdatePage {...routerProps} />} />
              )}
            />

            <Route
              exact
              path={getPatternAccountSecurityEdit()}
              render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <SecurityPage {...routerProps} />} />}
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

            {/* Handler for deep links for sports path */}
            <Route
              exact
              path="/sports/:sportCode/:eventPathId"
              render={(props) => (
                // eslint-disable-next-line react/prop-types
                <Redirect to={getHrefPrematch(props.match.params.eventPathId)} />
              )}
            />

            {/* If we are here, send the user to the home page. */}
            <Redirect to="/" />
          </Switch>
        </Suspense>
      </Layout>
    </UsernameContext.Provider>
  );
};

export default SlimDesktopApp;
