import ReactGA from "react-ga4";

// https://github.com/PriceRunner/react-ga4#readme
// Legacy - but better documented! - https://github.com/react-ga/react-ga
// https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference

export const gaPageView = (title, locationUrl) => {
  if (ReactGA.isInitialized) {
    ReactGA.send({ hitType: "pageview", page: locationUrl, title });
  } else {
    // give this a second shot assuming reactGA is in the process of being init
    setTimeout(() => ReactGA.send({ hitType: "pageview", page: locationUrl, title }), 5000);
  }
};

export const gaModalView = (modal) => {
  // TODO
};

export const gaEvent = (category, action, label, value, interaction) => {
  // Send a custom event
  ReactGA.event({
    action,
    category,
    label,
    // optional, must be a number
    nonInteraction: !interaction,
    // optional
    value, // optional, true/false
    // transport: "xhr", // optional, beacon/xhr/image
  });
};

export const gaTrackBet = (currencyCode, totalStake, betslipReference, outcomes) => {
  // https://developers.google.com/tag-platform/gtagjs/reference/events
  // https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtag#make_a_purchase_or_issue_a_refund

  ReactGA.event("purchase", {
    currency: currencyCode,
    items: outcomes.map((o) => ({
      item_category: o.sportCode,
      item_category2: o.categoryDescription,
      item_category3: o.tournamentDescription,
      item_category4: o.eventDescription,
      item_category5: o.marketDescription,
      item_id: o.outcomeId.toString(),
      item_name: o.outcomeDescription,
    })),
    transaction_id: betslipReference,
    value: totalStake,
  });
};
