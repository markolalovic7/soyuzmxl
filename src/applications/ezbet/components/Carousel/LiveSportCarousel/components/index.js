import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import isEmpty from "lodash.isempty";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import SimpleBar from "simplebar-react";

import "../../../../scss/simplebar.min.css";
import { getSportsSelector } from "../../../../../../redux/reselect/sport-selector";
import { isNotEmpty } from "../../../../../../utils/lodash";
import { useLiveData } from "../../../../../common/hooks/useLiveData";
import classes from "../../../../scss/ezbet.module.scss";
import CarouselSportCard from "../../CarouselSportCard";

const propTypes = {};

const defaultProps = {};

// const createScrollStopListener = (element, callback, timeout) => {
//   let removed = false;
//   let handle = null;
//   const onScroll = () => {
//     if (handle) {
//       clearTimeout(handle);
//     }
//     handle = setTimeout(callback, timeout || 200); // default 200 ms
//   };
//   if (element) {
//     element.addEventListener('scroll', onScroll);
//   }

//   return () => {
//     if (removed) {
//       return;
//     }
//     removed = true;
//     if (handle) {
//       clearTimeout(handle);
//     }
//     element?.removeEventListener('scroll', onScroll);
//   };
// };

// const useScrollStopListener = (callback, timeout) => {
//   const containerRef = useRef();
//   const callbackRef = useRef();
//   callbackRef.current = callback;
//   useEffect(() => {
//     const destroyListener = createScrollStopListener(containerRef.current, () => {
//       if (callbackRef.current) {
//         callbackRef.current();
//       }
//     });

//     return () => destroyListener();
//   }, [containerRef.current]);

//   return containerRef;
// };

const MASTER_SPORTS = ["FOOT", "BASE", "BASK", "VOLL"];

const SECONDARY_LIVE_SPORTS = [
  "HAND",
  "TABL",
  "SNOO",
  "DART",
  "SQUA",
  "CRIC",
  "AURL",
  "TENN",
  "ICEH",
  "BADM",
  "RUGB",
  "BEAC",
  "FUTS",
  "AMFB",
  "BOWL",
  "FIEL",
];

const LiveSportCarousel = () => {
  const { sportCode } = useParams();

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const sports = useSelector(getSportsSelector);

  // Subscribe to the european dashboard live feed
  useLiveData(dispatch, "european-dashboard");

  const europeanDashboardLiveData = useSelector((state) => state.live.liveData["european-dashboard"] || {});

  const sportsTreeData = isNotEmpty(sports)
    ? Object.entries(europeanDashboardLiveData)
        .filter((x) => isNotEmpty(x[1]))
        .map((x) => ({
          code: x[0],
          count: Object.values(x[1]).length,
          desc: isNotEmpty(sports) ? sports[x[0]].description : "",
        }))
    : [];

  // const [scrollIsActive, setScrollIsActive] = useState(false)

  // const containerRef = useScrollStopListener(() => {
  //   console.log('onscrollstop');
  //   setTimeout(() => {
  //     setScrollIsActive(false)
  //   }, 1000);
  // });

  const sportsTreeDataFiltered = useMemo(
    () =>
      // TODO - extract and put fix sports here first (4 of them, even if empty)
      // TODO - extract and sort the sports with count next
      // TODO - extract and sort the empty sports next (hardcoded list with the ones above filtered)

      [
        // Hardcoded sports...
        sportsTreeData.find((x) => x.code === MASTER_SPORTS[0]) ?? {
          code: MASTER_SPORTS[0],
          count: 0,
          desc: isNotEmpty(sports) ? sports[MASTER_SPORTS[0]].description : "",
        },
        sportsTreeData.find((x) => x.code === MASTER_SPORTS[1]) ?? {
          code: MASTER_SPORTS[1],
          count: 0,
          desc: isNotEmpty(sports) ? sports[MASTER_SPORTS[1]].description : "",
        },
        sportsTreeData.find((x) => x.code === MASTER_SPORTS[2]) ?? {
          code: MASTER_SPORTS[2],
          count: 0,
          desc: isNotEmpty(sports) ? sports[MASTER_SPORTS[2]].description : "",
        },
        sportsTreeData.find((x) => x.code === MASTER_SPORTS[3]) ?? {
          code: MASTER_SPORTS[3],
          count: 0,
          desc: isNotEmpty(sports) ? sports[MASTER_SPORTS[3]].description : "",
        },

        // Remaining sports with data...
        ...sportsTreeData
          .filter((x) => x.count > 0 && !MASTER_SPORTS.includes(x.code))
          .sort((a, b) => b.count - a.count),

        // Add all remaining sports as empty...
        ...SECONDARY_LIVE_SPORTS.filter((x) => sportsTreeData.findIndex((y) => y.code === x) === -1)
          .map((x) => ({ code: x, count: 0, desc: isNotEmpty(sports) ? sports[x].description : "" }))
          .sort((a, b) => a.desc.localeCompare(b.desc)),
      ],
    // return getSortedSportTreesBySportsOrder(sportsTreeData, sportsOrder).filter(
    //   (sportTree) => !hiddenSports?.includes(sportTree.code),
    // );
    [sports, sportsTreeData],
  );

  useEffect(() => {
    if (!sportCode && !isEmpty(sportsTreeDataFiltered) && !isEmpty(sportsTreeDataFiltered[0])) {
      history.push(`/live/sport/${sportsTreeDataFiltered[0].code}`);
    }
  }, [sportCode, sportsTreeDataFiltered, history]);

  const onChangeSportHandler = (sportCode) => {
    // if (sportsTreeDataFiltered.find((x) => x.code === sportCode)?.count > 0) {
    history.push(`/live/sport/${sportCode}`);
  };

  if (isEmpty(sports) || isEmpty(sportsTreeDataFiltered)) {
    return (
      <section className={classes["top-level"]}>
        <div className={classes["top-level-sports"]} style={{ display: "flex", justifyContent: "center" }}>
          <FontAwesomeIcon
            className="fa-spin"
            icon={faSpinner}
            size="3x"
            style={{
              "--fa-primary-color": "#00ACEE",
              "--fa-secondary-color": "#E6E6E6",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className={classes["top-level"]}>
      <SimpleBar autoHide>
        <div className={classes["top-level-sports"]}>
          {sportsTreeDataFiltered?.map((sport, index) => (
            <CarouselSportCard
              key={sport.code}
              sport={sport}
              sportCode={sportCode}
              sportCount={sport.count}
              onClick={() => onChangeSportHandler(sport.code)}
            />
          ))}
        </div>
      </SimpleBar>
    </section>
  );
};

LiveSportCarousel.propTypes = propTypes;
LiveSportCarousel.defaultProps = defaultProps;

export default React.memo(LiveSportCarousel);
