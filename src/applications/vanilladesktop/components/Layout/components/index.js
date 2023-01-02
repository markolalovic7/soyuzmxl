import ScrollToTop from "applications/common/components/ScrollToTop/ScrollToTop";
import Footer from "applications/vanilladesktop/components/Footer/components";
import Header from "applications/vanilladesktop/components/Header";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { getCmsConfigIframeMode } from "../../../../../redux/reselect/cms-selector";
import { matchPath } from "react-router-dom";
import { getPatternJackpots, getPatternMyBets, getPatternMyStatements } from "../../../../../utils/route-patterns";
import { useLocation } from "react-router";
import cx from "classnames";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Layout = ({ children }) => {
  const isApplicationEmbedded = useSelector(getCmsConfigIframeMode);

  const location = useLocation();
  const isJackpot = matchPath(location.pathname, { exact: true, path: getPatternJackpots() });
  const isMyBets = matchPath(location.pathname, { exact: true, path: getPatternMyBets() });
  const isMyStatements = matchPath(location.pathname, { exact: true, path: getPatternMyStatements() });

  return (
    <div
      className={cx(
        classes["vanilladesktop-body"],
        { [classes["jackpot-page"]]: isJackpot },
        { [classes["mybets-page"]]: isMyBets || isMyStatements },
      )}
    >
      <ScrollToTop />
      <div className={classes["wrapper"]}>
        <Header />
        {children}
        {!isApplicationEmbedded && <Footer />}
      </div>
    </div>
  );
};

Layout.propTypes = propTypes;

export default Layout;
