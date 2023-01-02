import { faSpinner } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LogoWhite from "applications/betpoint/img/demobet-white.png";
import cx from "classnames";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";

import { login } from "../../../../../redux/slices/authSlice";
import { format12DateHoursMinutes, formatDateWeekDayMonthLong } from "../../../../../utils/dayjs-format";
import classes from "../../../scss/betpoint.module.scss";

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [date, setDate] = useState(formatDateWeekDayMonthLong(dayjs()));
  const [time, setTime] = useState(format12DateHoursMinutes(dayjs()));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false);
  const [isUsernameOnFocus, setIsUsernameOnFocus] = useState(false);
  const [isPasswordOnFocus, setIsPasswordOnFocus] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const [isShiftSelected, setIsShiftSelected] = useState(false);

  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth?.loading);

  useEffect(() => {
    const id = setInterval(() => {
      setDate(formatDateWeekDayMonthLong(dayjs()));
      setTime(format12DateHoursMinutes(dayjs()));
    }, 1000);

    return () => clearInterval(id);
  });

  const onLoginHandler = () => {
    dispatch(
      login({
        isRetail: true,
        password,
        rememberMe: false,
        username,
      }),
    );
  };

  const onKeyInput = (key) => {
    const char = isCapsLock ? key.toUpperCase() : key;

    if (isUsernameOnFocus) {
      setUsername(`${username}${char}`);
    }
    if (isPasswordOnFocus) {
      setPassword(`${password}${char}`);
    }

    setIsShiftSelected(false);
  };

  const onDeleteClick = () => {
    if (isUsernameOnFocus) {
      setUsername(username.slice(0, -1));
    }
    if (isPasswordOnFocus) {
      setPassword(password.slice(0, -1));
    }

    setIsShiftSelected(false);
  };

  const onReturnClick = () => {
    onLoginHandler();
  };

  return (
    <div className={classes["wrapper"]}>
      <div className={classes["homepage"]}>
        <div className={classes["homepage__top"]}>
          <div className={classes["homepage__date"]}>
            <div className={classes["homepage__time"]}>{time}</div>
            <div className={classes["homepage__day"]}>{date}</div>
          </div>
          <div className={classes["homepage__logo"]}>
            <img alt="logo" src={LogoWhite} />
          </div>
          <div className={classes["homepage__information"]} />
        </div>
        <div className={classes["login"]}>
          <div className={classes["login__form"]}>
            <div className={classes["form__content"]}>
              <div className={classes["login__title"]}>
                <span>Account log in</span>
              </div>
              <div className={classes["login__body"]}>
                {error && <div className={cx(classes["login__error"], { [classes["active"]]: !!error })}>{error}</div>}
                <div className={classes["login__inputs"]}>
                  <div className={classes["login__input"]}>
                    <input
                      required
                      className={classes["login-input"]}
                      placeholder={t("enter_username_placeholder")}
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => {
                        setKeyboardIsOpen(true);
                        setIsUsernameOnFocus(true);
                        setIsPasswordOnFocus(false);
                      }}
                    />
                  </div>
                  <div className={classes["login__input"]}>
                    <input
                      required
                      className={classes["login-input"]}
                      placeholder={t("enter_pass_placeholder")}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => {
                        setKeyboardIsOpen(true);
                        setIsUsernameOnFocus(false);
                        setIsPasswordOnFocus(true);
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className={classes["login__buttons"]}>
                <button
                  className={cx(classes["login__button"], classes["login-submit"])}
                  disabled={loading}
                  type="submit"
                  onClick={onLoginHandler}
                >
                  {loading ? (
                    <FontAwesomeIcon className={cx("fa-spin", classes["spinner"])} icon={faSpinner} />
                  ) : (
                    t("login")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={classes["keyboard"]}>
          <div className={cx(classes["keyboard__container"], { [classes["open"]]: keyboardIsOpen })}>
            <ul className={classes["keyboard__list"]}>
              <li className={classes["symbol"]}>
                <div onClick={() => onKeyInput(isShiftSelected ? "~" : "`")}>
                  <span className={classes["off"]}>{isShiftSelected ? "~" : "`"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "`" : "~"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "!" : "1")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "!" : "1"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "1" : "!"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "@" : "2")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "@" : "2"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "2" : "@"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "#" : "3")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "#" : "3"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "3" : "#"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "$" : "4")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "$" : "4"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "4" : "$"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "%" : "5")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "%" : "5"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "5" : "%"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "^" : "6")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "^" : "6"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "6" : "^"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "&" : "7")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "&" : "7"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "7" : "&"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "*" : "8")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "*" : "8"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "8" : "*"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "(" : "9")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "(" : "9"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "9" : "("}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? ")" : "0")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? ")" : "0"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "0" : ")"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "_" : "-")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "_" : "-"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "-" : "_"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "+" : "=")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "+" : "="}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "=" : "+"}</span>
                </div>
              </li>
              <li className={cx(classes["delete"], classes["lastitem"])} onClick={onDeleteClick}>
                <div>delete</div>
              </li>
              <li className={classes["tab"]}>
                <div>tab</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("q")}>
                <div>q</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("w")}>
                <div>w</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("e")}>
                <div>e</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("r")}>
                <div>r</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("t")}>
                <div>t</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("y")}>
                <div>y</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("u")}>
                <div>u</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("i")}>
                <div>i</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("o")}>
                <div>o</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("p")}>
                <div>p</div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "{" : "[")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "{" : "["}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "[" : "{"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "}" : "]")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "}" : "]"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "]" : "}"}</span>
                </div>
              </li>
              <li
                className={cx(classes["symbol"], classes["lastitem"])}
                onClick={() => onKeyInput(isShiftSelected ? "|" : "\\")}
              >
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "|" : "\\"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "\\" : "|"}</span>
                </div>
              </li>
              <li className={classes["capslock"]} onClick={() => setIsCapsLock((prevState) => !prevState)}>
                <div>caps lock</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("a")}>
                <div>a</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("s")}>
                <div>s</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("d")}>
                <div>d</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("f")}>
                <div>f</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("g")}>
                <div>g</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("h")}>
                <div>h</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("j")}>
                <div>j</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("k")}>
                <div>k</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("l")}>
                <div>l</div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? ":" : ";")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? ":" : ";"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? ";" : ":"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? '"' : "'")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? '"' : "'"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "'" : '"'}</span>
                </div>
              </li>
              <li className={cx(classes["return"], classes["lastitem"])} onClick={onReturnClick}>
                <div>return</div>
              </li>
              <li className={classes["left-shift"]} onClick={() => setIsShiftSelected((prevState) => !prevState)}>
                <div>shift</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("z")}>
                <div>z</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("x")}>
                <div>x</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("c")}>
                <div>c</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("v")}>
                <div>v</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("b")}>
                <div>b</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("n")}>
                <div>n</div>
              </li>
              <li className={classes["letter"]} onClick={() => onKeyInput("m")}>
                <div>m</div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "<" : ",")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "<" : ","}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "," : "<"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? ">" : ".")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? ">" : "."}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "." : ">"}</span>
                </div>
              </li>
              <li className={classes["symbol"]} onClick={() => onKeyInput(isShiftSelected ? "?" : "/")}>
                <div>
                  <span className={classes["off"]}>{isShiftSelected ? "?" : "/"}</span>
                  <span className={classes["on"]}>{isShiftSelected ? "/" : "?"}</span>
                </div>
              </li>
              <li
                className={cx(classes["right-shift"], classes["lastitem"])}
                onClick={() => setIsShiftSelected((prevState) => !prevState)}
              >
                <div>shift</div>
              </li>
              <li className={cx(classes["space"], classes["lastitem"])} onClick={() => onKeyInput(" ")}>
                <div>&nbsp;</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
