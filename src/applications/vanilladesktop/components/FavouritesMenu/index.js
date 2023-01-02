import FavouritesMenuItem from "applications/vanilladesktop/components/FavouritesMenu/components/FavouritesMenuItem";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getFavouriteData } from "../../../../redux/reselect/favourite-selector";
import { deleteFavourite, getFavourites } from "../../../../redux/slices/favouriteSlice";

const FavouritesMenu = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const favourites = useSelector(getFavouriteData);

  useEffect(() => {
    if (!favourites) dispatch(getFavourites());
  }, [dispatch, favourites]);

  const onClick = (code, pathId) => {
    if (code.startsWith("p")) {
      const eventPathId = code.substr(1, code.length);
      history.push(`/prematch/eventpath/${eventPathId}`);
    }
    if (code.startsWith("e")) {
      const eventId = code.substr(1, code.length);
      const eventPathId = pathId.substr(1, pathId.length);
      history.push(`/prematch/eventpath/${eventPathId}/event/${eventId}`);
    }
  };

  const deleteFavouriteSport = (id) => {
    dispatch(deleteFavourite({ id }));
  };

  return (
    <div className={classes["left-section__item"]}>
      <h3 className={classes["left-section__title"]}>{t("favourites")}</h3>
      {favourites?.map((data) => (
        <FavouritesMenuItem data={data} key={data.id} onClick={onClick} onDeleteClick={deleteFavouriteSport} />
      ))}
      {!(favourites?.length > 0) && (
        <div className={classes["favourites-empty"]}>
          <span className={classes["favourites-empty-text"]}>
            Click any match <i className={classes["qicon-star-empty"]} /> to add to your favourites
          </span>
        </div>
      )}
    </div>
  );
};

export default React.memo(FavouritesMenu);
