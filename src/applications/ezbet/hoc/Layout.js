import cx from "classnames";
import dayjs from "dayjs";
import isEmpty from "lodash.isempty";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Breakpoint, useCurrentBreakpointName } from "react-socks";
import useScrollLock from "use-scroll-lock";

import { getAuthIsIframe } from "../../../redux/reselect/auth-selector";
import { makeGetBetslipOutcomeIds, makeGetBetslipSubmitConfirmation } from "../../../redux/reselect/betslip-selector";
import {
  getCmsLayoutMobileEZDashboardWidgetFooterMenu,
  getCmsLayoutMobileEZDashboardWidgetImageCarousel,
} from "../../../redux/reselect/cms-layout-widgets";
import { isNotEmpty } from "../../../utils/lodash";
import { getPatternHome } from "../../../utils/route-patterns";
import BetslipModal from "../components/BetslipModal/BetslipModal";
import { useEZSwipeable } from "../hooks/swipe-hooks";

import BarsLight from "applications/ezbet/img/icons/bars-light.svg";
import betslipIconOrange from "applications/ezbet/img/icons/betslip-icon-orange.svg";
import betslipIcon from "applications/ezbet/img/icons/betslip-icon.svg";
import CuracaoEgaming from "applications/ezbet/img/icons/curacao-egaming.svg";
import EzbetBigLogo from "applications/ezbet/img/icons/ezbet-logo.svg";
import FooterLogo from "applications/ezbet/img/icons/footer-logo.svg";
import Logo1 from "applications/ezbet/img/icons/logo1.svg";
import Logo2 from "applications/ezbet/img/icons/logo2.svg";
import Logo3 from "applications/ezbet/img/icons/logo3.svg";
import Logo4 from "applications/ezbet/img/icons/logo4.svg";
import Logo5 from "applications/ezbet/img/icons/logo5.svg";
import Logo6 from "applications/ezbet/img/icons/logo6.svg";
import Logo7 from "applications/ezbet/img/icons/logo7.svg";
import Logo8 from "applications/ezbet/img/icons/logo8.svg";
import UserCircleSolid from "applications/ezbet/img/icons/user-circle-solid.svg";
import Logo from "applications/ezbet/img/logo.svg";
import classes from "applications/ezbet/scss/ezbet.module.scss";

const FloatingBetslipButton = ({ betslipOutcomeIds, onOpen }) => {
  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);

  return (
    <footer>
      {(isNotEmpty(betslipOutcomeIds) || activeBetCount > 0) && (
        <button
          className={cx(classes["betslip"], classes["link"], {
            [classes["betslip-orange"]]: isEmpty(betslipOutcomeIds) && activeBetCount > 0,
          })}
          id="betslip"
          type="button"
          onClick={() => onOpen()(isEmpty(betslipOutcomeIds) && activeBetCount > 0)}
        >
          <div className={classes["relative"]}>
            {isEmpty(betslipOutcomeIds) && activeBetCount > 0 ? (
              <img alt="colored ezbet" className={classes["betslip-icon"]} src={betslipIconOrange} />
            ) : (
              <img alt="colored ezbet" className={classes["betslip-icon"]} src={betslipIcon} />
            )}
            <span className={classes["absolute"]}>
              {isNotEmpty(betslipOutcomeIds) ? betslipOutcomeIds?.length : activeBetCount}
            </span>
          </div>
        </button>
      )}
      <span className={classes["icon-uniE92B"]} />
      <p>
        도박은 중독 될 수 있습니다.
        <br /> 베팅에 대한 균형과 절제, 책임감이 필요합니다.
      </p>
    </footer>
  );
};

FloatingBetslipButton.propTypes = { betslipOutcomeIds: PropTypes.array.isRequired, onOpen: PropTypes.func.isRequired };

const Footer = ({ betslipOutcomeIds, onOpen }) => {
  const footerImageCarousel = useSelector(getCmsLayoutMobileEZDashboardWidgetImageCarousel);
  const footerMenuWidget = useSelector(getCmsLayoutMobileEZDashboardWidgetFooterMenu);
  const [showList1, setShowList1] = useState(false);
  const [showList2, setShowList2] = useState(false);
  const [showList3, setShowList3] = useState(false);

  const { swipeHandlers } = useEZSwipeable();

  const onNotifyFooterActionHandler = (action) => {
    window.parent.postMessage(
      {
        action: "app.ez.footer.menu.action",
        code: action,
      },
      "*",
    );
  };

  return (
    <section {...swipeHandlers} className={cx(classes["footer"], { [classes["iframe"]]: false })}>
      <Breakpoint customQuery="(max-width: 673px)">
        <div className={classes["add-wrapper"]}>
          <div className={classes["add"]} onClick={() => setShowList1(!showList1)}>
            <span>베팅규정 및 서비스 안내</span>
            <i className={classes[`${!showList1 ? "icon-plus-light" : "icon-minus-light"}`]} />
          </div>
          {showList1 && (
            <ul>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.EZ_BETTING_RULES")}>
                <p>
                  <span>이지벳 베팅규정</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SPORTS_BETTING_RULES")}>
                <p>
                  <span>스포츠 베팅규정 (링크)</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SPORTS_RESULTS")}>
                <p>
                  <span>스포츠 경기결과 (링크)</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("INFO.MEMBERSHIP_BENEFITS")}>
                <p>
                  <span>회원 등급별 주요 혜택 안내</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.GAME_USAGE_GUIDE")}>
                <p>
                  <span>게임 이용 가이드 (전체 게임 / 각게임 이용안내 페이지 완료후 취합)</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SITE_USAGE_GUIDE")}>
                <p>
                  <span>사이트 이용 가이드 ( 천천히 )</span>
                </p>
              </li>
            </ul>
          )}
          <div className={classes["add"]} onClick={() => setShowList2(!showList2)}>
            <span>이용약관 및 소개</span>
            <i className={classes[`${!showList2 ? "icon-plus-light" : "icon-minus-light"}`]} />
          </div>
          {showList2 && (
            <ul>
              <li onClick={() => onNotifyFooterActionHandler("TERMS.TERMS_OF_USE")}>
                <p>
                  <span>이용약관</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("TERMS.RESPONSIBLE_GAME")}>
                <p>
                  <span>건전한 게임 문화</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("TERMS.PRIVACY")}>
                <p>
                  <span>개인 정보 보안정책</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("INFO.COMPANY_INTRO")}>
                <p>
                  <span>회사소개 ( 선택 )</span>
                </p>
              </li>
            </ul>
          )}
        </div>
      </Breakpoint>

      <Breakpoint customQuery="(min-width: 674px) and (max-width: 1023px)">
        <div className={classes["add-wrapper"]}>
          <div className={classes["add"]} onClick={() => setShowList1(!showList1)}>
            <span>베팅규정</span>
            <i className={classes[`${!showList1 ? "icon-plus-light" : "icon-minus-light"}`]} />
          </div>
          {showList1 && (
            <ul>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.EZ_BETTING_RULES")}>
                <p className={cx(classes["links"])}>
                  <span>이지벳 베팅규정</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SPORTS_BETTING_RULES")}>
                <p className={cx(classes["links"])}>
                  <span>스포츠 베팅규정 (링크)</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SPORTS_RESULTS")}>
                <p className={cx(classes["links"])}>
                  <span>스포츠 경기결과 (링크)</span>
                </p>
              </li>
            </ul>
          )}
          <div className={classes["add"]} onClick={() => setShowList3(!showList3)}>
            <span>서비스 안내</span>
            <i className={classes[`${!showList3 ? "icon-plus-light" : "icon-minus-light"}`]} />
          </div>
          {showList3 && (
            <ul>
              <li onClick={() => onNotifyFooterActionHandler("INFO.MEMBERSHIP_BENEFITS")}>
                <p className={cx(classes["links"])}>
                  <span>회원 등급별 주요 혜택 안내</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("INFO.GAME_USAGE_GUIDE")}>
                <p className={cx(classes["links"])}>
                  <span>게임 이용 가이드 (전체 게임 / 각게임 이용안내 페이지 완료후 취합)</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("INFO.SITE_USAGE_GUIDE")}>
                <p className={cx(classes["links"])}>
                  <span>사이트 이용 가이드 ( 천천히 )</span>
                </p>
              </li>
            </ul>
          )}
          <div className={classes["add"]} onClick={() => setShowList2(!showList2)}>
            <span>이용약관 및 소개</span>
            <i className={classes[`${!showList2 ? "icon-plus-light" : "icon-minus-light"}`]} />
          </div>
          {showList2 && (
            <ul>
              <li onClick={() => onNotifyFooterActionHandler("TERMS.TERMS_OF_USE")}>
                <p className={cx(classes["links"])}>
                  <span>이용약관</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("TERMS.RESPONSIBLE_GAME")}>
                <p className={cx(classes["links"])}>
                  <span>책임감 있는 게임 이용</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("TERMS.PRIVACY")}>
                <p className={cx(classes["links"])}>
                  <span>개인 정보 보호</span>
                </p>
              </li>
              <li onClick={() => onNotifyFooterActionHandler("INFO.COMPANY_INTRO")}>
                <p className={cx(classes["links"])}>
                  <span>자금 세탁 방지 정책</span>
                </p>
              </li>
            </ul>
          )}
        </div>
      </Breakpoint>

      <Breakpoint customQuery="(min-width: 1024px)">
        <div className={classes["desktop-footer-links-wrapper"]}>
          <div className={classes["desktop-links"]}>
            <div>
              <ul>
                <li>
                  <p>
                    <span>베팅규정</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.EZ_BETTING_RULES")}>
                  <p className={cx(classes["links"])}>
                    <span>이지벳 베팅규정</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SPORTS_BETTING_RULES")}>
                  <p className={cx(classes["links"])}>
                    <span>스포츠 베팅규정</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("BETTING_RULES.SPORTS_RESULTS")}>
                  <p className={cx(classes["links"])}>
                    <span>스포츠 경기결과</span>
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <p>
                    <span>서비스 안내</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("INFO.MEMBERSHIP_BENEFITS")}>
                  <p className={cx(classes["links"])}>
                    <span>회원 등급별 주요 혜택 안내</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("INFO.GAME_USAGE_GUIDE")}>
                  <p className={cx(classes["links"])}>
                    <span>게임 이용 가이드</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("INFO.SITE_USAGE_GUIDE")}>
                  <p className={cx(classes["links"])}>
                    <span>사이트 이용 가이드</span>
                  </p>
                </li>
              </ul>
            </div>
            <div>
              <ul>
                <li>
                  <p>
                    <span>이용약관 및 소개</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("TERMS.TERMS_OF_USE")}>
                  <p className={cx(classes["links"])}>
                    <span>이용약관</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("TERMS.RESPONSIBLE_GAME")}>
                  <p className={cx(classes["links"])}>
                    <span>건전한 게임 문화</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("TERMS.PRIVACY")}>
                  <p className={cx(classes["links"])}>
                    <span>개인 정보 보안정책</span>
                  </p>
                </li>
                <li onClick={() => onNotifyFooterActionHandler("TERMS.ANTI_MONEY_LAUNDERING")}>
                  <p className={cx(classes["links"])}>
                    <span>자금 세탁 방지 정책</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className={classes["desktop-logo"]}>
            <div className={classes["big-logos"]}>
              <img alt="logo2" src={EzbetBigLogo} />
              <img alt="logo1" src={CuracaoEgaming} />
            </div>
            <div>
              <span className={classes["icon-uniE92B"]} />
              <p>
                도박은 중독 될 수 있습니다.
                <br /> 베팅에 대한 균형과 절제, 책임감이 필요합니다.
              </p>
            </div>
          </div>
        </div>
      </Breakpoint>

      <Breakpoint customQuery="(max-width: 1023px)">
        <div className={classes["footer-links"]}>
          <i>
            <img alt="colored-ezbet" src={FooterLogo} />
          </i>
          <div>
            <div className={classes["txt-underline"]} onClick={() => onNotifyFooterActionHandler("LOGOUT")}>
              <p>로그아웃</p>
            </div>
            <div className={classes["txt-underline"]} onClick={() => onNotifyFooterActionHandler("SERVICE_CENTER")}>
              <p>고객센터</p>
            </div>
          </div>
        </div>
      </Breakpoint>

      <div className={classes["footer-logos"]}>
        <div className={classes["footer-logos-track"]}>
          <i className={classes["slide-logo"]}>
            <img alt="" height="26px" src={Logo1} width="24px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="16px" src={Logo2} width="88px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="15px" src={Logo3} width="115px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="25px" src={Logo4} width="135px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="34px" src={Logo5} width="32px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="47px" src={Logo6} width="109px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="18px" src={Logo7} width="98px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="47px" src={Logo8} width="112px" />
          </i>
        </div>
        <div className={cx(classes["footer-logos-track"], classes["delay"])}>
          <i className={classes["slide-logo"]}>
            <img alt="" height="26px" src={Logo1} width="24px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="16px" src={Logo2} width="88px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="15px" src={Logo3} width="115px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="25px" src={Logo4} width="135px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="34px" src={Logo5} width="32px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="47px" src={Logo6} width="109px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="18px" src={Logo7} width="98px" />
          </i>
          <i className={classes["slide-logo"]}>
            <img alt="" height="47px" src={Logo8} width="112px" />
          </i>
        </div>
      </div>

      <Breakpoint customQuery="(max-width: 1023px)">
        <FloatingBetslipButton betslipOutcomeIds={betslipOutcomeIds} onOpen={onOpen} />
      </Breakpoint>
      <Breakpoint customQuery="(min-width: 1024px)">
        <div className={classes["copyright"]}>
          <small>
            ezbet.com은 Fortune B.V.에서 운영하며 등록번호는 147341입니다.  등록 주소는 Fransche Bloemweg 4, Curacao 이며 게이밍 라이센스 번호는 1668/JAZ 입니다. 책임감있는 플레이 부탁 드립니다.
          </small>
          <p>{`Copyright © ${dayjs().format("YYYY")}. EZBET. All Rights Reserved. `}</p>
        </div>
      </Breakpoint>
    </section>
  );
};

Footer.propTypes = { betslipOutcomeIds: PropTypes.array.isRequired, onOpen: PropTypes.func.isRequired };

const MockHeader = () => (
  <div className={classes["header-wrapper"]}>
    <header className={classes["header"]}>
      <div className={classes["left"]}>
        <i>
          <img alt="" src={BarsLight} />
        </i>
      </div>
      <Link className={classes["logo"]} to={getPatternHome()}>
        <i>
          <img alt="" src={Logo} />
        </i>
      </Link>
      <div className={cx(classes["right"], classes["user"])}>
        <i>
          <img alt="" src={UserCircleSolid} />
        </i>
      </div>
    </header>
    <div className={classes["header-tabs"]}>
      <ul className={classes["header-tabs-items"]} id="header-tabs-items">
        <li className={cx(classes["link"], classes["link-active"])}>
          <p>MY</p>
        </li>
        <li className={classes["link"]}>
          <p>충전/환전</p>
        </li>
        <li className={classes["link"]}>
          <p>충전/환전</p>
        </li>
        <li className={classes["link"]}>
          <p>스포츠</p>
        </li>
        <li className={classes["link"]}>
          <p>라이브스포츠</p>
        </li>
        <li className={classes["link"]}>
          <p>라이브카지노</p>
        </li>
      </ul>
    </div>
    <hr className={classes["separator"]} />
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();

  const isInIframe = useSelector(getAuthIsIframe);
  const isLive = location.pathname.startsWith("/live");
  const isPrematch = !isLive;

  const getBetslipOutcomeIds = useMemo(makeGetBetslipOutcomeIds, []);
  const betslipOutcomeIds = useSelector((state) => getBetslipOutcomeIds(state, location.pathname));

  const [betslipState, setBetslipState] = useState({ isCashoutSectionOpen: false, openBetslip: false });

  const activeBetCount = useSelector((state) => state.cashout.activeBetCount);
  const outcomeLength = betslipOutcomeIds.length;

  const breakpoint = useCurrentBreakpointName();
  const isMobileDeviceOrTablet = breakpoint === "xsmall" || breakpoint === "small" || breakpoint === "tablet";

  const getBetslipSubmitConfirmation = useMemo(makeGetBetslipSubmitConfirmation, []);
  const submitConfirmation = useSelector((state) => getBetslipSubmitConfirmation(state, location.pathname));

  useEffect(() => {
    const message = {
      action: "app.ez.header_button_status",
      button: betslipState.isCashoutSectionOpen ? "CASHOUT" : "BETSLIP",
      status: betslipState.openBetslip ? "ACTIVE" : "HIDDEN",
    };

    console.log("-----------------------------");
    console.log("emit betslip status message: ");
    console.log(message);
    console.log("-----------------------------");

    window.parent.postMessage(message, "*");
  }, [betslipState.openBetslip, betslipState.isCashoutSectionOpen]);

  useEffect(() => {
    if (!isMobileDeviceOrTablet) {
      setBetslipState({ isCashoutSectionOpen: false, openBetslip: false });
    }
  }, [isMobileDeviceOrTablet]);

  useScrollLock(betslipState.openBetslip || submitConfirmation); // lock / unlock the scroll. Use the data-scroll-lock-scrollable attribute on whatever element you want to enable scrolling

  return (
    <div className={classes["wrapper"]} style={{ overflow: betslipState.openBetslip ? "hidden" : "unset" }}>
      <div className={classes["wrapper"]}>
        {!isInIframe && <MockHeader />}
        <div className={classes["main-wrapper"]} style={{ height: isInIframe ? "unset" : "100%" }}>
          <div className={classes["phantom-slider-wrapper"]}>
            <div className={classes["phantom-slider"]} id="phantom-slider">
              <div style={{ overflow: "hidden" }}>
                <div
                  className={cx(classes["phantom-slider-items"], { [classes["iframe-slider-items"]]: isInIframe })}
                  id="phantom-slider-items"
                >
                  {isInIframe && (
                    <div
                      className={cx(classes["phantom-slider-item"], classes["dummy-slider-item"])}
                      id="placeholder-slide-left"
                    />
                  )}

                  <div className={cx(classes["phantom-slider-item"])} id="live-slide-card">
                    {isLive && (
                      <>
                        <main style={{ paddingTop: isInIframe ? 0 : "106px" }}>{children}</main>
                        <Footer
                          betslipOutcomeIds={betslipOutcomeIds}
                          onOpen={() => (openCashout) => {
                            setBetslipState({ isCashoutSectionOpen: openCashout, openBetslip: true });
                          }}
                        />
                      </>
                    )}
                  </div>

                  <div className={cx(classes["phantom-slider-item"])} id="prematch-slide-card">
                    {isPrematch && (
                      <>
                        <main style={{ paddingTop: isInIframe ? 0 : "106px" }}>{children}</main>
                        <Footer
                          betslipOutcomeIds={betslipOutcomeIds}
                          onOpen={() => (openCashout) => {
                            setBetslipState({ isCashoutSectionOpen: openCashout, openBetslip: true });
                          }}
                        />
                      </>
                    )}
                  </div>

                  {isInIframe && (
                    <div
                      className={cx(classes["phantom-slider-item"], classes["dummy-slider-item"])}
                      id="placeholder-slide-right"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {betslipState.openBetslip && (
        <BetslipModal
          cashOutScreenVisible={betslipState.isCashoutSectionOpen}
          setCashOutScreenVisible={(value) =>
            setBetslipState((prevState) => ({ ...prevState, isCashoutSectionOpen: value }))
          }
          onClose={() => setBetslipState((prevState) => ({ ...prevState, openBetslip: false }))}
        />
      )}
    </div>
  );
};

const propTypes = {
  children: PropTypes.any.isRequired,
};

const defaultProps = {};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

export default React.memo(Layout);
