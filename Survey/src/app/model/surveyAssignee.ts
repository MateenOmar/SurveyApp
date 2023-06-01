import { Survey } from "./survey";

export interface SurveyAssignee extends Survey {
    completionStatus: string;
  }