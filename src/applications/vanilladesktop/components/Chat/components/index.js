import { useState } from "react";
import { useSelector } from "react-redux";

import { getCmsConfigBrandDetails } from "../../../../../redux/reselect/cms-selector";

import ChatButton from "./ChatButton";
import ChatPanel from "./ChatPanel";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const cmsConfigBrandDetails = useSelector(getCmsConfigBrandDetails);

  const {
    data: { chat },
  } = cmsConfigBrandDetails || { data: {} };

  if (!chat) return null;

  return (
    <>
      {!open && <ChatButton onClick={() => setOpen(true)} />}
      {open && <ChatPanel onClose={() => setOpen(false)} />}
    </>
  );
};

export default Chat;
