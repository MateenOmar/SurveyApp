import { Injectable } from "@angular/core";
import { UserForLogin, UserForRegister } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Survey } from "../model/survey";
import { UserAnswers } from "../model/userAnswers";

@Injectable({
  providedIn: "root",
})

export class SurveyService {
  baseURL = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getBasicSurveys() {
    return this.http.get<Survey[]>(this.baseURL + "/survey/surveys");
  }

  getCompleteSurveyByID(surveyID: number) {
    return this.http.get<Survey>(this.baseURL + "/survey/surveys/" + surveyID);
  }

  getSurveyAnswers(surveyID: number) {
    return this.http.get(this.baseURL + "/survey/answers/" + surveyID);
  }

  getAssignedSurvey(surveyID: number, userName: string) {
    return this.http.get(this.baseURL + "/survey/assignees/" + userName + "/" + surveyID);
  }

  getSurveyAssigneesBySurveyID(surveyID: number) {
    return this.http.get(this.baseURL + "/survey/assignees/" + surveyID);
  }

  getSurveyAssigneesByUser(userName: string) {
    return this.http.get(this.baseURL + "/survey/assignees/user/" + userName);
  }

  assignSurveyToUser(surveyID: number, userName: string) {
    return this.http.post(this.baseURL + "/survey/assign/" + surveyID + "/" + userName, null);
  }

  assignSurveyToUsers(surveyID: number, userNames: string[]) {
    return this.http.post(this.baseURL + "/survey/assign", {
      surveyID: surveyID,
      assignees: userNames,
    });
  }

  unassignSurveyFromUser(surveyID: number, userName: string) {
    return this.http.delete(this.baseURL + "/survey/unassign/" + surveyID + "/" + userName);
  }

  submitUserAnswers(userAnswers: UserAnswers) {
    return this.http.post(this.baseURL + "/survey/submitAnswers", userAnswers);
  }

  addSurvey(survey: Survey) {
    return this.http.post(this.baseURL + "/survey/post", survey);
  }

  editSurvey(surveyID: number, patchDoc: string) {
    return this.http.patch(this.baseURL + "/survey/update/" + surveyID, patchDoc);
  }

  changeCompletionStatus(surveyID: number, username: string, patchDoc: Object) {
    return this.http.patch(this.baseURL + "/survey/assignee/update/" + username + "/" + surveyID, patchDoc);
  }

  deleteSurvey(surveyID: number) {
    return this.http.delete(this.baseURL + "/survey/delete/" + surveyID);
  }
}
