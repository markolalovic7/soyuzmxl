import cx from "classnames";
import PropTypes from "prop-types";

import classes from "../../scss/ezbet.module.scss";
import { getIconSuffix } from "../../utils/icon-utils";

const SportIcon = ({ code }) => {
  switch (code) {
    case "ALL":
      return <i aria-hidden="true" className={cx(classes["icon"], classes["icon-big-leagues"])} />;

    case "FOOT":
      return (
        <i className={cx(classes["icon"], classes[`icon-${getIconSuffix(code)}`])}>
          <span className={cx(classes[`icon-${getIconSuffix(code)}`])}>
            <span className={classes["path1"]} />
            <span className={classes["path2"]} />
            <span className={classes["path3"]} />
            <span className={classes["path4"]} />
            <span className={classes["path5"]} />
            <span className={classes["path6"]} />
            <span className={classes["path7"]} />
            <span className={classes["path8"]} />
            <span className={classes["path9"]} />
          </span>
        </i>
      );
    case "COUN":
    case "LEAG":
    case "STAR":
    case "DOTA":
    case "CALL":
    case "OVER":
    case "HEAR":
    case "RAIN":
    case "ROCK":
    case "KING":
    case "NB2K":
      return (
        <i className={cx(classes["icon"], classes["ez-icon-coun"], classes["e-sport"])}>
          <span className={classes["icon-e-sports"]}>
            <span className={classes["path1"]} />
            <span className={classes["path2"]} />
            <span className={classes["path3"]} />
          </span>
        </i>
      );

    case "ARCH":
    case "BADM":
    case "BASE":
    case "BASK":
    case "BOXI":
    case "DART":
    case "AMFB":
    case "GOLF":
    case "HAND":
    case "ICEH":
    case "MOSP":
    case "FORM":
    case "RUGB":
    case "VOLL":
    case "TABL":
      return <i aria-hidden="true" className={cx(classes["icon"], classes[`icon-${getIconSuffix(code)}`])} />;

    case "SPEC":
    case "MMA":
      return <i aria-hidden="true" className={cx(classes["icon"], classes[`icon-${getIconSuffix(code)}`])} />;
    case "STOCK":
    case "BOWL":
    case "WATE":
    case "RUGU":
    case "SKII":
    case "SNOO":
    case "TENN":
    case "CRIC":
    case "CYCL":
    case "FLOO":
    case "BEVO":
    case "AURL":
    case "FUTS":
    case "SQUA":
    case "BAND":
    case "BEAC":
    case "FIEL":
      return <i className={cx(classes["qicon-default"], classes[`qicon-${code.toLowerCase()}`])} />;

    default:
      return <i aria-hidden="true" className={cx(classes["icon"], classes["icon-big-leagues"])} />;
  }
};

SportIcon.propTypes = { code: PropTypes.string.isRequired };
export default SportIcon;
