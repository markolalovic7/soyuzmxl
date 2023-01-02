import React, { useState } from "react";

import HeaderSlider from "./HeaderSlider";
import MenuTree from "./MenuTree";

const Header = () => {
  const [navigationTreeOpen, setNavigationTreeOpen] = useState(false);

  React.useEffect(() => {
    window.parent.postMessage(
      {
        action: "app.scroll_lock",
        code: navigationTreeOpen ? "LOCK" : "UNLOCK",
      },
      "*",
    );
  }, [navigationTreeOpen]);

  return (
    <>
      <MenuTree navigationTreeOpen={navigationTreeOpen} setNavigationTreeOpen={setNavigationTreeOpen} />
      <HeaderSlider setNavigationTreeOpen={setNavigationTreeOpen} />
    </>
  );
};

export default Header;
