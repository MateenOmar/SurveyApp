import { Injectable } from "@angular/core";
import { UserForLogin, UserForRegister } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SurveyService {
  baseURL = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getSurveys() {
    return this.http.get(this.baseURL + "/survey/surveys");
  }

  getSurveyQuestions(surveyID: number) {
    return this.http.get(this.baseURL + "/survey/questions/" + surveyID);
  }

  getQuestionAnswers(surveyID: number, questionID: number) {
    return this.http.get(this.baseURL + "/survey/questions/options/" + surveyID + "/" + questionID);
  }

  submitUserAnswers(surveyID: number, userAnswers: any[]) {
    return this.http.post(this.baseURL + "/submitAnswers/" + surveyID, userAnswers);
  }
}
