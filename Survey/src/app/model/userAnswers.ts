export interface UserAnswers {
    surveyID: number;
    questionsAndAnswers: { [questionID: number]: number };
}