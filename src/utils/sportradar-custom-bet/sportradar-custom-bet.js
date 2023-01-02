import { onAddCustomBetToBetslip } from "../betslip-utils";
import backdoor from "../../redux/utils/reduxBackdoor";

const UOfeeds = {
  getUOFAvailableSelections: {
    headers: {
      "Content-Type": "application/xml",
    },
    method: "GET",
    url: "/custombet/v1/custombet/{matchId}/available_selections",
    // url: "https://api.betradar.com/v1/custombet/{matchId}/available_selections",
  },
  getUOFFixture: {
    headers: {
      "Content-Type": "application/xml",
    },
    method: "GET",
    url: `/custombet/v1/sports/${backdoor.language ?? "en"}/sport_events/{matchId}/fixture.xml`,
    // url: "https://api.betradar.com/v1/sports/en/sport_events/{matchId}/fixture.xml",
  },
  getUOFMarkets: {
    headers: {
      "Content-Type": "application/xml",
    },
    method: "GET",
    url: `/custombet/v1/descriptions/${backdoor.language ?? "en"}/markets.xml?include_mappings=true`,
    // url: "https://api.betradar.com/v1/descriptions/en/markets.xml?include_mappings=true",
  },
  getUOFProfile: {
    headers: {
      "Content-Type": "application/xml",
    },
    method: "GET",
    url: `/custombet/v1/sports/${backdoor.language ?? "en"}/competitors/{teamId}/profile.xml`,
    // url: "https://api.betradar.com/v1/sports/en/competitors/{teamId}/profile.xml",
  },
  updateSelection: {
    headers: {
      "Content-Type": "application/xml",
    },
    method: "POST",
    url: "/custombet/v1/custombet/calculate-filter",
    // url: "https://api.betradar.com/v1/custombet/calculate-filter",
  },
};

// args will contain the matchId
export function getFixture(args, callback) {
  // call to backend API
  const url = UOfeeds.getUOFFixture.url.replace("{matchId}", args.matchId);
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw response;
    })
    .then((xmlString) => {
      callback(false, xmlString);
    })
    .catch((error) => {
      callback({
        error_code: "400",
        message: "Could not get fixture data",
      });
    });
}

// args will contain matchId
export function getAvailableMarkets(args, callback) {
  // call to backend API
  const url = UOfeeds.getUOFAvailableSelections.url.replace("{matchId}", args.matchId);
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw response;
    })
    .then((xmlString) => {
      callback(false, xmlString);
    })
    .catch((error) => {
      callback({
        error_code: "400",
        message: "Could not get fixture data",
      });
    });
}

// args will contain teamId
export function getProfile(args, callback) {
  // call to backend API
  const url = UOfeeds.getUOFProfile.url.replace("{teamId}", args.teamId);
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw response;
    })
    .then((xmlString) => {
      callback(false, xmlString);
    })
    .catch((error) => {
      callback({
        error_code: "400",
        message: "Could not get fixture data",
      });
    });
}

// args are currently empty
export function getMarkets(args, callback) {
  // call to backend API
  fetch(UOfeeds.getUOFMarkets.url)
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw response;
    })
    .then((xmlString) => {
      callback(false, xmlString);
    })
    .catch((error) => {
      callback({
        error_code: "400",
        message: "Could not get fixture data",
      });
    });
}

// args will contain matchId and all selected outcomes in the widget
export function calculate(args, callback) {
  // call to backend API

  const selections =
    args.selectedOutcomes &&
    args.selectedOutcomes.length > 0 &&
    args.selectedOutcomes.map((outcome) =>
      // getSelection function is a helper function that will create the xml object for you
      outcome.getSelection(),
    );

  // prepare body
  const postContent =
    selections &&
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <filterSelections xmlns="http://schemas.sportradar.com/custombet/v1/endpoints" >
      <selection id="${args.matchId}">
        ${selections.join(" ")}
      </selection>
    </filterSelections>`;

  fetch(UOfeeds.updateSelection.url, {
    body: postContent,
    headers: UOfeeds.updateSelection.headers,
    method: UOfeeds.updateSelection.method,
  })
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw response;
    })
    .then((xmlString) => {
      callback(false, xmlString);
    })
    .catch((error) => {
      callback({
        errorCode: error.status,
        message: "Invalid selection",
        name: error.statusText,
      });
    });
}

// args will contain matchId and all selected outcomes in the widget
export const betslipCallback = (dispatch, pathname, live, compactSpread) => (args, callback) => {
  if (args.selectedOutcomes.length >= 2) {
    const customBetRequest = {
      live,
      matchId: args.matchId,
      selections: args.selectedOutcomes.map((x) => ({
        marketId: x.srMarket?.id,
        outcomeId: x.srOutcome,
        specifiers: x.srMarket?.specifiers,
      })),
    };
    onAddCustomBetToBetslip(dispatch, pathname, customBetRequest, compactSpread);
    callback({
      reason: "More then 2 outcomes, A OK!",
      succeeded: true, // reason is optional
    });
  } else {
    callback({
      reason: "There are less then 2 outcomes, please select more",
      succeeded: false, // reason is optional, but will be displayed on the widget if present
    });
  }
};
