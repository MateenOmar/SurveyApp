import { Injectable } from "@angular/core";
import { UserForLogin, UserForRegister } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Survey } from "../model/survey";

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

  unassignSurveyFromUser(surveyID: number, userName: string) {
    return this.http.delete(this.baseURL + "/survey/unassign/" + surveyID + "/" + userName);
  }
}
