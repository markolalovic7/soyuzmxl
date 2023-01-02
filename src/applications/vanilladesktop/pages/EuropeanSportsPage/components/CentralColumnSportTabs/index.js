import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeaguePopup from "applications/vanilladesktop/components/EuropeanLeaguePopup";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { recursiveItemSearch } from "../../utils/sportsPageUtils";

import { getCentralColumnSportTabs } from "./constants";

const CentralColumnSportTabs = ({
  eventPathId,
  excludedTournaments,
  isOutright,
  selectedMarketTypeGroup,
  setExcludedTournaments,
  setSelectedMarketTypeGroup,
}) => {
  const { t } = useTranslation();

  const [isLeaguePopupOpened, setIsLeaguePopupOpened] = useState(false);

  const handleLeaguePopupClose = useCallback(() => setIsLeaguePopupOpened(false), []);

  const sports = useSelector((state) => state.sport.sports);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData?.ept);

  const path = sportsTreeData && recursiveItemSearch(sportsTreeData, eventPathId);

  const centralColumnTabs = useMemo(() => getCentralColumnSportTabs(t), [t]);

  if (!sportsTreeData) return null;

  return (
    <div className={classes["selected-sport"]}>
      <div className={classes["selected-sport__label"]}>
        <span className={classes["selected-sport__icon"]}>
          <i className={cx(classes["qicon-default"], classes[`qicon-${path?.code?.toLowerCase()}`])} />
        </span>
        <h4 className={classes["selected-sport__title"]}>
          {sports && path?.code ? sports[path.code].description : ""}
        </h4>
      </div>
      {!isOutright ? (
        <div className={classes["navigation-tabs"]}>
          {centralColumnTabs.map((tab) => {
            if (
              path?.marketCriterias &&
              Object.keys(path.marketCriterias).findIndex((m) => m.substr(0, 1) === tab.prefix) === -1
            ) {
              return null;
            }

            return (
              <div
                className={cx(classes["navigation-tab"], {
                  [classes["active"]]: selectedMarketTypeGroup === tab.code,
                })}
                key={tab.code}
                style={{ minWidth: "110px" }}
                onClick={() => setSelectedMarketTypeGroup(tab.code)}
              >
                {tab.desc}
              </div>
            );
          })}
        </div>
      ) : null}
      <button
        className={cx(classes["selected-sport__league"], classes["popup-link"])}
        type="button"
        onClick={() => setIsLeaguePopupOpened(true)}
      >
        <FontAwesomeIcon icon={faPencilAlt} />
        <span>{t("vanilladesktop.select_league")}</span>
      </button>
      <LeaguePopup
        code={`p${eventPathId}`}
        excludedTournaments={excludedTournaments}
        isOpen={isLeaguePopupOpened}
        setExcludedTournaments={setExcludedTournaments}
        onClose={handleLeaguePopupClose}
      />
    </div>
  );
};

const propTypes = {
  eventPathId: PropTypes.number,
  excludedTournaments: PropTypes.array.isRequired,
  isOutright: PropTypes.bool.isRequired,
  selectedMarketTypeGroup: PropTypes.string,
  setExcludedTournaments: PropTypes.func.isRequired,
  setSelectedMarketTypeGroup: PropTypes.func.isRequired,
};

const defaultProps = {
  eventPathId: undefined,
  selectedMarketTypeGroup: undefined,
};

CentralColumnSportTabs.propTypes = propTypes;
CentralColumnSportTabs.defaultProps = defaultProps;

export default React.memo(CentralColumnSportTabs);
