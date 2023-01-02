import isEmpty from "lodash.isempty";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router";

import PrivateRoute from "../../components/PrivateRoute/components";
import PublicRoute from "../../components/PublicRoute/components";
import withFavicon from "../../hocs/withFavicon";
import withTitleBrandName from "../../hocs/withTitleBrandName";
import { useRetailUUID } from "../../hooks/auth-hooks";
import { useRetailAlive } from "../../hooks/retail-hooks";
import { useSportsTree } from "../../hooks/sports-tree-hooks";
import { getAuthLoggedIn, getAuthTill } from "../../redux/reselect/auth-selector";
import {
  getRetailSelectedPlayerAccountData,
  getRetailSelectedPlayerAccountId,
} from "../../redux/reselect/retail-selector";
import { getRetailAccountBalance, loadRetailPlayerAccountData } from "../../redux/slices/retailAccountSlice";
import { loadCurrentShift, loadTillBalance, loadTillDetails } from "../../redux/slices/retailTillSlice";
import {
  getPatternLiveEventDetail,
  getPatternLiveSportDetail,
  getPatternPrematch,
  getPatternPrematchEventDetail,
  getPatternPrematchMain,
} from "../../utils/route-patterns";

import LiveCentralSection from "./components/LiveCentralSection";
import PrematchCentralSection from "./components/PrematchCentralSection";
import AccountCreatePage from "./pages/AccountCreatePage";
import AccountSearchPage from "./pages/AccountSearchPage";
import AccountUpdatePage from "./pages/AccountUpdatePage";
import AccountViewPage from "./pages/AccountViewPage";
import AssignNFCPage from "./pages/AssignNFCPage";
import AssignPhotoPage from "./pages/AssignPhotoPage";
import BetslipPage from "./pages/BetslipPage";
import CashReconciliationPage from "./pages/CashReconciliationPage";
import LoadTicketPage from "./pages/LoadTicketPage";
import LoginPage from "./pages/LoginPage";
import PlayerTransactionsPage from "./pages/PlayerTransactionsPage";
import ReportsPage from "./pages/ReportsPage";
import SportNavigationLayout from "./pages/SportNavigationLayout";
import TillTransactionsPage from "./pages/TillTransactionsPage";

const SlipstreamApp = () => {
  // Load the sports tree data as soon as the app does, else it blocks other navigation sections
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  useSportsTree({ standard: true }, dispatch);

  useRetailUUID(dispatch);

  useRetailAlive(dispatch);

  const isLoggedIn = useSelector(getAuthLoggedIn);
  const tillAuth = useSelector(getAuthTill);
  const selectedPlayerId = useSelector(getRetailSelectedPlayerAccountId);
  const selectedPlayerAccountData = useSelector(getRetailSelectedPlayerAccountData);

  const currentShift = useSelector((state) => state.retailTill.currentShift);
  const mustStartShift = useSelector((state) => state.retailTill.mustStartShift);

  // load the till details
  useEffect(() => {
    if (isLoggedIn && tillAuth) {
      dispatch(loadTillDetails());
    }
  }, [dispatch, isLoggedIn, tillAuth]);

  useEffect(() => {
    if (isLoggedIn && tillAuth) {
      dispatch(loadTillBalance());
      const id = setInterval(() => dispatch(loadTillBalance()), 5000);

      return () => clearInterval(id);
    }

    return undefined;
  }, [dispatch, isLoggedIn, tillAuth]);

  useEffect(() => {
    if (selectedPlayerId && !isEmpty(tillAuth) && isEmpty(selectedPlayerAccountData)) {
      dispatch(loadRetailPlayerAccountData({ accountId: selectedPlayerId }));
    }
  }, [selectedPlayerId, tillAuth]);

  useEffect(() => {
    if (isLoggedIn && selectedPlayerId && tillAuth) {
      dispatch(getRetailAccountBalance({ accountId: selectedPlayerId }));
      const id = setInterval(() => dispatch(getRetailAccountBalance({ accountId: selectedPlayerId })), 3000);

      return () => clearInterval(id);
    }

    return undefined;
  }, [dispatch, isLoggedIn, selectedPlayerId, tillAuth]);

  useEffect(() => {
    if (isLoggedIn && tillAuth) {
      dispatch(loadCurrentShift());
    }
  }, [isLoggedIn, tillAuth]);

  useEffect(() => {
    if (isLoggedIn && tillAuth && mustStartShift) {
      if (!location.pathname.includes("cashreconciliation")) {
        history.push("/cashreconciliation");
      }
    }
  }, [isLoggedIn, mustStartShift, tillAuth]);

  useEffect(() => {
    if (isLoggedIn && tillAuth && !mustStartShift) {
      if (location.pathname.includes("cashreconciliation")) {
        history.push("/");
      }
    }
  }, [isLoggedIn, mustStartShift, tillAuth]);

  return (
    <Suspense fallback={null}>
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
          path={getPatternPrematchEventDetail()}
          render={(routerProps) => (
            <PrivateRoute
              renderAppAuthorized={() => (
                <SportNavigationLayout {...routerProps}>
                  <PrematchCentralSection {...routerProps} />
                </SportNavigationLayout>
              )}
            />
          )}
        />
        <Route
          exact
          path={getPatternPrematchMain()}
          render={(routerProps) => (
            <PrivateRoute
              renderAppAuthorized={() => (
                <SportNavigationLayout {...routerProps}>
                  <PrematchCentralSection {...routerProps} />
                </SportNavigationLayout>
              )}
            />
          )}
        />
        <Route
          exact
          path={getPatternPrematch()}
          render={(routerProps) => (
            <PrivateRoute
              renderAppAuthorized={() => (
                <SportNavigationLayout {...routerProps}>
                  <PrematchCentralSection {...routerProps} />
                </SportNavigationLayout>
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
                <SportNavigationLayout {...routerProps}>
                  <LiveCentralSection {...routerProps} />
                </SportNavigationLayout>
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
                <SportNavigationLayout {...routerProps}>
                  <LiveCentralSection {...routerProps} />
                </SportNavigationLayout>
              )}
            />
          )}
        />

        <Route
          exact
          path="/accountsearch"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <AccountSearchPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/accountview/:accountId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <AccountViewPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/accountcreate"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <AccountCreatePage {...routerProps} />} />}
        />

        <Route
          exact
          path="/accountupdate"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <AccountUpdatePage {...routerProps} />} />}
        />

        <Route
          exact
          path="/nfcassign/:accountId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <AssignNFCPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/photoassign/:accountId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <AssignPhotoPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/cashreconciliation"
          render={(routerProps) => (
            <PrivateRoute renderAppAuthorized={() => <CashReconciliationPage {...routerProps} />} />
          )}
        />

        <Route
          exact
          path="/tilltransactions"
          render={(routerProps) => (
            <PrivateRoute renderAppAuthorized={() => <TillTransactionsPage {...routerProps} />} />
          )}
        />

        <Route
          exact
          path="/playertransactions"
          render={(routerProps) => (
            <PrivateRoute renderAppAuthorized={() => <PlayerTransactionsPage {...routerProps} />} />
          )}
        />

        <Route
          exact
          path="/loadticket"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <LoadTicketPage {...routerProps} />} />}
        />
        <Route
          exact
          path="/loadticket/:ticketId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <LoadTicketPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/reports"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <ReportsPage {...routerProps} />} />}
        />

        <Route
          exact
          path="/betslip/:betTypeId"
          render={(routerProps) => <PrivateRoute renderAppAuthorized={() => <BetslipPage {...routerProps} />} />}
        />

        <Redirect to={isLoggedIn ? (mustStartShift ? "/cashreconciliation" : getPatternPrematch()) : "/login"} />
      </Switch>
    </Suspense>
  );
};

export default withFavicon(withTitleBrandName(SlipstreamApp));
