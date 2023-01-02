import { faTimes, faWindowMinimize } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "applications/vanilladesktop/scss/vanilladesktop.module.scss";
import NoOpImg from "assets/img/chat/livechat-noOp.png";
import cx from "classnames";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getAuthAccountId } from "../../../../../../redux/reselect/auth-selector";
import {
  clearChatSession,
  endChatSession,
  loadChatSession,
  loadChatSessionMessages,
  postChatMessage,
  startChatSession,
} from "../../../../../../redux/slices/chatSlice";
import { isStringTrimmedEmpty } from "../../../../../../utils/string";
import { CHAT_MESSAGE_CUSTOMER } from "../../../../../slimmobile/components/Navigation/ChatPanel/constants";

const ChatErrorComponent = ({ s }) => (
  <>
    <div className={classes["chat-error-content"]}>
      <div className={classes["chat-no-operator"]}>
        <img alt="No Operator" src={NoOpImg} />
      </div>
      <div className={classes["chat-no-operator-message"]}>{s}</div>
    </div>
    <div className={classes["chat-bottom"]}>
      <button className={cx(classes["chat-button"], classes["chat-error-button"])} type="button">
        Try Again!
      </button>
    </div>
  </>
);

ChatErrorComponent.propTypes = { s: PropTypes.string.isRequired };

const ChatConversationComponent = ({}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const {
    customerTimeoutWarning,
    endTime: chatEndTime,
    sessionId: chatSessionId,
    startTime: chatStartTime,
    startingSession,
  } = useSelector((state) => state.chat) || {};

  const chatMessages = useSelector((state) => state.chat.messages);

  const authAccountId = useSelector(getAuthAccountId);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [chatMessages]);

  // Refresh session messages...
  useEffect(() => {
    let intervalId = null;
    if (chatSessionId) {
      intervalId = setInterval(() => {
        dispatch(
          loadChatSessionMessages({
            chatSessionId,
          }),
        );
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [authAccountId, chatSessionId, dispatch]);

  // Refresh session conditions...
  useEffect(() => {
    let intervalId = null;
    if (chatSessionId) {
      intervalId = setInterval(() => {
        dispatch(
          loadChatSession({
            chatSessionId,
          }),
        );
      }, 10000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [authAccountId, chatSessionId, dispatch]);

  const messageChangeHandler = (event) => {
    event.preventDefault();
    setMessage(event.target.value);
  };

  const submitMessageHandler = (event) => {
    event.preventDefault();
    if (isStringTrimmedEmpty(message)) {
      return;
    }
    dispatch(
      postChatMessage({
        message: {
          message,
          origin: CHAT_MESSAGE_CUSTOMER,
        },
      }),
    );
    setMessage("");
  };

  const handleKeypress = (e) => {
    // it triggers by pressing the enter key
    if (e.key === "Enter") {
      submitMessageHandler(e);
    }
  };

  return (
    <>
      <div className={classes["chat-subheading"]}>CUSTOMER SUPPORT</div>
      <div className={classes["chat-scroll-div"]}>
        <div className={classes["chat-messages"]}>
          <div className={classes["chat-messages-container"]}>
            <div className={classes["chat-message"]}>
              <div className={classes["chat-message-OPERATOR"]}>
                <div className={classes["chat-message-image-holder"]}>
                  <span className={classes["chat-message-image"]} />
                </div>
                <div className={classes["chat-message-body"]}>
                  <span className={classes["chat-message-name"]}>{t("chat.customer_service")}</span>
                  <div className={classes["chat-message-content"]}>{t("chat.greeting_question")}</div>
                </div>
              </div>
            </div>
            {chatMessages?.map((message, index) => {
              if (!message.origin) return null;
              const isCustomer = message.origin === CHAT_MESSAGE_CUSTOMER;

              return (
                <div className={classes["chat-message"]} key={index}>
                  <div className={classes[`chat-message-${isCustomer ? "CUSTOMER" : "OPERATOR"}`]}>
                    <div className={classes["chat-message-image-holder"]}>
                      <span className={classes["chat-message-image"]} />
                    </div>
                    <div className={classes["chat-message-body"]}>
                      <span className={classes["chat-message-name"]}>
                        {isCustomer ? "Me" : t("chat.customer_service")}
                      </span>
                      <div className={classes["chat-message-content"]}>{message.message}</div>
                      {index === chatMessages.length - 1 && <div ref={messagesEndRef} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={classes["chat-bottom"]}>
        <form className={classes["chat-form"]}>
          <textarea
            className={classes["chat-input"]}
            maxLength="1000"
            placeholder="Message"
            type="text"
            value={message}
            onChange={messageChangeHandler}
            onKeyPress={handleKeypress}
          />
          <input
            className={cx(classes["chat-button-submit"], { [classes["chat-button-disabled"]]: !chatSessionId })}
            type="submit"
            value="Send"
            onClick={submitMessageHandler}
          />
        </form>
      </div>
    </>
  );
};

ChatConversationComponent.propTypes = {};

const propTypes = {
  onClose: PropTypes.func.isRequired,
};

const ChatPanel = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const authAccountId = useSelector(getAuthAccountId);

  const { endTime: chatEndTime, sessionId: chatSessionId, startingSession } = useSelector((state) => state.chat) || {};

  // If user open the panel and no chat exist, go and create one!
  useEffect(() => {
    if (!chatSessionId) {
      dispatch(startChatSession());
    }
  }, [authAccountId, chatSessionId, dispatch]);

  const closeHandler = (event) => {
    event.preventDefault();
    if (chatSessionId) {
      if (chatEndTime) {
        dispatch(clearChatSession());
      } else {
        dispatch(
          endChatSession({
            chatSessionId,
          }),
        );
      }
    }
    onClose();
  };

  return (
    <div className={classes["chat-container"]}>
      <div className={classes["chat-header"]}>
        <div className={classes["chat-header-minimize"]} onClick={onClose}>
          <FontAwesomeIcon icon={faWindowMinimize} />
        </div>
        <span>Live chat with us</span>
        <div className={classes["chat-options"]} onClick={closeHandler}>
          <div className={classes["chat-header-close"]}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      </div>
      <div className={classes["chat-body"]}>
        {!chatSessionId && !startingSession && <ChatErrorComponent s={t("chat.no_operators_available")} />}
        {chatSessionId && <ChatConversationComponent />}
      </div>
    </div>
  );
};

ChatPanel.propTypes = propTypes;

export default ChatPanel;
