import originalAxios from "axios";

const sendToPrinter = async (data) => {
  if (typeof window.java !== "undefined") {
    // RingFence
    return window.java.print(data);
  }

  console.log(data);

  // BridgeSocket
  try {
    // This is basically the user's localhost (with a change in /etc/hosts). Please check the Ringfence or BridgeSocket docs for more details
    await originalAxios.post("https://bridgesocket.platform8.software:8889/print", data);

    return {
      result: true,
    };
  } catch (err) {
    return {
      result: false,
    };
  }
};

//
export const EPOS = (function () {
  const ESCP2 = String.fromCharCode(0x1b); // "><1B";
  const GS = String.fromCharCode(0x1d); // "><1D";

  const UNDERLINE_ON = `${ESCP2}-${String.fromCharCode(0x01)}`; // `${ESCP2}-><01`;
  const UNDERLINE_OFF = `${ESCP2}-${String.fromCharCode(0x00)}`; // `${ESCP2}-><00`;
  const BOLD_ON = `${ESCP2}E${String.fromCharCode(0x01)}`; // `${ESCP2}E><01`;
  const BOLD_OFF = `${ESCP2}E${String.fromCharCode(0x00)}`; // `${ESCP2}E><00`;

  const FONT_SIZE_RESET = `${GS}!${String.fromCharCode(0x00)}`; // `${GS}!><00`;

  const FONT_SIZE_SMALL_ON = `${ESCP2}M${String.fromCharCode(0x01)}`; // `${ESCP2}M><01`;
  const FONT_SIZE_SMALL_OFF = `${ESCP2}M${String.fromCharCode(0x00)}`; // `${ESCP2}M><00`;

  const FONT_SIZE_LARGE_ON = `${GS}!${String.fromCharCode(0x11)}`; // `${GS}!><11`;
  const FONT_SIZE_LARGE_OFF = `${GS}!${String.fromCharCode(0x00)}`; // `${GS}!><00`;

  const PAPER_CUT = `${ESCP2}m`;

  const JUSTIFY_LEFT = `${ESCP2}a${String.fromCharCode(0x00)}`; // `${ESCP2}a><00`;
  const JUSTIFY_CENTRE = `${ESCP2}a${String.fromCharCode(0x01)}`; // `${ESCP2}a><01`;

  const CRLF = "\r\n";

  const SMALL_WIDTH = 54;
  const NORMAL_WIDTH = 41;
  const LARGE_WIDTH = 21;

  // Line Splitter Function
  // copyright Stephen Chapman, 19th April 2006
  // you may copy this code but please keep the copyright notice as well
  const splitLine = function (str, len) {
    const lines = [];
    const s = str;

    while (str.length > len) {
      const c = str.substring(0, len);
      let d = c.lastIndexOf(" ");
      const e = c.lastIndexOf("\n");
      if (e !== -1) {
        d = e;
      }

      if (d === -1) {
        d = len;
      }
      lines.push(c.substring(0, d));
      str = str.substring(d + 1);
    }
    lines.push(str);

    return lines;
  };

  const wordwrap = function (str, width) {
    const cut = false;

    if (!str) {
      return str;
    }

    const regex = new RegExp(`(.{${width}})`);

    const lines = str.split(regex).filter((x) => x.length > 0);

    return lines;

    // const regex = `.{1,${width}}(\\s|$)${cut ? `|.{${width}}|.+$` : "|\\S+?(\\s|$)"}`;
    //
    // return str.match(RegExp(regex, "g"));
  };

  const j = function (d) {
    if (d === undefined) {
      d = "";
    }

    // If there is exactly 1 pipe character in the string...
    if (d.split("|").length - 1 === 1) {
      // We can assume that the pipe character is indicating that we want the left part to be
      // left aligned and the second part to the right aligned.
      //
      // "ABCD|XYZ"
      //
      // would render to:
      //
      // ---------------------------------------------------
      // ABCD                                            XYZ
      //
      // We also need to worry about wrapping long lines. For example:
      //
      // "This is a long line that should wrap around automatically. It should break \
      // on spaces, hyphens, and other punctuation.|XYZ"
      //
      // would render to:
      // ---------------------------------------------------
      // This is a long line that should wrap around
      // automatically. It should break on spaces, hyphens,
      // and other punctuation.                          XYZ

      // 1. Replace the | character with something non-printable
      d = d.replace("|", String.fromCharCode(0x00));
    }

    d = d.replace(/&pipe;/g, "|");

    // Now we need to split the string into lines

    let width = NORMAL_WIDTH;
    switch (size) {
      case 1:
        width = SMALL_WIDTH;
        break;
      case 3:
        width = LARGE_WIDTH;
        break;
    }

    const lines = wordwrap(d, width);
    if (!lines) {
      d += CRLF;
    } else {
      d = "";

      for (let i = 0; i < lines.length; i++) {
        d = d + lines[i].replace(String.fromCharCode(0x00), Array(width - (lines[i].length - 1)).join(" ")) + CRLF;
      }
    }

    return d;
  };

  let data = "";
  let size = 2; // 1 = Small, 2 = Normal, 3 = Large

  return {
    LARGE_WIDTH() {
      return LARGE_WIDTH;
    },
    NORMAL_WIDTH() {
      return NORMAL_WIDTH;
    },
    SMALL_WIDTH() {
      return SMALL_WIDTH;
    },
    barcode(d) {
      data += JUSTIFY_CENTRE;
      data = `${data + ESCP2}$${String.fromCharCode(0x08)}${String.fromCharCode(0x00)}`; // horizontal position
      data = `${data + GS}h${String.fromCharCode(0x50)}`; // height
      data = `${data + GS}w${String.fromCharCode(0x03)}`; // width
      data = `${data + GS}H${String.fromCharCode(0x02)}`; // print hri below the barcode
      data = `${data + GS}k${String.fromCharCode(0x45)}`; // turn on barcode printing
      data += String.fromCharCode(d.length); // character length needs to be in byte value not string value
      data = data + d + JUSTIFY_LEFT + CRLF;
    },
    bold(d) {
      if (d === undefined) d = "";
      const oldSize = size;
      size = 2;
      data = data + BOLD_ON + j(d) + BOLD_OFF;
      size = oldSize;
    },
    centre() {
      data += JUSTIFY_CENTRE;
    },
    dashedLine() {
      data = data + Array(NORMAL_WIDTH).join("-") + CRLF;
    },
    decode() {
      let str = "";

      for (let i = 0; i < data.length; i++) {
        const ch = data.charCodeAt(i);
        if (ch >= 32 && ch < 127) {
          str += data[i];
        } else if (ch === 13) {
          str += "\\r" + "\r";
        } else if (ch === 10) {
          str += "\\n" + "\n";
        } else if (ch === 27) {
          str += "{ESCP}";
        } else if (ch === 29) {
          str += "{GS}";
        } else {
          str += `{${data[i]}}`;
        }
      }

      return str;
    },
    header(d) {
      data = data + BOLD_ON + UNDERLINE_ON + j(d) + UNDERLINE_OFF + BOLD_OFF;
    },
    large(d) {
      if (d === undefined) d = "";
      const oldSize = size;
      size = 3;
      data = data + FONT_SIZE_LARGE_ON + j(d) + FONT_SIZE_LARGE_OFF;
      size = oldSize;
    },
    left() {
      data += JUSTIFY_LEFT;
    },
    medium(d) {
      if (d === undefined) d = "";
      const oldSize = size;
      size = 2.5;
      data = data + FONT_SIZE_LARGE_ON + j(d) + FONT_SIZE_LARGE_OFF;
      size = oldSize;
    },
    paperCut() {
      data += PAPER_CUT;
    },

    print() {
      return sendToPrinter(data);
    },
    printLast() {
      // TODO
      const betslipReference = localStorage.getItem("LAST_TICKET_REF");
      const lastData = localStorage.getItem("LAST_TICKET");
      if (betslipReference && lastData && lastData.length > 0) {
        return sendToPrinter(lastData);
      }

      return "No last ticket found.";
    },
    reset() {
      data = `${ESCP2}@`; // Initialise device
      data = `${data + GS}L${String.fromCharCode(0x05)}${String.fromCharCode(0x00)}`; // Indent left margin
    },
    small(d) {
      if (d === undefined) d = "";
      const oldSize = size;
      size = 1;
      data = data + FONT_SIZE_SMALL_ON + j(d) + FONT_SIZE_SMALL_OFF;
      size = oldSize;
    },
    text(d) {
      if (d === undefined) d = "";
      const oldSize = size;
      size = 2;
      data += j(d);
      size = oldSize;
    },
    underLine(d) {
      data = data + UNDERLINE_ON + j(d) + UNDERLINE_OFF;
    },
    underscoreLine() {
      data = data + Array(NORMAL_WIDTH).join("_") + CRLF;
    },
  };
})();
