import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getEvents } from "../../../../../../../utils/prematch-data-utils";
import { useAsianCouponData } from "../../../../../../common/hooks/useAsianCouponData";
import {
  AFRICAN_MARKET_OUTCOME_MAPPING,
  AFRICAN_SPORT_MARKET_MAPPING,
} from "../../../../../../../utils/african-market/africanViewSportMarkets";
import { recursiveSportCodeItemSearch } from "../../../../../utils/pathUtils";
import LeagueHeading from "../../LeagueHeading";

import AfricanOutright from "./AfricanOutright";
import SportsTableRow from "./SportsTableRow";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const sortEventPaths = (a, b) => `${a.desc}`.localeCompare(b.desc);

const sortEvents = (a, b) => `${a.startSecs}`.localeCompare(b.startSecs);

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  excludedTournaments: PropTypes.array.isRequired,
  fromDate: PropTypes.string,
  isOutright: PropTypes.bool.isRequired,
  setExcludedTournaments: PropTypes.func.isRequired,
  toDate: PropTypes.string,
};

const defaultProps = {
  fromDate: undefined,
  toDate: undefined,
};

const ContinentalSportsTable = ({
  eventPathId,
  excludedTournaments,
  fromDate,
  isOutright,
  setExcludedTournaments,
  toDate,
}) => {
  const { eventId: eventIdStr } = useParams();

  const eventId = eventIdStr ? parseInt(eventIdStr, 10) : undefined;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const code = `p${eventPathId}`;
  const type = isOutright ? "OUTRIGHT" : "AFRICAN";
  const sportCode = useSelector((state) =>
    recursiveSportCodeItemSearch(state.sportsTree.sportsTreeData?.ept, eventPathId, null),
  );
  const pathCouponData = useSelector((state) => state.coupon.asianCouponData[`${code}/${`${sportCode}-${type}`}`]);
  const pathLoading = useSelector((state) => state.coupon.asianCouponLoading[`${code}/${type}`]);

  const mappingType = isOutright ? "OUTRIGHT" : sportCode;

  useAsianCouponData(dispatch, code, sportCode, fromDate, toDate, `${sportCode}-${type}`);

  if (!pathCouponData || !sportCode || pathLoading)
    return (
      <div className={classes["spinner-container"]}>
        <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
      </div>
    );

  return (
    <div className={classes["central-section__content"]}>
      <LeagueHeading
        eventPathId={eventPathId}
        excludedTournaments={excludedTournaments}
        searchCode={`${code}/${`${sportCode}-${type}`}`}
        setExcludedTournaments={setExcludedTournaments}
      />

      {!isOutright ? (
        <div className={classes["african-sports-table"]}>
          <table>
            <thead>
              <tr className={classes["african-sports-table__labels"]}>
                <th rowSpan="2">{t(`live_calendar_head_labels.event`)}</th>

                {(AFRICAN_SPORT_MARKET_MAPPING[mappingType]
                  ? AFRICAN_SPORT_MARKET_MAPPING[mappingType]
                  : AFRICAN_SPORT_MARKET_MAPPING["DEFAULT"]
                ).map((marketType) => (
                  <th colSpan={AFRICAN_MARKET_OUTCOME_MAPPING[marketType].length} key={marketType}>
                    {t(`vanilladesktop.marketType.${marketType}`)}
                  </th>
                ))}
                <th rowSpan="2">{t("more")}</th>
              </tr>
              <tr className={classes["african-sports-table__sublabels"]}>
                {(AFRICAN_SPORT_MARKET_MAPPING[mappingType]
                  ? AFRICAN_SPORT_MARKET_MAPPING[mappingType]
                  : AFRICAN_SPORT_MARKET_MAPPING["DEFAULT"]
                ).map((marketType, index) =>
                  AFRICAN_MARKET_OUTCOME_MAPPING[marketType].map((outcomeType, index2) => (
                    <th key={`${index}-${index2}`}>{t(`vanilladesktop.outcomeType.${outcomeType}`)}</th>
                  )),
                )}
              </tr>
            </thead>
            <tbody>
              {Object.values(pathCouponData).map((sport) => {
                if (sport.children) {
                  const categories = Object.values(sport.children).slice().sort(sortEventPaths);

                  return categories.map((category) => {
                    const categoryDescription = category.desc;
                    if (category.children) {
                      const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

                      return tournaments.map((tournament) => {
                        if (excludedTournaments.includes(tournament.id)) {
                          return null;
                        }

                        const pathDescription = `${categoryDescription} : ${tournament.desc}`;
                        const events = getEvents(Object.values(tournament.children)).slice().sort(sortEvents);

                        return (
                          <React.Fragment key={tournament.id}>
                            <tr>
                              <td className={classes["african-sports-table__title"]} colSpan="16">
                                <span>{pathDescription}</span>
                              </td>
                            </tr>

                            {events.map((match) => {
                              if (eventId && match.id !== eventId) return null;

                              return (
                                <SportsTableRow
                                  additionalMarketCount={
                                    match?.count ? match.count - Object.values(match.children).length : 0
                                  }
                                  date={dayjs.unix(match.epoch / 1000).format("MMMM D")}
                                  eventId={match.id}
                                  feedCode={match.brMatchId}
                                  key={match.id}
                                  markets={Object.values(match.children)}
                                  sportCode={sportCode}
                                  teamA={match.a}
                                  teamB={match.b}
                                  time={dayjs.unix(match.epoch / 1000).format("hh:mm A")}
                                />
                              );
                            })}
                          </React.Fragment>
                        );
                      });
                    }

                    return null;
                  });
                }

                return null;
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={classes["asian-outright-table"]}>
          <div className={classes["asian-outright-table__header"]}>
            <span>Outcome</span>
            <span>Price</span>
          </div>
          {Object.values(pathCouponData).map((sport) => {
            if (sport.children) {
              const categories = Object.values(sport.children).slice().sort(sortEventPaths);

              return categories.map((category) => {
                const categoryDescription = category.desc;
                if (category.children) {
                  const tournaments = Object.values(category.children).slice().sort(sortEventPaths);

                  return tournaments.map((tournament) => {
                    if (excludedTournaments.includes(tournament.id)) {
                      return null;
                    }

                    const pathDescription = `${categoryDescription} : ${tournament.desc}`;
                    const events = getEvents(Object.values(tournament.children)).slice().sort(sortEvents);

                    return (
                      <>
                        <div className={classes["asian-outright-table__title"]}>{pathDescription}</div>
                        {events.map((match) => (
                          <AfricanOutright key={match.id} match={match} />
                        ))}
                      </>
                    );
                  });
                }

                return null;
              });
            }

            return null;
          })}
        </div>
      )}
    </div>
  );
};

ContinentalSportsTable.propTypes = propTypes;
ContinentalSportsTable.defaultProps = defaultProps;

export default React.memo(ContinentalSportsTable);
