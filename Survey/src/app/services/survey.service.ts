import { Injectable } from "@angular/core";
import { UserForLogin, UserForRegister } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Survey } from "../model/survey";
import { UserAnswers } from "../model/userAnswers";
import { BasicSurvey } from "../model/basicSurvey";

@Injectable({
  providedIn: "root",
})

export class SurveyService {
  baseURL = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getBasicSurveys() {
    return this.http.get<BasicSurvey[]>(this.baseURL + "/survey/surveys");
  }

  getCompleteSurveys() {
    return this.http.get<Survey[]>(this.baseURL + "/survey/completeSurveys");
  }

  getCompleteSurveyByID(surveyID: number) {
    return this.http.get<Survey>(this.baseURL + "/survey/surveys/" + surveyID);
  }

  getAllCompleteSurveys() {
    return this.http.get<Survey[]>(this.baseURL + "/survey/completeSurveys");
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

  getSurveyAssigneesBySurveyIDWithName(surveyID: number) {
    return this.http.get(this.baseURL + "/survey/assignees/name/" + surveyID);
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
    return this.http.post(this.baseURL + "/survey/post", this.surveyCleanup(survey));
  }

  updateSurvey(surveyID: number, survey: Survey) {
    return this.http.put(this.baseURL + "/survey/update/" + surveyID, this.surveyCleanup(survey));
  }

  patchSurvey(surveyID: number, patchDoc: Array<any>) {
    return this.http.patch(this.baseURL + "/survey/update/" + surveyID, patchDoc);
  }

  changeCompletionStatus(surveyID: number, username: string, patchDoc: Object) {
    return this.http.patch(this.baseURL + "/survey/assignee/update/" + username + "/" + surveyID, patchDoc);
  }

  deleteSurvey(surveyID: number) {
    return this.http.delete(this.baseURL + "/survey/delete/" + surveyID);
  }

  surveyCleanup(survey: Survey) {
    //Remove empty options
    survey.questionsAndAnswers.forEach(qa => {
      qa.options = qa.options.filter(option => {
        return option.answer != ""
      })
      if (qa.options.length == 0) {
        qa.options.push({
          answer: "",
          answerID: 0
        })
      }
      qa.numberOfAnswers = qa.options.length
    });

    //Remove questions with empty question values
    if (survey.questionsAndAnswers.length > 1) {
      survey.questionsAndAnswers = survey.questionsAndAnswers.filter(qa => {
        return qa.question != "";
      });
    }

    for (let i = 0; i < survey.questionsAndAnswers.length; i++) {
      if (survey.questionsAndAnswers[i].questionID != i + 1) {
        survey.questionsAndAnswers[i].questionID = i + 1;
      }
      for (let j = 0; j < survey.questionsAndAnswers[i].options.length; j++) {
        if (survey.questionsAndAnswers[i].options[j].answerID != j + 1) {
          survey.questionsAndAnswers[i].options[j].answerID = j + 1;
        }
      }
    }

    survey.numberOfQuestions = survey.questionsAndAnswers.length;
    let cloneSurvey = Object.assign({}, survey);
    delete cloneSurvey.surveyID;
    return cloneSurvey;
  }
}
