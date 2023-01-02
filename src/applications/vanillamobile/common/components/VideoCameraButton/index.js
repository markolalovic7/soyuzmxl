import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";

const propTypes = {};

const defaultProps = {};

const VideoCameraButton = () => (
  <div className={`${classes["bet__icon"]} ${classes["icon-vs-popup"]}`}>
    <i className={classes["qicon-video-camera"]} />
  </div>
);

VideoCameraButton.propTypes = propTypes;
VideoCameraButton.defaultProps = defaultProps;

export default VideoCameraButton;
