import { Survey } from "./survey";

export interface AssignedSurvey extends Survey {
    completionStatus: string;
  }