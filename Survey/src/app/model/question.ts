import { Answer } from "./answer";

export interface Question {
    questionID: number;
    question: string;
    numberOfAnswers: number;
    options: Array<Answer>;
}