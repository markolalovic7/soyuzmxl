import ScrollToTop from "applications/common/components/ScrollToTop/ScrollToTop";
import Header from "applications/ollehdesktop/components/Header";
import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import PropTypes from "prop-types";

const propTypes = {
  children: PropTypes.node.isRequired,
};

const Layout = ({ children }) => (
  <div className={classes["ollehdesktop-body"]}>
    <ScrollToTop />
    <div className={classes["wrapper"]}>
      <Header />
      {children}
    </div>
  </div>
);

Layout.propTypes = propTypes;

export default Layout;
