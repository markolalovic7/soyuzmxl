import cx from "classnames";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getFavouriteData } from "../../../../redux/reselect/favourite-selector";
import { deleteFavourite, getFavourites } from "../../../../redux/slices/favouriteSlice";
import classes from "../../scss/vanilladesktop.module.scss";
import FavouritesMenuItem from "../FavouritesMenu/components/FavouritesMenuItem";

const AsianMenuFavourites = ({ active }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const favourites = useSelector(getFavouriteData);

  useEffect(
    () => {
      if (!favourites) dispatch(getFavourites());
    },
    [dispatch],
    favourites,
  );

  // TODO an obvious improvement is to send to EARLIER if there is no data for TODAY (using the regular sportsTreeData)
  // TODO This would also require that we only enable the relevant date tabs in the AsianCoupon
  const onClick = (code, pathId, sportCode) => {
    if (code.startsWith("p")) {
      const eventPathId = code.substr(1, code.length);
      history.push(`/sports/${sportCode}/${sportCode}-DEFAULT/TODAY/${eventPathId}`);
    }
    if (code.startsWith("e")) {
      const eventId = code.substr(1, code.length);
      const eventPathId = pathId.substr(1, pathId.length);
      history.push(`/sports/${sportCode}/${sportCode}-DEFAULT/TODAY/${eventPathId}/${eventId}`);
    }
  };

  const deleteFavouriteSport = (id) => {
    dispatch(deleteFavourite({ id }));
  };

  return (
    <div
      className={cx(classes["asian-menu__favourites"], {
        [classes["active"]]: active,
      })}
    >
      <div className={classes["left-section__cards"]}>
        {favourites?.map((data) => (
          <FavouritesMenuItem data={data} key={data.id} onClick={onClick} onDeleteClick={deleteFavouriteSport} />
        ))}
      </div>
    </div>
  );
};

export default AsianMenuFavourites;
