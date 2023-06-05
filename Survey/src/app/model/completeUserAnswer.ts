import { CompleteAnsweredQuestions } from "./completeAnsweredQuestion";

export interface CompleteUserAnswers {
    surveyID: number;
    username: string;
    questionsAndAnswers: Array<CompleteAnsweredQuestions>;
}