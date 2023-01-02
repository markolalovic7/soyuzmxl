import classes from "applications/slipstream/scss/slipstream.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";

import BetslipPanel from "../../../components/BetslipPanel";
import Footer from "../../../components/Footer/components";
import LeftNavigationTree from "../../../components/LeftNavigationTree/components";
import ToolboxHeader from "../../../components/ToolboxHeader";
import withBarcodeReader from "../../../hocs/withBarcodeReader";
import withNfcRedirection from "../../../hocs/withNfcRedirection";

const SportNavigationLayout = ({ children }) => (
  <div className={classes["slipstream-body"]}>
    <div className={classes["wrapper"]}>
      <ToolboxHeader />

      <div className={cx(classes["main"], classes["main_special"])}>
        <div className={classes["main__container"]}>
          <div className={classes["main__grid"]}>
            <LeftNavigationTree />

            {children}

            <BetslipPanel />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
);

SportNavigationLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default withNfcRedirection(withBarcodeReader(SportNavigationLayout));
