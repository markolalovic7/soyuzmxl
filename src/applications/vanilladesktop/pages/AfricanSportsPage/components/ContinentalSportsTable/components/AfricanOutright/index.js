import cx from "classnames";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import { getAuthLoggedIn } from "../../../../../../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds } from "../../../../../../../../redux/reselect/betslip-selector";
import {
  getDesktopBetslipMaxSelections,
  isDesktopCompactBetslip,
} from "../../../../../../../../redux/reselect/cms-layout-widgets";
import { onRefreshBetslipHandler, onToggleSelection } from "../../../../../../../../utils/betslip-utils";
import FavouriteMatchButton from "../../../../../../components/FavouriteMatchButton";
import classes from "../../../../../../scss/vanilladesktop.module.scss";

const AfricanOutright = ({ match }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const isLoggedIn = useSelector(getAuthLoggedIn);

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const maxBetslipSelections = useSelector(getDesktopBetslipMaxSelections);
  const compactBetslipMode = useSelector(isDesktopCompactBetslip);

  const toggleBetslipHandler = (outcomeId, eventId) => {
    if (betslipOutcomeIds.length < maxBetslipSelections) {
      onToggleSelection(dispatch, location.pathname, outcomeId, eventId, compactBetslipMode);

      onRefreshBetslipHandler(dispatch, location.pathname);
    } else {
      alert(t("betslip_panel.too_many_selections", { value: maxBetslipSelections }));
    }
  };

  return Object.values(match.children).map((market) => (
    <>
      <div className={classes["asian-outright-table__label"]}>
        {isLoggedIn && <FavouriteMatchButton className="asian-outright-table__icon" eventId={match.id} isDiv={false} />}
        <span className={classes["asian-outright-table__event"]}>
          {`${dayjs.unix(match.epoch / 1000).format("MMMM D")} - ${match.desc} - ${market.desc}`}
        </span>
        <span className={classes["asian-outright-table__id"]}>{`ID ${match.id}`}</span>
      </div>

      {Object.values(market.children).map((outcome) => (
        <React.Fragment key={outcome.id}>
          <div className={classes["asian-outright-table__match"]}>
            <span className={classes["asian-outright-table__outcome"]}>{outcome.desc}</span>
            <span className={cx(classes["asian-outright-table__price"])}>
              <span
                className={cx(classes["african-sports-table__factor"])}
                style={{ width: "80px" }}
                onClick={() => toggleBetslipHandler(outcome.id, match.id)}
              >
                {outcome.price}
              </span>
            </span>
          </div>
        </React.Fragment>
      ))}
    </>
  ));
};

const propTypes = {
  match: PropTypes.object.isRequired,
};

AfricanOutright.propTypes = propTypes;

export default AfricanOutright;
