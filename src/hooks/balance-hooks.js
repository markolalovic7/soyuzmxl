import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthAccountId, getAuthLoggedIn } from "redux/reselect/auth-selector";
import { getCmsConfigBrandDetails } from "redux/reselect/cms-selector";
import { loadBalance } from "redux/slices/balanceSlice";

export function useBalance(dispatch) {
  const loggedIn = useSelector(getAuthLoggedIn);
  const accountId = useSelector(getAuthAccountId);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  useEffect(() => {
    if (
      accountId &&
      cmsConfigBrandDetails &&
      loggedIn &&
      !cmsConfigBrandDetails.data.singleWalletMode &&
      !process.env.REACT_APP_SLIPSTREAM_ON
    ) {
      dispatch(loadBalance({ accountId }));

      const interval = setInterval(() => {
        dispatch(loadBalance({ accountId }));
      }, 5000);

      return () => {
        // unsubscribe
        clearInterval(interval);
      };
    }

    return undefined;
  }, [dispatch, cmsConfigBrandDetails, accountId, loggedIn]);
}
