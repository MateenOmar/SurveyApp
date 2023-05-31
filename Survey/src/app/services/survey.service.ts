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

  getSurveys() {
    return this.http.get<Survey[]>(this.baseURL + "/survey/surveys");
  }

  getSurveyByID(surveyID: number) {
    return this.http.get<Survey>(this.baseURL + "/survey/surveys/" + surveyID);
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

  submitUserAnswers(surveyID: number, userAnswers: UserAnswers) {
    return this.http.post(this.baseURL + "/submitAnswers/" + surveyID, userAnswers);
  }

  addSurvey(survey: Survey) {
    return this.http.post("http://localhost:5000/api/survey/post", survey);
  }

  editSurvey(surveyID: number, patchDoc: string) {
    return this.http.patch("http://localhost:5000/api/survey/update/" + surveyID, patchDoc);
  }

  deleteSurvey(surveyID: number) {
    return this.http.delete("http://localhost:5000/api/survey/delete/" + surveyID);
  }
}
