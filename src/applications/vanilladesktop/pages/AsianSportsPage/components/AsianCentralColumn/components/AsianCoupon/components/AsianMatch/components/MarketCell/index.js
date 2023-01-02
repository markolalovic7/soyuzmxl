import PropTypes from "prop-types";
import React from "react";

import {
  ASIAN_MARKET_TYPE_1x2,
  ASIAN_MARKET_TYPE_DC,
  ASIAN_MARKET_TYPE_F5_HDP,
  ASIAN_MARKET_TYPE_F5_OU,
  ASIAN_MARKET_TYPE_FG,
  ASIAN_MARKET_TYPE_FH_1x2,
  ASIAN_MARKET_TYPE_FH_FG,
  ASIAN_MARKET_TYPE_FH_HDP,
  ASIAN_MARKET_TYPE_FH_LG,
  ASIAN_MARKET_TYPE_FH_ML,
  ASIAN_MARKET_TYPE_FH_OE,
  ASIAN_MARKET_TYPE_FH_OU,
  ASIAN_MARKET_TYPE_FOOT_CS,
  ASIAN_MARKET_TYPE_FS_ML,
  ASIAN_MARKET_TYPE_HDP,
  ASIAN_MARKET_TYPE_HTFT,
  ASIAN_MARKET_TYPE_LG,
  ASIAN_MARKET_TYPE_ML,
  ASIAN_MARKET_TYPE_OE,
  ASIAN_MARKET_TYPE_OU,
  ASIAN_MARKET_TYPE_SS_ML,
  ASIAN_MARKET_TYPE_TENN_CS,
  ASIAN_MARKET_TYPE_TG,
} from "../../../../../../../../../../../../utils/asian-view/asianViewSportMarkets";

import AsianMarket1x2 from "./components/Market/Double/AsianMarket1x2";
import AsianMarketHDP from "./components/Market/Double/AsianMarketHDP";
import AsianMarketML from "./components/Market/Double/AsianMarketML";
import AsianMarketOU from "./components/Market/Double/AsianMarketOU";
import AsianMarketProposition from "./components/Market/Double/AsianMarketProposition";
import AsianMarketXGoal from "./components/Market/Double/AsianMarketXGoal";
import AsianPlaceholderMarket from "./components/Market/Double/AsianPlaceholderMarket";

const propTypes = {
  asianMarket: PropTypes.string.isRequired,
  centered: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  market: PropTypes.object,
};

const defaultProps = {
  market: undefined,
};

const MarketCell = ({ asianMarket, centered, eventId, market }) => {
  if (!market) return <AsianPlaceholderMarket />;

  switch (asianMarket) {
    case ASIAN_MARKET_TYPE_1x2:
    case ASIAN_MARKET_TYPE_FH_1x2:
      return <AsianMarket1x2 centered={centered} eventId={eventId} outcomes={market.outcomes} />;
    case ASIAN_MARKET_TYPE_OE:
    case ASIAN_MARKET_TYPE_FH_OE:
    case ASIAN_MARKET_TYPE_ML:
    case ASIAN_MARKET_TYPE_FH_ML:
    case ASIAN_MARKET_TYPE_FS_ML:
    case ASIAN_MARKET_TYPE_SS_ML:
      return <AsianMarketML centered={centered} eventId={eventId} outcomes={market.outcomes} />;
    case ASIAN_MARKET_TYPE_OU:
    case ASIAN_MARKET_TYPE_FH_OU:
    case ASIAN_MARKET_TYPE_F5_OU:
      return <AsianMarketOU centered={centered} eventId={eventId} outcomes={market.outcomes} />;
    case ASIAN_MARKET_TYPE_HDP:
    case ASIAN_MARKET_TYPE_FH_HDP:
    case ASIAN_MARKET_TYPE_F5_HDP:
      return <AsianMarketHDP centered={centered} eventId={eventId} outcomes={market.outcomes} />;

    case ASIAN_MARKET_TYPE_FH_FG:
    case ASIAN_MARKET_TYPE_FG:
    case ASIAN_MARKET_TYPE_FH_LG:
    case ASIAN_MARKET_TYPE_LG:
      return <AsianMarketXGoal centered={centered} eventId={eventId} outcomes={market.outcomes} />;

    case ASIAN_MARKET_TYPE_DC:
    case ASIAN_MARKET_TYPE_HTFT:
    case ASIAN_MARKET_TYPE_FOOT_CS:
    case ASIAN_MARKET_TYPE_TENN_CS:
    case ASIAN_MARKET_TYPE_TG:
      return <AsianMarketProposition centered={centered} eventId={eventId} outcomes={market.outcomes} />;
    default:
      return <AsianPlaceholderMarket />;
  }
};

MarketCell.propTypes = propTypes;
MarketCell.defaultProps = defaultProps;

export default React.memo(MarketCell);
