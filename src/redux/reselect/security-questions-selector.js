import { createSelector } from "@reduxjs/toolkit";

export const getSecurityQuestions = createSelector(
  (state) => state.securityQuestion?.questions,
  (questions) =>
    questions
      ? questions.map(
          (question) => ({
            key: String(question.id),
            label: question.description,
            value: String(question.id),
          }),
          [],
        )
      : [],
);
