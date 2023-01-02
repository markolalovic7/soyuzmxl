import classes from "applications/ollehdesktop/scss/ollehdesktop.module.scss";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";

import { getCmsLayoutDesktopWidgetsRightColumn } from "../../../../../redux/reselect/cms-layout-widgets";
import { getCmsConfigBetradarVirtual } from "../../../../../redux/reselect/cms-selector";
import { getBetradarVirtualSportList, getSportCode } from "../../../../../utils/betradar-virtual-utils";

import Betslip from "./Betslip";

const BetSlipColumn = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const widgets = useSelector((state) => getCmsLayoutDesktopWidgetsRightColumn(state, location));
  const cmsConfigBetradarVirtual = useSelector(getCmsConfigBetradarVirtual);

  const {
    data: { feedCodes },
  } = cmsConfigBetradarVirtual || { data: {} };

  return (
    <div className={classes["right__column"]}>
      {widgets?.map((widget) => {
        if (widget.cmsWidgetType === "BETSLIP") {
          return <Betslip betslipWidget={widget} />;
        }

        return null;
      })}
      <div className={classes["right__column-items"]}>
        {getBetradarVirtualSportList(t)
          .filter((sport) => feedCodes.includes(sport.code))
          .map((sport) => (
            <div
              className={`${classes["column-item"]} ${classes[`virtual-${getSportCode(sport.code).toLowerCase()}`]}`}
              key={sport.code}
              onClick={() => history.push(`/brvirtual/${sport.code}`)}
            >
              <div>
                <h3>{sport.label}</h3>
                <p>{t("vanilladesktop.starting_now")}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BetSlipColumn;
