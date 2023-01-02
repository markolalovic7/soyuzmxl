import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

import classes from "../../../../../../../../scss/vanilladesktop.module.scss";
import { ASIAN_MARKET_OUTCOME_MAPPING } from "../../../../../../../../../../utils/asian-view/asianViewSportMarkets";
import { ASIAN_VIEW_TYPE_DOUBLE, ASIAN_VIEW_TYPE_SINGLE } from "../../constants";

const AsianCouponHeader = ({ marketTypes, viewType }) => {
  const { t } = useTranslation();

  return (
    <thead>
      <tr className={classes["asian-sports-table__labels"]}>
        <th rowSpan="2">{t("time")}</th>
        <th rowSpan="2">{t(`live_calendar_head_labels.event`)}</th>
        {marketTypes.map((marketType) => {
          let rowSpan = 0;
          if (viewType === ASIAN_VIEW_TYPE_DOUBLE) {
            rowSpan = marketType.marketGroup.length;
          } else {
            marketType.marketGroup.forEach((market) => {
              rowSpan += ASIAN_MARKET_OUTCOME_MAPPING[market].length;
              // if (market.endsWith("HDP") || market.endsWith("OU")) {
              //   rowSpan += 1;
              // }
            });
          }

          return (
            <th colSpan={rowSpan} key={marketType.code}>
              {t(`vanilladesktop.marketTypePeriod.${marketType.code}`)}
            </th>
          );
        })}
        <th rowSpan="2">{t("vanilladesktop.more")}</th>
      </tr>
      <tr className={classes["asian-sports-table__sublabels"]}>
        {viewType === ASIAN_VIEW_TYPE_DOUBLE &&
          marketTypes.map((marketType) =>
            marketType.marketGroup.map((market) => <th key={market}>{t(`vanilladesktop.marketType.${market}`)}</th>),
          )}
        {viewType === ASIAN_VIEW_TYPE_SINGLE &&
          marketTypes.map((marketType) =>
            marketType.marketGroup.map((market) =>
              ASIAN_MARKET_OUTCOME_MAPPING[market].map((outcomeType) => (
                <th key={outcomeType}>{t(`vanilladesktop.outcomeType.${outcomeType}`)}</th>
              )),
            ),
          )}
      </tr>
    </thead>
  );
};

const propTypes = {
  marketTypes: PropTypes.array.isRequired,
  viewType: PropTypes.string.isRequired,
};
AsianCouponHeader.propTypes = propTypes;

export default React.memo(AsianCouponHeader);
