import { getAuthAccountId, getAuthLanguage, getAuthTill, getAuthToken } from "../reselect/auth-selector";
import { getCmsLineId, getCmsOriginId } from "../reselect/cms-selector";
import { getRetailSelectedPlayerAccountId } from "../reselect/retail-selector";

export function getRequestParams(state) {
  const accountId = getAuthAccountId(state);
  const lineId = getCmsLineId(state);
  const originId = getCmsOriginId(state);
  const authToken = getAuthToken(state);
  const language = getAuthLanguage(state);
  const tillAuth = getAuthTill(state);
  const retailSelectedPlayerAccountId = getRetailSelectedPlayerAccountId(state);

  return {
    accountId,
    authToken,
    language,
    lineId,
    originId,
    retailSelectedPlayerAccountId,
    tillAuth,
  };
}
