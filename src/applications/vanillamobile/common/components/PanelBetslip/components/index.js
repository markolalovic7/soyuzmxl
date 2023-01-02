import { faListUl } from "@fortawesome/free-solid-svg-icons";
import getSymbolFromCurrency from "currency-symbol-map";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import useScrollLock from "use-scroll-lock";

import Betslip from "./Betslip/Betslip";
import JackpotBetslip from "./JackpotBetslip/JackpotBetslip";
import MyBets from "./MyBets/MyBets";

import FontIcon from "applications/vanillamobile/common/components/FontIcon";
import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getAuthCurrencyCode, getAuthIsIframe, getAuthLoggedIn } from "redux/reselect/auth-selector";
import { getBalance } from "redux/reselect/balance-selector";
import { makeGetBetslipOutcomes, makeGetJackpotBetslipOutcomesByJackpotId } from "redux/reselect/betslip-selector";
import { getCmsLayoutMobileVanillaBetslipWidget } from "redux/reselect/cms-layout-widgets";

const propTypes = {
  setShowMyAccount: PropTypes.func.isRequired,
};

const defaultProps = {};

const PanelBetslip = ({ setShowMyAccount }) => {
  const { t } = useTranslation();
  const isIframe = useSelector(getAuthIsIframe);

  const [showBetslipDrawer, setShowBetslipDrawer] = useState(false);
  const [showBetslipTab, setShowBetslipTab] = useState(true);
  const [showMyBetsTab, setShowMyBetsTab] = useState(false);

  const location = useLocation();
  const { pathname } = location;

  const betslipWidget = useSelector((state) => getCmsLayoutMobileVanillaBetslipWidget(state, location));

  const getBetslipOutcomes = useMemo(makeGetBetslipOutcomes, []);
  const betslipOutcomes = useSelector((state) => getBetslipOutcomes(state, location.pathname));

  useEffect(() => {
    setShowBetslipDrawer(false);
  }, [pathname]);

  // Balance related info
  const loggedIn = useSelector(getAuthLoggedIn);
  const currencyCode = useSelector(getAuthCurrencyCode);
  const balance = useSelector(getBalance);

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);

  const onShowBetslipTabHandler = () => {
    setShowBetslipDrawer(true);
    setShowBetslipTab(true);
    setShowMyBetsTab(false);
  };
  const onShowMyBetsTabHandler = () => {
    setShowBetslipDrawer(true);
    setShowMyBetsTab(true);
    setShowBetslipTab(false);
  };

  const [activeMyBet, setActiveMyBet] = useState(null);
  const onMyBetsExpandHandler = (id) => {
    if (activeMyBet === id) {
      setActiveMyBet(null);
    } else {
      setActiveMyBet(id);
    }
  };

  const jackpotId = pathname.match(/\/jackpots\/(\d+)/) ? pathname.match(/\/jackpots\/(\d+)/)[1] : null;
  const jackpotPage = pathname.startsWith("/jackpots") && jackpotId;
  const getJackpotBetslipOutcomesByJackpotId = useMemo(makeGetJackpotBetslipOutcomesByJackpotId, []);
  const jackpotBetslipOutcomes = useSelector((state) => getJackpotBetslipOutcomesByJackpotId(state, jackpotId));

  // Never do this when in iframe mode. It is not required when in iframe mode (as we supress scrolls and delegate scrolling on the parent frame),
  // plus it causes unpredictable side effects (scrolls stop working or freeze)
  // TODO - for vanilla - unclear if we should make this cms settings driven (additional CMS setting on top of iframe mode on/off). If operator was to embed with a restricted height (and supress their own scroll, we would expect our scroll to take over and locks to be required)
  // TODO (cont...) - possible optimization is (!(isIframe && xxx.scrollHeight > xxx.clientHeight), where scrollHeight and clientHeight can be propagated from the useWindowSize() hook?. This would remove any need for further CMS flags (and avoid human interaction to handle this)
  useScrollLock(!isIframe && showBetslipDrawer); // lock / unlock the scroll. Use the data-scroll-lock-scrollable attribute on whatever element you want to enable scrolling

  return (
    <footer className={`${classes.footer} ${showBetslipDrawer ? classes["open"] : ""} `}>
      <div className={classes["footer__body"]}>
        <div className={classes["footer__links"]}>
          <div
            className={`${classes["footer__betslip"]} ${showBetslipTab ? classes["active"] : ""}`}
            data-content={jackpotPage ? jackpotBetslipOutcomes.length : betslipOutcomes.length}
            onClick={onShowBetslipTabHandler}
          >
            <span className={classes["footer__betslip-icon"]}>
              <i className={classes["qicon-money"]} />
            </span>
            <span className={classes["footer__betslip-text"]}>{t("betslip")}</span>
          </div>
          {loggedIn && betslipWidget?.data?.myBets && (
            <div
              className={`${classes["footer__mybets"]} ${showMyBetsTab ? classes["active"] : ""}`}
              data-content={activeBetCount}
              onClick={onShowMyBetsTabHandler}
            >
              <span className={classes["footer__mybets-icon"]}>
                <FontIcon icon={faListUl} />
              </span>
              <div className={classes["footer__mybets-text"]}>{t("my_bets")}</div>
            </div>
          )}
        </div>
        <div className={classes["footer__container"]}>
          <div className={classes["footer__bottom"]}>
            {loggedIn && balance && (
              <div className={classes["footer__money"]}>
                {`${getSymbolFromCurrency(currencyCode)} ${balance.availableBalance.toLocaleString()}`}
              </div>
            )}
            <span
              className={`${classes["footer__arrow"]} ${showBetslipDrawer ? classes["activated"] : ""}`}
              id="footer-arrow"
              onClick={() => setShowBetslipDrawer(true)}
            >
              <span />
            </span>
            <span
              className={`${classes["footer__arrow-2"]} ${showBetslipDrawer ? classes["activated"] : ""}`}
              id="footer-arrow-2"
              onClick={() => setShowBetslipDrawer(false)}
            >
              <span />
            </span>
          </div>
        </div>
      </div>
      <div className={`${classes["footer__content"]} ${showBetslipDrawer ? classes["open"] : ""}`}>
        {jackpotPage ? (
          <JackpotBetslip jackpotId={jackpotId} setShowMyAccount={setShowMyAccount} showBetslipTab={showBetslipTab} />
        ) : (
          <Betslip setShowMyAccount={setShowMyAccount} showBetslipTab={showBetslipTab} />
        )}
        {/* TODO: move `activeMyBet` and `onMyBetsExpandHandler` to the component */}
        <MyBets activeMyBet={activeMyBet} showMyBetsTab={showMyBetsTab} onExpandBet={onMyBetsExpandHandler} />
      </div>
    </footer>
  );
};

PanelBetslip.propTypes = propTypes;
PanelBetslip.defaultProps = defaultProps;

export default PanelBetslip;
