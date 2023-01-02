import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { getFavouriteData } from "../../../../redux/reselect/favourite-selector";
import { addFavourite, deleteFavourite } from "../../../../redux/slices/favouriteSlice";
import classes from "../../scss/vanilladesktop.module.scss";

const propTypes = {
  className: PropTypes.string.isRequired,
  eventId: PropTypes.number.isRequired,
  isDiv: PropTypes.bool.isRequired,
};

const FavouriteMatchButton = ({ className, eventId, isDiv }) => {
  const dispatch = useDispatch();
  const favouriteData = useSelector(getFavouriteData);

  const favourite = favouriteData?.find((favourite) => favourite.code === `e${eventId}`);

  const onClick = () => {
    if (favourite) {
      dispatch(deleteFavourite({ id: favourite.id }));
    }

    dispatch(addFavourite({ eventId }));
  };
  if (isDiv) {
    return (
      <div className={classes[className]} onClick={onClick}>
        <i className={favourite ? classes["qicon-star-full"] : classes["qicon-star-empty"]} />
      </div>
    );
  }

  return (
    <span className={classes[className]} onClick={onClick}>
      <i className={favourite ? classes["qicon-star-full"] : classes["qicon-star-empty"]} />
    </span>
  );
};

FavouriteMatchButton.propTypes = propTypes;
export default FavouriteMatchButton;
