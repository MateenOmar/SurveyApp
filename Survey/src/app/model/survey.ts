import { ISurveyBase } from './isurveybase';
import { Questions } from './questions';

export class Survey implements ISurveyBase {
    id!: number;
    title!: string;
    description!: string;
    numberOfQuestions!: number;
    priority!: string;
    dueDate!: string;
    status!: string;
    QA!: Questions[]
  }