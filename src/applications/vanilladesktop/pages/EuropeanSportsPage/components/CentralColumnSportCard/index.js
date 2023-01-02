import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthLanguage, getAuthLoggedIn } from "../../../../../../redux/reselect/auth-selector";
import { getCmsConfigSportsBook } from "../../../../../../redux/reselect/cms-selector";
import { getFavouriteData } from "../../../../../../redux/reselect/favourite-selector";
import { addFavourite, deleteFavourite } from "../../../../../../redux/slices/favouriteSlice";
import { openLinkInNewWindow } from "../../../../../../utils/misc";
import FavouriteMatchButton from "../../../../components/FavouriteMatchButton";

import CardCoefficient from "./components/CardCoefficient";

const CentralColumnSportCard = ({ eventPathId, heading, rows }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isSmsInfoEnabled = useSelector(getCmsConfigSportsBook)?.data?.smsInfoOn;

  const isLoggedIn = useSelector(getAuthLoggedIn);
  const language = useSelector(getAuthLanguage);
  const favouriteData = useSelector(getFavouriteData);
  const favourite = favouriteData?.find((favourite) => favourite.code === `p${eventPathId}`);

  const cmsConfigSportsBook = useSelector(getCmsConfigSportsBook)?.data || {};
  const { betradarStatsOn, betradarStatsURL } = cmsConfigSportsBook;

  const onToggleFavourite = () => {
    if (favourite) {
      dispatch(deleteFavourite({ id: favourite.id }));
    }

    dispatch(addFavourite({ eventPathId }));
  };

  return (
    <div className={classes["sport"]}>
      <div className={classes["sport__container"]}>
        <h4 className={classes["sport__label"]}>
          {isLoggedIn && (
            <i
              className={favourite ? classes["qicon-star-full"] : classes["qicon-star-empty"]}
              onClick={onToggleFavourite}
            />
          )}
          <span>{heading}</span>
        </h4>
        <div className={classes["sport__body"]}>
          {rows.map(
            (match) =>
              match.children &&
              Object.values(match.children).map((market) => (
                <div className={classes["sport__row"]} key={match.id}>
                  <div className={cx(classes["sport__item"], classes["card"])}>
                    <div className={classes["card__top"]}>
                      <div className={cx(classes["card__title"], classes["card__title_left"])}>{match.desc}</div>
                      <div className={cx(classes["card__title"], classes["card__title_right"])}>
                        {`${market.desc} - ${market.period}`}
                      </div>
                    </div>
                    <div
                      className={classes["card__body"]}
                      style={{
                        gridTemplateColumns:
                          market.children && Object.values(market.children).length === 3 ? "1fr 1fr 1fr" : "1fr 1fr",
                      }}
                    >
                      {market.children &&
                        Object.values(market.children).map((outcome, index) => (
                          <CardCoefficient
                            eventId={match.id}
                            hidden={outcome.hidden}
                            isFirstInRow={!index}
                            isLastInRow={index === Object.values(market.children).length - 1}
                            key={index}
                            label={outcome.desc}
                            outcomeId={outcome.id}
                            priceId={outcome.priceId}
                            value={outcome.price}
                            withGreenLabel={outcome.dir === "u"}
                            withRedLabel={outcome.dir === "d"}
                          />
                        ))}
                    </div>
                  </div>
                  <div className={cx(classes["sport__item"], classes["card"], classes["card_icons"])}>
                    <div className={classes["card__top"]}>
                      <div className={cx(classes["card__title"], classes["card__title_right"])}>
                        {dayjs.unix(match.epoch / 1000).format("D MMM hh:mm A")}
                        {isSmsInfoEnabled && <FontAwesomeIcon icon={faQuestionCircle} />}
                      </div>
                    </div>
                    <div className={classes["card__row"]}>
                      <div className={classes["card__icons"]}>
                        {isLoggedIn && <FavouriteMatchButton isDiv className="main-icon" eventId={match.id} />}

                        {betradarStatsOn && betradarStatsURL && match.brMatchId && (
                          <div
                            className={classes["main-icon"]}
                            onClick={() =>
                              openLinkInNewWindow(`${betradarStatsURL}/${language}/match/${match.brMatchId}`)
                            }
                          >
                            <i className={classes["qicon-stats"]} />
                          </div>
                        )}
                        <div
                          className={classes["main-icon"]}
                          onClick={() => history.push(`/prematch/eventpath/${eventPathId}/event/${match.id}`)}
                        >
                          {`+${match.count > 1 ? match.count - 1 : 0}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )),
          )}
        </div>
      </div>
    </div>
  );
};

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  heading: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

CentralColumnSportCard.propTypes = propTypes;

export default React.memo(CentralColumnSportCard);
