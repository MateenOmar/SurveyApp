import { AnsweredQuestions } from "./answeredQuestions";

export interface UserAnswers {
    surveyID: number;
    username: string;
    questionAndAnswerIDs: Array<AnsweredQuestions>;
}