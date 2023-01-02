import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

const CentralColumnHeading = ({ description }) => (
  <h3 className={classes["main-title"]}>
    <p className={classes["main-title__text"]}>{description}</p>
    <div className={classes["main-title__icons"]}>
      {/* <div className={classes["main-title__icon"]}> */}
      {/*  <svg height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"> */}
      {/*    <g> */}
      {/*      <g> */}
      {/*        <path d="M13.65 2.35A7.958 7.958 0 0 0 8 0a8 8 0 1 0 0 16c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0z" /> */}
      {/*      </g> */}
      {/*    </g> */}
      {/*  </svg> */}
      {/*  <span className={classes["main-title__update"]}>Update</span> */}
      {/* < /div> */}
      <div className={classes["main-title__icon"]}>
        <i className={classes["qicon-sms-bet"]} />
      </div>
    </div>
  </h3>
);
const propTypes = {
  description: PropTypes.string.isRequired,
};

const defaultProps = {};

CentralColumnHeading.propTypes = propTypes;
CentralColumnHeading.defaultProps = defaultProps;

export default CentralColumnHeading;
