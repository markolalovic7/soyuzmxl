import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import classes from "applications/vanillamobile/scss/vanillamobilestyle.module.scss";
import { getAuthAccountId } from "redux/reselect/auth-selector";
import {
  clearChatSession,
  endChatSession,
  loadChatSession,
  loadChatSessionMessages,
  postChatMessage,
  startChatSession,
} from "redux/slices/chatSlice";
import { isStringTrimmedEmpty } from "utils/string";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";

const CHAT_MESSAGE_CUSTOMER = "CUSTOMER";
const CHAT_MESSAGE_OPERATOR = "OPERATOR";

const ChatMessage = ({ isCustomer, message, messageTime }) => {
  const { t } = useTranslation();

  return (
    <div className={cx(classes["chat__message"], { [classes["chat__message_operator"]]: !isCustomer })}>
      <div className={cx(classes["chat__name"], { [classes["chat__name_blue"]]: !isCustomer })}>
        <span>{isCustomer ? t("chat.you") : t("chat.customer_service")}</span>
        <div className={classes["chat__time"]}>{`- ${dayjs(messageTime).format("HH:mm:ss")}`}</div>
      </div>
      <p className={classes["chat__text"]}>{message}</p>
    </div>
  );
};
const ChatPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const {
    customerTimeoutWarning,
    endTime: chatEndTime,
    messages: chatMessages,
    sessionId: chatSessionId,
    startTime: chatStartTime,
    startingSession,
  } = useSelector((state) => state.chat) || {};

  const authAccountId = useSelector(getAuthAccountId);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [chatMessages]);

  // If user open the panel and no chat exist, go and create one!
  useEffect(() => {
    if (!chatSessionId) {
      dispatch(startChatSession());
    }
  }, [authAccountId, chatSessionId, dispatch]);

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
        chatSessionId,
        message: {
          message,
          origin: CHAT_MESSAGE_CUSTOMER,
        },
      }),
    );
    setMessage("");
  };

  const endSessionHandler = (event) => {
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
      alert(t("chat.session_ended"));
      history.push("/");
    }
  };

  return (
    <main className={cx(classes["main"], classes["main_chat"])}>
      <h1 className={cx(classes["main__title"], classes["main__title_chat"])}>Chat</h1>

      <h1 className={cx(classes["main__title"], classes["main__title_chat"])}>
        <span>{t("chat.chat")}</span>
        <span className={classes["chat-cross"]} onClick={(e) => endSessionHandler(e)}>
          <FontAwesomeIcon icon={faTimesCircle} />
        </span>
      </h1>
      <div className={classes["chat"]}>
        <div className={classes["chat__body"]}>
          <div className={classes["chat__messages"]}>
            {startingSession && (
              <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
            )}
            {!chatSessionId && (
              <div className={classes["chat__message"]}>
                <div className={classes["chat__name"]}>
                  <span>{t("chat.customer_service")}</span>
                </div>
                <p className={classes["chat__text"]}>{t("chat.no_operators_available")}</p>
              </div>
            )}
            {!startingSession && chatSessionId && (
              <>
                <ChatMessage isCustomer={false} message={t("chat.greeting_question")} messageTime={chatStartTime} />

                {chatMessages &&
                  chatMessages.map((message) => {
                    if (!message?.origin) return null;

                    return (
                      <ChatMessage
                        isCustomer={message.origin === CHAT_MESSAGE_CUSTOMER}
                        key={message.timestamp}
                        message={message.message}
                        messageTime={message.timestamp}
                      />
                    );
                  })}
                {customerTimeoutWarning && (
                  <div className={classes["chat__message"]} key={message.id}>
                    <div className={classes["chat__name"]}>
                      <span>{t("chat.inactivity_alert")}</span>
                    </div>
                    <p className={classes["chat__text"]}>{t("chat.chat_session_inactivity_closing")}</p>
                  </div>
                )}
                {chatEndTime ? (
                  <div className={classes["chat__message"]} key={message.id}>
                    <div className={classes["chat__name"]}>
                      <span>End of Session </span>
                      <div className={classes["chat__time"]}>{`- ${dayjs(chatEndTime).format("HH:mm:ss")}`}</div>
                    </div>
                    <p className={classes["chat__text"]}>{t("chat.session_ended")}</p>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <div className={classes["chat__typing"]}>
            <div className={classes["chat__write"]}>
              <input
                className={classes["chat__input"]}
                disabled={!chatSessionId}
                name="chat__write"
                placeholder={chatSessionId ? t("chat.message_placeholder") : ""}
                type="text"
                value={message}
                onChange={messageChangeHandler}
              />
              <button
                className={cx(classes["chat__button"], { [classes["active"]]: message.length > 0 })}
                disabled={!chatSessionId}
                type="button"
                onClick={submitMessageHandler}
              >
                <svg height="18" viewBox="0 0 20 18" width="20" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <g>
                      <path d="M0 18l20-9L0 0v7l14.286 2L0 11z" />
                    </g>
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
