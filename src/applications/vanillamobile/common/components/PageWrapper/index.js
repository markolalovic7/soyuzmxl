import { PropTypes } from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

import { APPLICATION_TYPE_MOBILE_VANILLA } from "../../../../../constants/application-types";
import PanelBetslip from "../PanelBetslip";
import PanelMyAccount from "../PanelMyAccount";
import PanelSportsTree from "../PanelSportsTree";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { useOnClickOutside } from "hooks/utils-hooks";
import { getCachedAssets } from "redux/reselect/assets-selectors";
import { getAuthLoggedIn, getAuthMobileView } from "redux/reselect/auth-selector";
import { getCmsConfigBrandLogos } from "redux/reselect/cms-selector";
import { getHrefHome, getHrefSearch } from "utils/route-href";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const defaultProps = {};

const PageWrapper = ({ children }) => {
  const [showMyAccount, setShowMyAccount] = useState(false);
  const [showSportsTree, setShowSportsTree] = useState(false);
  const location = useLocation();
  const { brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);
  const assets = useSelector(getCachedAssets);
  const { pathname } = location;
  const loggedIn = useSelector(getAuthLoggedIn);

  const view = useSelector(getAuthMobileView);

  useEffect(() => {
    // when a panel is open, avoid having background scroll on...
    const panelOpen = showSportsTree || showMyAccount;
    if (panelOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showSportsTree, showMyAccount]);

  const onOpenSportsTreeHandler = () => {
    setShowSportsTree(true);
  };

  const onCloseSportsTreeHandler = useCallback(() => {
    setShowSportsTree(false);
  }, []);

  const onOpenMyAccountHandler = () => {
    setShowMyAccount(true);
  };

  const onCloseMyAccountHandler = useCallback(() => {
    setShowMyAccount(false);
  }, []);

  const refSportPanel = useRef();
  const refAccountPanel = useRef();

  useOnClickOutside(refSportPanel, () => setShowSportsTree(false));
  useOnClickOutside(refAccountPanel, () => setShowMyAccount(false));

  return (
    <div className={classes.wrapper}>
      <header className={classes["header"]}>
        <div className={classes["header__body"]}>
          <div
            className={`${classes["hamburger"]} ${classes["hamburger--3dx"]} ${
              showSportsTree ? classes["active"] : ""
            }`}
            onClick={onOpenSportsTreeHandler}
          >
            <div className={classes["hamburger-box"]}>
              <div className={classes["hamburger-inner"]} />
            </div>
          </div>
          <Link className={classes["header__logo"]} to={getHrefHome()}>
            {assets[brandLogoAssetId] && <img alt="Logo" src={assets[brandLogoAssetId]} />}
          </Link>
          <div className={classes["header__icons"]}>
            {view === APPLICATION_TYPE_MOBILE_VANILLA && (
              <Link
                className={`${classes["header__icon"]} ${
                  pathname === getHrefSearch() ? classes["header__icon_active"] : ""
                } ${classes["header__icon_search"]}`}
                to={getHrefSearch()}
              >
                <span className={classes["qicon-search"]} />
              </Link>
            )}
            <div className={classes["header__icon"]} id="login-activator" onClick={onOpenMyAccountHandler}>
              <span className={classes[loggedIn ? "qicon-account-logged-in" : "qicon-account-login"]} />
            </div>
          </div>
        </div>
      </header>
      <PanelSportsTree ref={refSportPanel} showSportsTree={showSportsTree} onPanelClose={onCloseSportsTreeHandler} />
      <PanelMyAccount ref={refAccountPanel} showMyAccount={showMyAccount} onPanelClose={onCloseMyAccountHandler} />
      <main className={classes["main-wrapper"]}>{children}</main>
      {/* TODO - find where the class="up" is... */}
      <PanelBetslip setShowMyAccount={setShowMyAccount} />
    </div>
  );
};

PageWrapper.propTypes = propTypes;
PageWrapper.defaultProps = defaultProps;

export default PageWrapper;
