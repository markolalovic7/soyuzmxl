const INFO_RULES = {
  BOTH_TEAMS_TO_SCORE: {
    desc: "Both Teams to Score",
    notes: [
      { desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기를 기준으로 정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: ["정규시간, 전반전, 후반전 각 경기에서 양팀이 모두 득점을\n" + "   기록 할 지를 예측하는 베팅입니다."],
    title: "양팀 모두 득점 ?",
  },

  DOUBLE_CHANCE: {
    desc: "Double Chance",
    notes: [
      { desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기를 기준으로 정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "3가지 선택 항목 중 2가지 경우의 수를 예측하는\n" +
      "   베팅입니다. 홈팀 승 또는 무승부, 원정팀 승 또는 무승부,\n" +
      "   홈팀 승 또는 원정팀 승 입니다.",
    ],
    title: "더블찬스",
  },
  FIRST_TEAM_TO_SCORE: {
    desc: "First Team to Score",
    notes: [
      {
        desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.",
        title: "- 정규시간 -",
      },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기를 기준으로 정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: ["정규시간, 전반전, 후반전 각 경기에서 첫 득점을 기록\n" + "   할 지를 예측하는 베팅입니다."],
    title: "첫 득점 팀",
  },

  HALF_TIME_FULL_TIME: {
    desc: "Half Time / Full Time",
    notes: [{ desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" }],
    rules: ["마켓에 명시된 경기에 대한 전반전 및 풀타임 결과를 예측하는 베팅 입니다."],
    title: '전 / 후반 승무패'
  },

  HANDICAP: {
    desc: "Goals Handicap",
    notes: [
      { desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기를 기준으로 정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "정규시간 / 전후반전 의 점수에 마켓에 명시된 핸디캡을\n" +
      "   적용한 결과를 바탕으로 승리팀을 예측하는 베팅입니다.",
      "“핸디캡”은 해당 경기가 시작하기 전에 분석된 전력\n" + "   우세팀에 부여되는 가상의 경기 시작 점수를 의미합니다.",
      "접수된 모든 베팅은 마켓에 명시된 정규시간, 전반전,\n" +
      "   후반전의 게임이 종료된 후 확인되는 기록에 핸디캡을\n" +
      "   적용한 점수를 기준으로 정산됩니다.",
    ],
    title: "핸디캡",
  },

  H_2_H: {
    desc: "Head to Head",
    notes: [
      { desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" },
      {
        desc: "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든 베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기를 기준으로 정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "마켓에 명시된 경기에서 어느 팀이 승리할 지를 예측하는\n" +
      "   베팅입니다. 마켓에 명시된 정규시간, 전반전, 후반전 의\n" +
      "   결과가 무승부일 경우 적중특례 로 정산되어 집니다.",
    ],
    title: "승패 [ 무승부 적특 ]",
  },

  MATCH_AND_OVER_UNDER: {
    desc: "1x2 & Totals",
    notes: [
      { desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
    ],
    rules: [
      "정규시간 “90분”, 전반전 “45분” 경기에서 기록된\n" +
      "   총 득점에 대한 오버/언더 및 경기 결과를 예측하는 \n" +
      "   베팅입니다.",
      "본 마켓에 접수된 베팅은, 선택하신 팀의 승, 패, 또는\n" +
      "   무승부 결과와 경기 중 기록된 총 득점을 기준으로\n" +
      "   정산됩니다.",
    ],
    title: "승무패 오버/언더"
  },

  TEAM_TOTALS: {
    desc: "Team Totals",
    notes: [
      {
        desc:
          "모든 베팅은 경기의 전후반전에 적용됩니다. 해당 마켓에\n" +
          "접수된 모든 베팅은 정규 “90분”의 경기가 종료된 시점의\n" +
          "팀별 총 득점합을 기준으로 정산합니다.",
        title: "- 정규시간 -",
      },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기 팀병 득점을 기준으로\n" +
          "정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기 팀별 득점을 기준으로\n" +
          "정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "경기의 팀별 총 득점합이 주어진 베팅 라인에서 오버 또는 언더 일지를 예측하는 베팅입니다.",
      "팀별 총 득점합 이 기준점 베팅 라인 보다 높을 경우 ‘오버’\n" +
      "   를 적중으로 정산 합니다. 반대로 총 득점이 기준점 베팅\n" +
      "   라인 보다 낮을 경우 ‘언더’ 를 적중으로 정산합니다.",
      "모든 오버/언더 베팅은 해당 마켓에 명시된 정규시간,\n" +
      "   전반전, 후반전 의 종료된 시점의 경기 결과를 바탕으로\n" +
      "   정산합니다.",
    ],
    title: "오버/언더 [ 팀별 득점합 ]",
  },

  THREE_WAY_HANDICAP: {
    desc: "3 Way Handicap",
    notes: [
      { desc: "접수된 모든 베팅은 정규 “90분”의 경기 결과를 기준으로\n" + "정산됩니다.", title: "- 정규시간 -" },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기를 기준으로 정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기를 기준으로 정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "마켓에 명시된 핸디캡을 기준으로, 무승부를 포함한 3가지\n" + "    옵션에 따라 승리 팀을 예측하는 베팅입니다.",
      "본 마켓에 접수된 모든 베팅은, 실제 경기 결과를 바탕으로\n" + "    선택하신 팀과 옵션에 따라 정산됩니다.",
      "무승부에 명시 되는 핸디캡은 항상 홈 팀을 따릅니다.?????",
    ],
    title: "핸디캡 승무패 [ 3WAY ]",
  },

  TOTALS: {
    desc: "Total Goals",
    notes: [
      {
        desc:
          "모든 베팅은 경기의 전후반전에 적용됩니다. 해당 마켓에\n" +
          "접수된 모든 베팅은 정규 “90분”의 경기가 종료된 시점의\n" +
          "최종 득점합을 기준으로 정산합니다.",
        title: "- 정규시간 -",
      },
      {
        desc:
          "정규 “45분”의 전반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 전반전 경기 득점합을 기준으로\n" +
          "정산합니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "정규 “45분”의 후반전 경기, 해당 마켓에 접수된 모든\n" +
          "베팅은 정규 “45분”의 후반전 경기 득점합을 기준으로\n" +
          "정산합니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "경기의 총 득점합이 주어진 베팅 라인에서 오버 또는\n" + "   언더 일지를 예측하는 베팅입니다.",
      "총 득점합이 기준점 베팅 라인 보다 높을 경우 ‘오버’ 를\n" +
      "   적중으로 정산 합니다. 반대로 총 득점이 기준점 베팅 라인\n" +
      "   보다 낮을 경우 ‘언더’ 를 적중으로 정산합니다.",
      "모든 오버/언더 베팅은 해당 마켓에 명시된 정규시간,\n" +
      "   전반전, 후반전 의 종료된 시점의 경기 결과를 바탕으로\n" +
      "   정산합니다.",
    ],
    title: "오버/언더 [ 양팀 득점합 ]",
  },

  W_D_W: {
    desc: "W/D/W",
    notes: [
      {
        desc: "정규 시간 “90분” 경기가 종료된 시점의 기록을 바탕으로\n" + "승리팀 또는 무승부를 예측하는 베팅입니다.",
        title: "- 정규시간 -",
      },
      {
        desc:
          "전반전 베팅은 전반전 경기 결과를 기준으로 하며\n" +
          "접수된 모든 베팅은 정규 “45분”의 전반전 경기 결과를\n" +
          "기준으로 정산 됩니다.",
        title: "- 전반전 -",
      },
      {
        desc:
          "승무패 후반전 베팅은 후반전 경기 결과를 기준으로 하며\n" +
          "접수된 모든 베팅은 정규 “45분”의 후반전 경기 결과를\n" +
          "기준으로 정산 됩니다.",
        title: "- 후반전 -",
      },
    ],
    rules: [
      "해당 경기의 승리팀을 예측하는 베팅입니다.\n" + "    본 마켓타입은 양 팀과 무승부를 선택항목 으로 제공합니다.",
      "본 마켓타입에 제공된 베팅이 유효하기 위해서는,\n" + "    해당 경기가 0-0 스코어로 시작되어야 합니다.",
    ],
    title: "승무패 마켓타입 베팅규정",
  },
};

export const getInfoRules = (market) => {
  // is it W/D/W
  if (market.marketTypeGroup === "MONEY_LINE" && market.style === "THREE_OUTCOME") {
    return INFO_RULES["W_D_W"];
  }

  // is it 2Way
  if (market.marketTypeGroup === "MONEY_LINE" && market.style === "TWO_OUTCOME") {
    return INFO_RULES["H_2_H"];
  }

  // is it Over/Under (not team)
  if (market.marketTypeGroup === "FIXED_TOTAL" && market.style === "TWO_OUTCOME" && !market.desc.includes(" - ")) {
    return INFO_RULES["TOTALS"];
  }

  // is it Team Over/Under?
  if (market.marketTypeGroup === "FIXED_TOTAL" && market.style === "TWO_OUTCOME" && market.desc.includes(" - ")) {
    return INFO_RULES["TEAM_TOTALS"];
  }

  // Is it Handicap?
  if (market.marketTypeGroup === "FIXED_SPREAD" && market.style === "TWO_OUTCOME") {
    return INFO_RULES["HANDICAP"];
  }
  // Is it 3 Way Handicap?
  if (market.marketTypeGroup === "FIXED_SPREAD" && market.style === "THREE_OUTCOME") {
    return INFO_RULES["THREE_WAY_HANDICAP"];
  }

  // Is it Double Chance?
  if (market.marketTypeGroup === "DOUBLE_CHANCE") {
    return INFO_RULES["DOUBLE_CHANCE"];
  }
  // Is it Both Teams to Score?
  if (market.externalCode.includes("BR:MKT:U0029:")) {
    return INFO_RULES["BOTH_TEAMS_TO_SCORE"];
  }
  // Is it First Team to Score?
  if (false && market.externalCode.includes("BR:MKT:U00XXXX:")) {
    return INFO_RULES["FIRST_TEAM_TO_SCORE"];
  }
  // Is it HTFT?
  if (market.marketTypeGroup === "HTFT") {
    return INFO_RULES["HALF_TIME_FULL_TIME"];
  }

  // Is it 1x2 & Totals?
  if (market.marketTypeGroup === "MATCHBET_AND_TOTALS") {
    return INFO_RULES["MATCH_AND_OVER_UNDER"];
  }

  return undefined;
};
