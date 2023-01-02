import cx from "classnames";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import classes from "../styles/index.module.scss";

import ResponsiveBetradarVirtualSportsPage from "./ResponsiveBetradarVirtualSportsPage";
import WidgetBetradarVirtualSportsPage from "./WidgetBetradarVirtualSportsPage";

import { getSportsSelector } from "redux/reselect/sport-selector";
import { getSportCode, isResponsiveIntegration, isWidgetTypeIntegration } from "utils/betradar-virtual-utils";

const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
// dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

const BetradarVirtualSportsPage = () => {
  const { feedCode } = useParams();

  const sports = useSelector(getSportsSelector);

  const sportCode = getSportCode(feedCode);

  return (
    <main className={classes["main"]}>
      <div className={classes["virtual-sports"]}>
        <div className={classes["virtual-sports__nav_bar_wrapper"]}>
          <div className={`${classes["virtual-sports__title"]} ${classes["virtual-sports__title_special"]}`}>
            <span className={classes["virtual-sports__icon"]}>
              <i className={cx(classes["qicon-default"], classes[`qicon-${sportCode?.toLowerCase()}`])} />
            </span>
            <span className={classes["virtual-sports__text"]}>
              {sports && sports[sportCode] ? sports[sportCode].description : ""}
            </span>
          </div>

          {feedCode && isWidgetTypeIntegration(feedCode) && <WidgetBetradarVirtualSportsPage feedCode={feedCode} />}
          {feedCode && isResponsiveIntegration(feedCode) && <ResponsiveBetradarVirtualSportsPage feedCode={feedCode} />}
          {/* // <!-- Staging --> */}

          {/* <iframe src={`/vflmstaging/desktop/index?clientid=1430&lang=en&layout=Vflm1`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfncstaging/vfnc/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfwcstaging/vfec/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfasstaging/vfas/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfccstaging/vfcc/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vblstaging/vbl/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vbi/?clientid=1430&lang=en&sport=vbi&platform=desktop&style=betica&channel=0&screen=vbi&oddType=dec`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vtistaging/vti/index?clientid=1430&lang=en&pathprefix=off`} title="Virtual Sports" /> */}

          {/* <!-- Production --> */}

          {/* <iframe src={`/vflm/desktop/index?layout=Vflm1&clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfnc/vfnc/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfwc/vfwc/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfas/vfas/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vfcc/vfcc/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vbl/vbl/index?clientid=1430&lang=en`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vbi/?clientid=1430&lang=en&sport=vbi&platform=desktop&style=betica&channel=0&screen=vbi&oddType=dec`} title="Virtual Sports" /> */}
          {/* <iframe src={`/vti/vti/index?clientid=1430&lang=en&pathprefix=off`} title="Virtual Sports" /> */}
        </div>
      </div>
    </main>
  );
};

export default BetradarVirtualSportsPage;
