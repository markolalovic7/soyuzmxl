import PropTypes from "prop-types";
import React from "react";
import ReactCountryFlag from "react-country-flag";

import HorizontalStripesJersey from "./HorizontalStripesJersey";
import SleevelessHorizontalSplitJersey from "./SleevelessHorizontalSplitJersey";
import SleevelessHorizontalStripesJersey from "./SleevelessHorizontalStripesJersey";
import SleevelessVerticalStripesJersey from "./SleevelessVerticalStripesJersey";
import SquaresJersey from "./SquaresJersey";
import VerticalSplitJersey from "./VerticalSplitJersey";
import VerticalStripesJersey from "./VerticalStripesJersey";

const Jersey = ({
  baseColor,
  countryCode,
  horizontalStripesColor,
  jerseyNumberColor,
  shirtType,
  sleeveColor,
  sleeveDetailColor,
  splitColor,
  squareColor,
  verticalStripesColor,
}) => {
  //
  // base color = bc
  // shirt type = st
  // sleeve color = slc
  // sleeve detail = sdc
  // square color = sqc
  // vertical stripe color = vsc
  // horizontal stripe color = hsc
  // split color = spc

  switch (shirtType) {
    case "short_sleeves":
      if (horizontalStripesColor)
        return (
          <HorizontalStripesJersey
            baseColor={`#${baseColor}`}
            sleeveColor={`#${sleeveColor}`}
            sleeveDetailColor={`#${sleeveDetailColor}`}
            stripesColor={`#${horizontalStripesColor}`}
          />
        );

      if (verticalStripesColor)
        return (
          <VerticalStripesJersey
            baseColor={`#${baseColor}`}
            sleeveColor={`#${sleeveColor}`}
            sleeveDetailColor={`#${sleeveDetailColor}`}
            stripesColor={`#${verticalStripesColor}`}
          />
        );

      if (squareColor)
        return (
          <SquaresJersey
            baseColor={`#${baseColor}`}
            sleeveColor={`#${sleeveColor}`}
            sleeveDetailColor={`#${sleeveDetailColor}`}
            squareColor={`#${squareColor}`}
          />
        );
      if (splitColor)
        return (
          <VerticalSplitJersey
            baseColor={`#${baseColor}`}
            sleeveColor={`#${sleeveColor}`}
            sleeveDetailColor={`#${sleeveDetailColor}`}
            splitColor={`#${splitColor}`}
          />
        );

      if (baseColor) {
        // Assume a flat t-shirt
        return (
          <HorizontalStripesJersey
            baseColor={`#${baseColor}`}
            sleeveColor={sleeveColor ? `#${sleeveColor}` : baseColor ? `#${baseColor}` : undefined}
            sleeveDetailColor={sleeveDetailColor ? `#${sleeveDetailColor}` : baseColor ? `#${baseColor}` : undefined}
            stripesColor={
              horizontalStripesColor ? `#${horizontalStripesColor}` : baseColor ? `#${baseColor}` : undefined
            }
          />
        );
      }

      break;

    case "no_sleeves":
      if (horizontalStripesColor) {
        return (
          <SleevelessHorizontalStripesJersey
            baseColor={`#${baseColor}`}
            sleeveColor={sleeveColor ? `#${sleeveColor}` : baseColor ? `#${baseColor}` : undefined}
            sleeveDetailColor={sleeveDetailColor ? `#${sleeveDetailColor}` : baseColor ? `#${baseColor}` : undefined}
            stripesColor={`#${horizontalStripesColor}`}
          />
        );
      }

      if (verticalStripesColor) {
        return (
          <SleevelessVerticalStripesJersey
            baseColor={`#${baseColor}`}
            sleeveColor={sleeveColor ? `#${sleeveColor}` : baseColor ? `#${baseColor}` : undefined}
            sleeveDetailColor={sleeveDetailColor ? `#${sleeveDetailColor}` : baseColor ? `#${baseColor}` : undefined}
            stripesColor={`#${verticalStripesColor}`}
          />
        );
      }

      if (splitColor) {
        return (
          <SleevelessHorizontalSplitJersey
            baseColor={`#${baseColor}`}
            sleeveColor={sleeveColor ? `#${sleeveColor}` : baseColor ? `#${baseColor}` : undefined}
            sleeveDetailColor={sleeveDetailColor ? `#${sleeveDetailColor}` : baseColor ? `#${baseColor}` : undefined}
            splitColor={`#${splitColor}`}
          />
        );
      }

      if (baseColor) {
        // Assume a flat t-shirt
        return (
          <SleevelessHorizontalSplitJersey
            baseColor={`#${baseColor}`}
            sleeveColor={sleeveColor ? `#${sleeveColor}` : baseColor ? `#${baseColor}` : undefined}
            sleeveDetailColor={sleeveDetailColor ? `#${sleeveDetailColor}` : baseColor ? `#${baseColor}` : undefined}
            splitColor={undefined}
          />
        );
      }

      break;

    case "flag":
      return <ReactCountryFlag svg countryCode={countryCode?.substr(0, 2)} style={{ height: "2em", width: "3em" }} />;

    default:
      // fallback value
      return <HorizontalStripesJersey baseColor="#cccccc" />;
  }

  // fallback value
  return <HorizontalStripesJersey baseColor="#cccccc" />;
};

Jersey.propTypes = {
  baseColor: PropTypes.string.isRequired,
  countryCode: PropTypes.string,
  horizontalStripesColor: PropTypes.string,
  jerseyNumberColor: PropTypes.string,
  shirtType: PropTypes.string.isRequired,
  sleeveColor: PropTypes.string,
  sleeveDetailColor: PropTypes.string,
  splitColor: PropTypes.string,
  squareColor: PropTypes.string,
  verticalStripesColor: PropTypes.string,
};

Jersey.defaultProps = {
  countryCode: undefined,
  horizontalStripesColor: undefined,
  jerseyNumberColor: "transparent",
  sleeveColor: undefined,
  sleeveDetailColor: undefined,
  splitColor: undefined,
  squareColor: undefined,
  verticalStripesColor: undefined,
};

export default React.memo(Jersey);
