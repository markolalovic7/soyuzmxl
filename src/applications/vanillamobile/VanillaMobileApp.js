import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import { useAvailablePromotions } from "../../hooks/bonus-hooks";
import { useSportsTree } from "../../hooks/sports-tree-hooks";
import { getAuthMobileView } from "../../redux/reselect/auth-selector";

import PageWrapper from "./common/components/PageWrapper";
import ScrollToTopButton from "./common/components/ScrollToTopButton";
import classes from "./scss/vanillamobilestyle.module.scss";

import ScrollToTop from "applications/common/components/ScrollToTop/ScrollToTop";
import HomePage from "applications/vanillamobile/components/HomePage";
import PrivateRoute from "components/PrivateRoute";
import PublicRoute from "components/PublicRoute";
import withFavicon from "hocs/withFavicon";
import withTitleBrandName from "hocs/withTitleBrandName";
import {
  getPatternAccountCreate,
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternBetCalculator,
  getPatternBetradarVirtualSport,
  getPatternChatPage,
  getPatternConfirmPasswordReset,
  getPatternContentPage,
  getPatternHome,
  getPatternJackpot,
  getPatternJackpots,
  getPatternKironVirtualSport,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveEventDetail,
  getPatternMyBets,
  getPatternMyStatements,
  getPatternPrematch,
  getPatternPromotions,
  getPatternRequestPasswordReset,
  getPatternResults,
  getPatternSolidGamingCasino,
} from "utils/route-patterns";

const AccountCreatePage = lazy(() => import("./components/AccountCreatePage"));
const AccountEditPage = lazy(() => import("./components/AccountEditPage"));
const AccountSecurityEditPage = lazy(() => import("./components/AccountSecurityEditPage/components"));
const BetCalculatorPage = lazy(() => import("./components/BetCalculatorPage"));
const BetradarVirtualSportsPage = lazy(() => import("./components/BetradarVirtualSportsPage"));
const ContentPage = lazy(() => import("./components/ContentPage"));
const JackpotDetailsPage = lazy(() => import("./components/JackpotDetailsPage"));
const JackpotsPage = lazy(() => import("./components/JackpotsPage"));
const KironVirtualSportsPage = lazy(() => import("./components/KironVirtualSportsPage"));
const LivePage = lazy(() => import("./components/LivePage"));
const LiveMatchDetail = lazy(() => import("./components/Sports/Live/LiveMatchDetail/LiveMatchDetail"));
const LiveCalendarPage = lazy(() => import("./components/LiveCalendarPage"));
const MyBetsPage = lazy(() => import("./components/MyBetsPage"));
const MyStatementsPage = lazy(() => import("./components/MyStatementsPage"));
const StackPrematch = lazy(() => import("./components/StackPrematch"));
const ResultsPage = lazy(() => import("./components/ResultsPage"));
const RequestPasswordResetPage = lazy(() => import("./components/RequestPasswordResetPage/components"));
const ConfirmPasswordResetPage = lazy(() => import("./components/ConfirmPasswordResetPage/components"));
const ChatPage = lazy(() => import("./components/ChatPage"));
const SolidGamingCasinoPage = lazy(() => import("./components/SolidGamingCasinoPage"));
const PromotionPage = lazy(() => import("./components/PromotionPage"));

const VanillaMobileApp = () => {
  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();

  const view = useSelector(getAuthMobileView);

  useSportsTree({ standard: true }, dispatch);

  // Load the available promotions for the user (whether logged in or not)
  useAvailablePromotions(dispatch);

  return (
    // Setup Routing here
    <div className={classes["vanillamobile-body"]}>
      <ScrollToTop />
      <PageWrapper>
        <ScrollToTopButton />
        <Suspense fallback={null}>
          <Switch>
            <Route component={StackPrematch} path={getPatternPrematch()} />
            <Route exact component={BetCalculatorPage} path={getPatternBetCalculator()} />
            <Route exact component={BetradarVirtualSportsPage} path={getPatternBetradarVirtualSport()} />
            <Route exact component={ContentPage} path={getPatternContentPage()} />
            <Route exact component={LiveMatchDetail} path={getPatternLiveEventDetail()} />
            <Route exact component={LiveCalendarPage} path={getPatternLiveCalendar()} />
            <Route exact component={LivePage} path={getPatternLive()} />
            <Route exact component={KironVirtualSportsPage} path={getPatternKironVirtualSport()} />
            <Route exact component={JackpotDetailsPage} path={getPatternJackpot()} />
            <Route exact component={JackpotsPage} path={getPatternJackpots()} />
            <Route exact component={ResultsPage} path={getPatternResults()} />
            <Route exact component={ChatPage} path={getPatternChatPage()} />
            <Route exact component={SolidGamingCasinoPage} path={getPatternSolidGamingCasino()} />
            <Route exact component={PromotionPage} path={getPatternPromotions()} />

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

            <Route
              exact
              path={getPatternConfirmPasswordReset()}
              render={(routerProps) => (
                <PublicRoute renderAppAuthorized={() => <AccountSecurityEditPage {...routerProps} />} />
              )}
            />

            {/* Private routes */}
            <Route
              exact
              path={getPatternAccountSecurityEdit()}
              render={(routerProps) => (
                <PrivateRoute renderAppAuthorized={() => <AccountSecurityEditPage {...routerProps} />} />
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

            {/* Handler for deep links for sports path */}
            <Route
              exact
              path="/sports/:sportCode/:eventPathId"
              render={(props) => (
                // eslint-disable-next-line react/prop-types
                <Redirect to={`/home/${props.match.params.sportCode}`} />
              )}
            />

            {/* Home */}
            <Route exact component={HomePage} path="/home/:sportCode" />
            <Route exact component={HomePage} path={getPatternHome()} />

            {/* If we are here, send the user to the home page */}
            <Redirect to={getPatternHome()} />
          </Switch>
        </Suspense>
      </PageWrapper>
    </div>
  );
};

export default withFavicon(withTitleBrandName(VanillaMobileApp));
