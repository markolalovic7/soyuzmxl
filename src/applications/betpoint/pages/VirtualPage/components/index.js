import classes from "applications/betpoint/scss/betpoint.module.scss";
import cx from "classnames";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

import { logout } from "../../../../../redux/actions/auth-actions";
import { getSportsSelector } from "../../../../../redux/reselect/sport-selector";
import { getPatternMyBets } from "../../../../../utils/route-patterns";
import BetslipPanel from "../../../components/BetslipPanel";
import CentralSportsContent from "../../../components/CentralSportsContent";
import Header from "../../../components/Header";

const VIRTUAL_SPORTS = [
  { desc: "Football", eventPathId: 240, live: false, sportCode: "FOOT" },
  { desc: "Basketball", eventPathId: 227, live: false, sportCode: "BASK" },
  { desc: "Baseball", eventPathId: 226, live: true, sportCode: "BASE" },
  { desc: "Tennis", eventPathId: 239, live: true, sportCode: "TENN" },
];

const VirtualPage = () => {
  const { eventPathId: eventPathIdStr } = useParams();
  const { eventId: eventIdStr } = useParams();

  const eventId = eventIdStr ? Number(eventIdStr) : undefined;
  const eventPathId = eventPathIdStr ? Number(eventPathIdStr) : undefined;

  const history = useHistory();
  const dispatch = useDispatch();

  const sports = useSelector(getSportsSelector);

  const { t } = useTranslation();

  return (
    <div className={classes["betpoint-body"]}>
      <div className={classes["wrapper"]}>
        <Header />

        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["sidebar"]}>
              <div className={classes["sidebar__content"]}>
                <div className={classes["sidebar__title"]}>
                  <div className={classes["sidebar__text"]}>Virtual Sports</div>
                </div>
                <div className={classes[" sidebar-menu"]}>
                  <ul className={classes["sidebar-menu__list"]}>
                    {VIRTUAL_SPORTS.map((virtualSport) => (
                      <li className={classes["sidebar-menu__item "]} key={virtualSport.sportCode}>
                        <div
                          className={cx(classes["sidebar-menu__item-content"], classes["accordion"])}
                          onClick={() => history.push(`/virtual/eventpath/${virtualSport.eventPathId}`)}
                        >
                          <h4 className={classes["sidebar-menu__title"]}>{virtualSport.desc}</h4>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={classes["sidebar__controls"]}>
                <div className={classes["sidebar__control"]} onClick={() => history.push("/")}>
                  Main Menu
                </div>
                <div className={classes["sidebar__control"]} onClick={() => history.push(getPatternMyBets())}>
                  History
                </div>
                <div className={classes["sidebar__control"]} onClick={() => history.push("/promotions")}>
                  Promotions
                </div>
                <div className={classes["sidebar__control"]} onClick={() => dispatch(logout())}>
                  Logout
                </div>
              </div>
            </div>

            <CentralSportsContent
              virtual
              eventId={eventId}
              eventPathId={eventPathId}
              live={VIRTUAL_SPORTS.find((x) => x.eventPathId === eventPathId)?.live}
              max={undefined}
              sportCode={VIRTUAL_SPORTS.find((x) => x.eventPathId === eventPathId)?.sportCode}
            />

            <BetslipPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VirtualPage);
