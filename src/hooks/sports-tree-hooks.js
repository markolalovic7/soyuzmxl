import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAuthLanguage } from "redux/reselect/auth-selector";
import { getSportsTreeSelector } from "redux/reselect/sport-tree-selector";
import { getSportsTree } from "redux/slices/sportsTreeSlice";

export function useSportsTree({ standard }, dispatch) {
  const language = useSelector(getAuthLanguage);
  const sportsTreeData = useSelector(getSportsTreeSelector);

  useEffect(() => {
    const source = axios.CancelToken.source();
    dispatch(
      getSportsTree({
        cancelToken: source.token,
        standard,
      }),
    );
    const interval = setInterval(() => {
      // Refresh periodically
      dispatch(getSportsTree({ standard }));
    }, 60000);

    return () => {
      clearInterval(interval);
      source.cancel();
    };
  }, [dispatch, language, standard]);

  return sportsTreeData;
}
