import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";

const propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};
const FavouritesMenuItem = ({
  data: { code, description, eventType, id, pathId, sportCode },
  onClick,
  onDeleteClick,
}) => (
  // "code" : "e11284331",
  //     "description" : "Persela Lamongan vs Persebaya Surabaya",
  //     "sportCode" : "sFOOT",
  //     "eventType" : "GAME",
  //     "pathId" : "p6047"

  <div className={classes["left-section__card"]}>
    <span className={classes["left-section__icon"]}>
      <i className={classes["qicon-star-full"]} />
    </span>
    <span
      className={classes["left-section__text"]}
      onClick={() => onClick(code, pathId, sportCode.substr(1, sportCode.length))}
    >
      {description}
    </span>
    <span className={classes["left-section__remove"]} onClick={() => onDeleteClick(id)}>
      <i className={classes["qicon-times-circle"]} />
    </span>
  </div>
);
FavouritesMenuItem.propTypes = propTypes;

export default FavouritesMenuItem;
