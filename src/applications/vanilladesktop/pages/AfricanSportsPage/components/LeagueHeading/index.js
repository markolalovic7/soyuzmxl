import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import cx from "classnames";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import ContinentalLeaguePopup from "../../../../components/ContinentalLeaguePopup";
import { recursiveSportCodeItemSearch } from "../../../../utils/pathUtils";
import { recursiveItemSearch } from "../../../EuropeanSportsPage/utils/sportsPageUtils";

const propTypes = {
  eventPathId: PropTypes.number.isRequired,
  excludedTournaments: PropTypes.array.isRequired,
  searchCode: PropTypes.string.isRequired,
  setExcludedTournaments: PropTypes.func.isRequired,
};

const LeagueHeading = ({ eventPathId, excludedTournaments, searchCode, setExcludedTournaments }) => {
  const { t } = useTranslation();

  const [isLeaguePopupOpened, setIsLeaguePopupOpened] = useState(false);

  const sports = useSelector((state) => state.sport.sports);

  const sportsTreeData = useSelector((state) => state.sportsTree.sportsTreeData?.ept);

  const sportCode = useSelector((state) =>
    recursiveSportCodeItemSearch(state.sportsTree.sportsTreeData?.ept, eventPathId, null),
  );

  const path = sportsTreeData && recursiveItemSearch(sportsTreeData, eventPathId);

  return (
    <>
      <h3 className={classes["main-title"]}>
        <div className={classes["main-title__sport"]}>
          <i className={classes[`qicon-${path?.code?.toLowerCase()}`]} />
        </div>
        <p className={classes["main-title__text"]}>{sportCode && sports ? sports[sportCode].description : ""}</p>
        <div
          className={cx(classes["main-title__league"], classes["popup-link"])}
          onClick={() => setIsLeaguePopupOpened(true)}
        >
          <svg
            aria-hidden="true"
            data-fa-i2svg=""
            data-icon="pencil-alt"
            data-prefix="fas"
            focusable="false"
            role="img"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"
              fill="currentColor"
            />
          </svg>
          <span>{t("vanilladesktop.select_league")}</span>
        </div>
      </h3>
      <ContinentalLeaguePopup
        code={searchCode}
        excludedTournaments={excludedTournaments}
        isOpen={isLeaguePopupOpened}
        setExcludedTournaments={setExcludedTournaments}
        onClose={() => setIsLeaguePopupOpened(false)}
      />
    </>
  );
};

LeagueHeading.propTypes = propTypes;

export default LeagueHeading;
