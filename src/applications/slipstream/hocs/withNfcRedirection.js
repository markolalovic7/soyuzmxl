import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { getAuthLoggedIn } from "../../../redux/reselect/auth-selector";
import { loadRetailNfc, searchAccountByNfc } from "../../../redux/slices/retailAccountSlice";
import { isNotEmpty } from "../../../utils/lodash";
import SlipstreamPopup from "../components/SlipstreamPopup/SlipstreamPopup";

const withNfcRedirection = (Component) => (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [loadingAccount, setLoadingAccount] = useState(false);
  const [errorPopUp, setErrorPopUp] = useState(false);

  const loggedIn = useSelector(getAuthLoggedIn);

  const fetchAccountByNfc = async ({ nfc }) => {
    const action = await dispatch(searchAccountByNfc({ nfc }));

    if (searchAccountByNfc.fulfilled.match(action)) {
      const accountSearchResult = action.payload.accountSearchResult;
      if (isNotEmpty(accountSearchResult)) {
        history.push(`/accountview/${accountSearchResult.id}?origin=DIRECT`);
      } else {
        setErrorPopUp(true);
      }
    } else if (searchAccountByNfc.rejected.match(action)) {
      setErrorPopUp(true);
    }
    setLoadingAccount(false);
  };

  useEffect(() => {
    if (!loggedIn) return undefined;

    const intervalId = setInterval(() => {
      if (loadingAccount) return undefined;

      const source = axios.CancelToken.source();

      const fetchNfcUpdates = async () => {
        const action = await dispatch(loadRetailNfc());

        if (loadRetailNfc.fulfilled.match(action)) {
          const nfc = action.payload.nfc;
          if (isNotEmpty(nfc)) {
            setLoadingAccount(true);
            await fetchAccountByNfc({ nfc });
          }
        }
      };

      fetchNfcUpdates();

      return () => {
        source.cancel();
      };
    }, 250);

    return () => clearInterval(intervalId);
  }, [loggedIn, loadingAccount]);

  return (
    <>
      {errorPopUp && (
        <SlipstreamPopup
          headerText="NFC"
          text="NFC tag does not match any known player"
          onClose={() => setErrorPopUp(false)}
        />
      )}
      <Component {...props} />
    </>
  );
};

export default withNfcRedirection;
