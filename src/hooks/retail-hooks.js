import { useEffect } from "react";
import { useSelector } from "react-redux";

import { getAuthLoggedIn } from "../redux/reselect/auth-selector";
import { alive } from "../redux/slices/retailAccountSlice";

export const useRetailAlive = (dispatch) => {
  const isLoggedIn = useSelector(getAuthLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      const id = setInterval(() => dispatch(alive()), 5000);

      return () => clearInterval(id);
    }

    return undefined;
  }, [dispatch, isLoggedIn]);
};
