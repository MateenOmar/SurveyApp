import { Question } from "./question";

export interface Survey {
    surveyID: number;
    title: string;
    dueDate: Date;
    description: string;
    numberOfQuestions: number;
    status: string;
    priority: string;
    questions: Array<Question>;
  }