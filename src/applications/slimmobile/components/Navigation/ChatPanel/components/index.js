import classes from "applications/slimmobile/scss/slimmobilestyle.module.scss";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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

import { CHAT_MESSAGE_CUSTOMER, CHAT_MESSAGE_OPERATOR } from "../constants";
import cx from "classnames";
import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const propTypes = {
  backdropClick: PropTypes.func.isRequired,
  chatDrawerClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const defaultProps = {};

const ChatPanel = ({ backdropClick, chatDrawerClose, open }) => {
  const { t } = useTranslation();
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
    if (open && !chatSessionId) {
      dispatch(startChatSession());
    }
  }, [authAccountId, chatSessionId, dispatch, open]);

  // Refresh session messages...
  useEffect(() => {
    let intervalId = null;
    if (open && chatSessionId) {
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
  }, [authAccountId, chatSessionId, dispatch, open]);

  // Refresh session conditions...
  useEffect(() => {
    let intervalId = null;
    if (open && chatSessionId) {
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
  }, [authAccountId, chatSessionId, dispatch, open]);

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
    }
  };

  const closeHandler = (event) => {
    chatDrawerClose();
    endSessionHandler(event);
  };

  return (
    <div className={`${classes.chat} ${open ? classes.active : ""}`} onMouseUp={backdropClick}>
      <div className={`${classes["chat__container"]} ${open ? classes.active : ""}`}>
        <div className={classes["chat__title"]}>
          <h2>{t("chat.chat")}</h2>
          <span className={classes["chat__cross"]} id="chat-cross" onClick={closeHandler} />
        </div>
        <div className={classes["chat__body"]}>
          <div className={classes["chat__messages"]}>
            {startingSession ? (
              <div className={classes["chat-spinner"]}>
                <div className={classes["inner"]}>
                  <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} size="3x" />
                </div>
              </div>
            ) : !chatSessionId ? (
              <div className={classes["chat__message"]}>
                <div className={classes["chat__name"]}>
                  <span>{t("chat.customer_service")}</span>
                </div>
                <p className={classes["chat__text"]}>{t("chat.no_operators_available")}</p>
              </div>
            ) : (
              <>
                <div className={classes["chat__message"]}>
                  <div className={classes["chat__name"]}>
                    <span>{t("chat.customer_service")}</span>
                    <div className={classes["chat__time"]}>{`- ${dayjs(chatStartTime).format("HH:mm:ss")}`}</div>
                  </div>
                  <p className={classes["chat__text"]}>{t("chat.greeting_question")}</p>
                </div>
                {chatMessages &&
                  chatMessages.map((message) => {
                    if (message.origin === CHAT_MESSAGE_CUSTOMER) {
                      return (
                        <div className={classes["chat__message"]} key={message.id}>
                          <div className={`${classes["chat__name"]} ${classes["chat__name_blue"]}`}>
                            <span>{t("chat.you")}</span>
                            <div className={classes["chat__time"]}>
                              {`- ${dayjs(message.timestamp).format("HH:mm:ss")}`}
                            </div>
                          </div>
                          <p className={classes["chat__text"]}>{message.message}</p>
                        </div>
                      );
                    }
                    if (message.origin === CHAT_MESSAGE_OPERATOR) {
                      return (
                        <div className={classes["chat__message"]} key={message.id}>
                          <div className={classes["chat__name"]}>
                            <span>{t("chat.customer_service")}</span>
                            <div className={classes["chat__time"]}>
                              {`- ${dayjs(message.timestamp).format("HH:mm:ss")}`}
                            </div>
                          </div>
                          <p className={classes["chat__text"]}>{message.message}</p>
                        </div>
                      );
                    }

                    return null;
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
          <div className={classes["chat__write"]}>
            <input
              autoComplete="off"
              disabled={!chatSessionId}
              name="chat__write"
              placeholder={t("chat.message_placeholder")}
              type="text"
              value={message}
              onChange={messageChangeHandler}
            />
            <button
              alt="chat-arrow"
              className={classes["chat__button"]}
              disabled={!chatSessionId}
              type="button"
              onClick={submitMessageHandler}
            >
              <svg height="18" viewBox="0 0 20 18" width="20" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M0 18l20-9L0 0v7l14.286 2L0 11z" fill="#f7e671" />
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ChatPanel.propTypes = propTypes;
ChatPanel.defaultProps = defaultProps;

export default ChatPanel;
