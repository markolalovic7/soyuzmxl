import { lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import PublicRoute from "../../components/PublicRoute/components";
import {
  APPLICATION_TYPE_ASIAN_DESKTOP,
  APPLICATION_TYPE_COMPACT_DESKTOP,
  APPLICATION_TYPE_CONTINENTAL_DESKTOP,
  APPLICATION_TYPE_EUROPEAN_DESKTOP,
} from "../../constants/application-types";
import { useAvailablePromotions } from "../../hooks/bonus-hooks";
import { useGetMatchStatuses } from "../../hooks/matchstatus-hooks";
import { getAuthDesktopView } from "../../redux/reselect/auth-selector";
import { getCmsConfigAppearance } from "../../redux/reselect/cms-selector";
import { getHrefPrematch } from "../../utils/route-href";

import Layout from "./components/Layout";

import PrivateRoute from "components/PrivateRoute/components";
import withFavicon from "hocs/withFavicon";
import withTitleBrandName from "hocs/withTitleBrandName";
import { useSportsTree } from "hooks/sports-tree-hooks";
import {
  getPatternAccountCreate,
  getPatternAccountEdit,
  getPatternAccountSecurityEdit,
  getPatternAsianSports,
  getPatternAsianSportsEventDetail,
  getPatternAsianSportsEventPathDetail,
  getPatternBetCalculator,
  getPatternBetradarVirtual,
  getPatternBetradarVirtualSport,
  getPatternConfirmPasswordReset,
  getPatternContentPage,
  getPatternHeroBanner,
  getPatternJackpots,
  getPatternKiron,
  getPatternKironVirtualSport,
  getPatternLive,
  getPatternLiveCalendar,
  getPatternLiveSportDetail,
  getPatternMyBets,
  getPatternMyStatements,
  getPatternPrematch,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
  getPatternPromotions,
  getPatternRequestPasswordReset,
  getPatternResults,
  getPatternSearchResults,
  getPatternSolidGamingCasino,
  getPatternSports,
} from "utils/route-patterns";
import { useLocation } from "react-router-dom";

const AccountCreatePage = lazy(() => import("./pages/AccountCreatePage"));
const AccountUpdatePage = lazy(() => import("./pages/AccountUpdatePage"));
const AfricanLive = lazy(() => import("./pages/AfricanLive"));
const AfricanSportsPage = lazy(() => import("./pages/AfricanSportsPage"));
const AsianSportsPage = lazy(() => import("./pages/AsianSportsPage"));
const BetCalculatorPage = lazy(() => import("./pages/BetCalculatorPage"));
const BetradarVirtualSportPage = lazy(() => import("./pages/BetradarVirtualSportPage"));
const SolidGamingCasinoPage = lazy(() => import("./pages/SolidGamingCasinoPage/components"));
const ChangePasswordPage = lazy(() => import("./pages/SecurityPage/components"));
const CompactEventDetailsPage = lazy(() => import("./pages/CompactEventDetailsPage"));
const CompactLive = lazy(() => import("./pages/CompactLive"));
const ConfirmPasswordResetPage = lazy(() => import("./pages/ConfirmPasswordResetPage"));
const EuropeanEventsPage = lazy(() => import("./pages/EuropeanEventsPage"));
const EuropeanLive = lazy(() => import("./pages/EuropeanLive"));
const EuropeanSportsPage = lazy(() => import("./pages/EuropeanSportsPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const JackpotPage = lazy(() => import("./pages/JackpotPage"));
const KironVirtualSportPage = lazy(() => import("./pages/KironVirtualSportPage"));
const MyBetsPage = lazy(() => import("./pages/MyBetsPage"));
const MyStatementsPage = lazy(() => import("./pages/MyStatementsPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const ContentPage = lazy(() => import("./pages/ContentPage"));
const EuropeanSearchPage = lazy(() => import("./pages/EuropeanSearchPage"));
const CompactSearchPage = lazy(() => import("./pages/CompactSearchPage"));
const LiveCalendarPage = lazy(() => import("./pages/LiveCalendarPage"));
const RequestPasswordResetPage = lazy(() => import("./pages/RequestPasswordResetPage"));
const PromotionsPage = lazy(() => import("./pages/PromotionsPage"));

const getHomePage = (view, landingPage) => {
  switch (landingPage) {
    case "BANNER_HOMEPAGE":
      return getPatternHeroBanner();
    case "PREMATCH":
      return view === APPLICATION_TYPE_ASIAN_DESKTOP ? getPatternSports() : getPatternPrematch();
    case "LIVE":
      return view === APPLICATION_TYPE_ASIAN_DESKTOP ? getPatternSports() : getPatternLive();
    default:
      return getPatternHeroBanner();
  }
};
const VanillaDesktopApp = () => {
  const location = useLocation();
  const view = useSelector(getAuthDesktopView);

  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();
  useSportsTree({ standard: true }, dispatch);

  // Preload the match statuses to avoid spam later on
  useGetMatchStatuses(dispatch);

  // Load the available promotions for the user (whether logged in or not)
  useAvailablePromotions(dispatch);

  const cmsConfigAppearance = useSelector(getCmsConfigAppearance);

  const {
    data: { desktopLandingPage },
  } = cmsConfigAppearance || { data: {} };

  return (
    <Layout>
      <Suspense fallback={null}>
        <Switch>
          <Route exact path={getPatternHeroBanner()}>
            <HomePage />
          </Route>
          <Route exact path={getPatternPrematchEventDetail()}>
            {view === APPLICATION_TYPE_COMPACT_DESKTOP && <CompactEventDetailsPage />}
            {view === APPLICATION_TYPE_CONTINENTAL_DESKTOP && <AfricanSportsPage />}
            {view === APPLICATION_TYPE_EUROPEAN_DESKTOP && <EuropeanEventsPage />}
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternPrematchMain()}>
            {view === APPLICATION_TYPE_COMPACT_DESKTOP && <CompactEventDetailsPage />}
            {view === APPLICATION_TYPE_CONTINENTAL_DESKTOP && <AfricanSportsPage />}
            {view === APPLICATION_TYPE_EUROPEAN_DESKTOP && <EuropeanSportsPage />}
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternPrematch()}>
            {view === APPLICATION_TYPE_COMPACT_DESKTOP && <CompactEventDetailsPage />}
            {view === APPLICATION_TYPE_CONTINENTAL_DESKTOP && <AfricanSportsPage />}
            {view === APPLICATION_TYPE_EUROPEAN_DESKTOP && <EuropeanSportsPage />}
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternLiveSportDetail()}>
            {view === APPLICATION_TYPE_CONTINENTAL_DESKTOP && <AfricanLive />}
            {view !== APPLICATION_TYPE_CONTINENTAL_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route path={getPatternLive()}>
            {view === APPLICATION_TYPE_COMPACT_DESKTOP && <CompactLive />}
            {view === APPLICATION_TYPE_CONTINENTAL_DESKTOP && <AfricanLive />}
            {view === APPLICATION_TYPE_EUROPEAN_DESKTOP && <EuropeanLive />}
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternSports()}>
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <AsianSportsPage />}
            {view !== APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternAsianSports()}>
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <AsianSportsPage />}
            {view !== APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternAsianSportsEventPathDetail()}>
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <AsianSportsPage />}
            {view !== APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternAsianSportsEventDetail()}>
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <AsianSportsPage />}
            {view !== APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternSearchResults()}>
            {view === APPLICATION_TYPE_EUROPEAN_DESKTOP && <EuropeanSearchPage />}
            {view === APPLICATION_TYPE_COMPACT_DESKTOP && <CompactSearchPage />}
            {view === APPLICATION_TYPE_CONTINENTAL_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
            {view === APPLICATION_TYPE_ASIAN_DESKTOP && <Redirect to={getHomePage(view, desktopLandingPage)} />}
          </Route>
          <Route exact path={getPatternJackpots()}>
            <JackpotPage />
          </Route>
          <Route exact path={getPatternKiron()}>
            <KironVirtualSportPage />
          </Route>
          <Route exact path={getPatternKironVirtualSport()}>
            <KironVirtualSportPage />
          </Route>
          <Route exact path={getPatternBetradarVirtual()}>
            <BetradarVirtualSportPage />
          </Route>
          <Route exact path={getPatternBetradarVirtualSport()}>
            <BetradarVirtualSportPage />
          </Route>
          <Route exact path={getPatternBetCalculator()}>
            <BetCalculatorPage />
          </Route>
          <Route exact path={getPatternSolidGamingCasino()}>
            <SolidGamingCasinoPage />
          </Route>
          <Route exact path={getPatternResults()}>
            <ResultsPage />
          </Route>
          <Route exact path={getPatternContentPage()}>
            <ContentPage />
          </Route>
          <Route exact path={getPatternLiveCalendar()}>
            <LiveCalendarPage />
          </Route>
          <Route exact path={getPatternPromotions()}>
            <PromotionsPage />
          </Route>
          {/* Public Routes */}
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
            path={getPatternAccountEdit()}
            render={(routerProps) => (
              <PrivateRoute renderAppAuthorized={() => <AccountUpdatePage {...routerProps} />} />
            )}
          />
          <Route
            exact
            path={getPatternAccountSecurityEdit()}
            render={(routerProps) => (
              <PrivateRoute renderAppAuthorized={() => <ChangePasswordPage {...routerProps} />} />
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
            render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <MyStatementsPage {...routerProps} />} />}
          />

          {/* Handler for deep links for sports path */}
          <Route
            exact
            path="/sports/:sportCode/:eventPathId"
            render={(props) =>
              view === APPLICATION_TYPE_ASIAN_DESKTOP ? (
                <Redirect
                  // eslint-disable-next-line react/prop-types
                  to={`/sports/${props.match.params.sportCode}/${props.match.params.sportCode}-DEFAULT/TODAY`}
                />
              ) : (
                // eslint-disable-next-line react/prop-types
                <Redirect to={getHrefPrematch(props.match.params.eventPathId)} />
              )
            }
          />

          {/* If we are here, send the user to the home page. This includes /, for which a specific route does not exist */}
          {/* <Redirect exact from="/" to={getHomePage(view, desktopLandingPage)} /> */}
          <Redirect to={getHomePage(view, desktopLandingPage)} />
        </Switch>
      </Suspense>
    </Layout>
  );
};

export default withFavicon(withTitleBrandName(VanillaDesktopApp));
