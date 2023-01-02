import BetslipPanel from "applications/betpoint/components/BetslipPanel";
import Header from "applications/betpoint/components/Header";
import classes from "applications/betpoint/scss/betpoint.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { logout } from "../../../../redux/actions/auth-actions";
import { getSportsTreeSelector } from "../../../../redux/reselect/sport-tree-selector";
import { getPatternMyBets } from "../../../../utils/route-patterns";
import { useLiveData } from "../../../common/hooks/useLiveData";

const LiveLayout = ({ children }) => {
  const sportsTreeData = useSelector(getSportsTreeSelector);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  return (
    <div className={classes["betpoint-body"]}>
      <div className={classes["wrapper"]}>
        <Header />
        <div className={classes["main"]}>
          <div className={classes["main__container"]}>
            <div className={classes["sidebar"]}>
              <div className={classes["sidebar__content"]}>
                <div className={classes["sidebar__title"]}>
                  <div className={classes["sidebar__text"]}>Live</div>
                </div>
                <div className={classes[" sidebar-menu"]}>
                  <ul className={classes["sidebar-menu__list"]}>
                    {sportsTreeData
                      ?.filter((sport) => sport.criterias?.live)
                      ?.map((item) => (
                        <li className={classes["sidebar-menu__item "]} key={item.id}>
                          <div
                            className={cx(classes["sidebar-menu__item-content"], classes["accordion"], {
                              [classes["active"]]: location.pathname === `/live/sport/${item.code}`,
                            })}
                            onClick={() => history.push(`/live/sport/${item.code}`)}
                          >
                            <h4 className={classes["sidebar-menu__title"]}>{item.desc}</h4>
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

            {children}

            <BetslipPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

LiveLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default React.memo(LiveLayout);
