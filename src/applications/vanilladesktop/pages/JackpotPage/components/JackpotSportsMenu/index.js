import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { useGetJackpots } from "../../../../../../hooks/jackpots-hooks";
import { getAuthCurrencyCode } from "../../../../../../redux/reselect/auth-selector";
import { getSportsSelector } from "../../../../../../redux/reselect/sport-selector";
import { getJackpotItemCurrency } from "../../../../../vanillamobile/components/JackpotsPage/utils";
import JackpotSportsMenuItem from "../JackpotSportsMenuItem";

const JackpotSportsMenu = ({ activeJackpotId, setActiveJackpotId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const currentCurrencyCode = useSelector(getAuthCurrencyCode);
  const [jackpots, isLoading] = useGetJackpots(dispatch);
  const sports = useSelector(getSportsSelector);

  useEffect(() => {
    if (!activeJackpotId && jackpots?.length > 0) {
      setActiveJackpotId(jackpots[0].id);
    }
  }, [activeJackpotId, jackpots]);

  const jackpotsFiltered = jackpots?.filter(
    (jackpot) => !!getJackpotItemCurrency(jackpot.currencyStakeMap, currentCurrencyCode),
  );

  const jackpotBySport = {};

  jackpotsFiltered?.forEach((j) => {
    const sportCode = j.sportCodes[0];
    jackpotBySport[sportCode] = jackpotBySport[sportCode]
      ? { ...jackpotBySport[sportCode], jackpots: [...jackpotBySport[sportCode].jackpots, j] }
      : { jackpots: [j], sportCode };
  });

  return (
    <>
      <h3 className={classes["left-section__title"]}>{t("sports")}</h3>
      <div className={classes["menu-sports"]}>
        <ul className={classes["menu-sports__list"]}>
          {Object.values(jackpotBySport).map((sportJackpots, index) => {
            const sportCode = sportJackpots.sportCode;
            const jackpots = sportJackpots.jackpots;

            return (
              <JackpotSportsMenuItem
                activeJackpotId={activeJackpotId}
                icon={sportCode.toLowerCase()}
                jackpots={jackpots}
                key={index}
                label={sports ? sports[sportCode].description : ""}
                setActiveJackpotId={setActiveJackpotId}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};

const propTypes = {
  activeJackpotId: PropTypes.number,
  setActiveJackpotId: PropTypes.func.isRequired,
};

const defaultProps = {
  activeJackpotId: undefined,
};

JackpotSportsMenu.propTypes = propTypes;
JackpotSportsMenu.defaultProps = defaultProps;

export default JackpotSportsMenu;
