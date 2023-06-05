import { AnsweredQuestions } from "./answeredQuestions";

export interface CompleteAnsweredQuestions extends AnsweredQuestions {
    question: string;
    answer: string;
}