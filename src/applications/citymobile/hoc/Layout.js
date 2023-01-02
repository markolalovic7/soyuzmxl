import ScrollToTopButton from "components/ScrollToTopButton";
import PropTypes from "prop-types";

import ArrowUpTopButton from "../components/ArrowUpTopButton";
import BetslipPanel from "../components/Navigation/BetslipPanel";
import Header from "../components/Navigation/Header";
import classes from "../scss/citymobile.module.scss";

const Layout = ({ children }) => (
  <div className={classes["wrapper"]}>
    <div className={classes["main"]}>
      <Header />
      {children}
      <ScrollToTopButton ButtonComponent={ArrowUpTopButton} />
      <BetslipPanel />
    </div>
  </div>
);

const propTypes = {
  children: PropTypes.any.isRequired,
};

const defaultProps = {};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default Layout;
