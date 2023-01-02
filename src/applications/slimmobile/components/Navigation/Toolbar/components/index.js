import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { getCachedAssets } from "redux/reselect/assets-selectors";
import { getAuthLoggedIn } from "redux/reselect/auth-selector";
import { getCmsConfigBrandDetails, getCmsConfigBrandLogos } from "redux/reselect/cms-selector";
import { getHrefHome } from "utils/route-href";

import ChatPanel from "../../ChatPanel";
import MyAccountPanel from "../../MyAccountPanel";
import SportsTreePanel from "../../SportsTreePanel";
import { PANEL_ACCOUNT, PANEL_BETSLIP, PANEL_CHAT, PANEL_GAME_CENTER, PANEL_SPORTS_TREE } from "../constants";

const propTypes = {
  renderBody: PropTypes.func.isRequired,
};

const defaultProps = {};

const Toolbar = ({ renderBody }) => {
  const [openedPanel, setOpenedPanel] = useState("");
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;

  const assets = useSelector(getCachedAssets);
  const loggedIn = useSelector(getAuthLoggedIn);
  const { brandLogoAssetId } = useSelector(getCmsConfigBrandLogos);

  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const {
    data: { chat },
  } = cmsConfigBrandDetails || { data: {} };

  useEffect(() => {
    const show = !!openedPanel;
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openedPanel]);

  useEffect(() => {
    setOpenedPanel("");
  }, [pathname]);

  const togglePanel = (panel) => () => {
    if (openedPanel !== panel) {
      setOpenedPanel(panel);
    } else {
      setOpenedPanel("");
    }
  };

  const backdropClickHandler = useCallback((event) => {
    if (event.target === event.currentTarget) {
      setOpenedPanel("");
    }
  }, []);

  const gameCenterNavigationHandler = (url) => () => {
    history.push(url); // navigate to the new route...
  };

  const closePanel = useCallback(() => {
    setOpenedPanel("");
  }, []);

  return (
    <>
      <header className={classes.header}>
        <div className={classes["header__body"]}>
          <div
            className={`${classes.hamburger} ${classes["hamburger--3dx"]} ${
              openedPanel === PANEL_SPORTS_TREE ? classes.active : ""
            }`}
            onClick={togglePanel(PANEL_SPORTS_TREE)}
          >
            <div className={classes["hamburger-box"]}>
              <div className={classes["hamburger-inner"]} />
            </div>
          </div>
          <Link className={classes["header__logo"]} to={getHrefHome()}>
            {assets[brandLogoAssetId] && <img alt="Logo" src={assets[brandLogoAssetId]} />}
          </Link>
          <div className={classes["header__icons"]}>
            {chat && (
              <span
                className={`${classes["header__icon"]} ${openedPanel === PANEL_CHAT ? classes.active : ""}`}
                id="chat"
                onClick={togglePanel(PANEL_CHAT)}
              >
                <FontAwesomeIcon icon={faCommentDots} />
              </span>
            )}
            <span
              className={`${classes["header__icon"]} ${openedPanel === PANEL_ACCOUNT ? classes.active : ""}`}
              onClick={togglePanel(PANEL_ACCOUNT)}
            >
              <i className={classes[loggedIn ? "qicon-account-logged-in" : "qicon-account-login"]} />
            </span>
          </div>
        </div>
      </header>
      <ChatPanel backdropClick={backdropClickHandler} chatDrawerClose={closePanel} open={openedPanel === PANEL_CHAT} />
      <MyAccountPanel
        accountDrawerClose={closePanel}
        backdropClick={backdropClickHandler}
        open={openedPanel === PANEL_ACCOUNT}
      />
      <SportsTreePanel
        backdropClick={backdropClickHandler}
        showSportsTree={openedPanel === PANEL_SPORTS_TREE}
        onCloseSportsTree={closePanel}
      />
      {renderBody({
        accountPanelToggleHandler: togglePanel(PANEL_ACCOUNT),
        backdropClickHandler,
        betslipDrawerCloseHandler: closePanel,
        betslipDrawerToggleHandler: togglePanel(PANEL_BETSLIP),
        // Note: `gameCenterDrawerToggleHandler` is not using later in componets.
        gameCenterDrawerToggleHandler: togglePanel(PANEL_GAME_CENTER),
        showBetslip: openedPanel === PANEL_BETSLIP,
        showGameCenter: openedPanel === PANEL_GAME_CENTER,
        showMyAccount: openedPanel === PANEL_ACCOUNT,
      })}
    </>
  );
};

Toolbar.propTypes = propTypes;
Toolbar.defaultProps = defaultProps;

export default Toolbar;
