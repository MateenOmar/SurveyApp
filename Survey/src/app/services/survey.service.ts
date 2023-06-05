import { Injectable } from "@angular/core";
import { UserForLogin, UserForRegister } from "../model/user";
import { HttpClient, HttpHeaders } from "@angular/common/http";
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
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get<BasicSurvey[]>(this.baseURL + "/survey/surveys", httpOptions);
  }

  getCompleteSurveys() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get<Survey[]>(this.baseURL + "/survey/completeSurveys", httpOptions);
  }

  getCompleteSurveyByID(surveyID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get<Survey>(this.baseURL + "/survey/surveys/" + surveyID, httpOptions);
  }

  getAllCompleteSurveys() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get<Survey[]>(this.baseURL + "/survey/completeSurveys", httpOptions);
  }

  getSurveyAnswers(surveyID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get(this.baseURL + "/survey/answers/" + surveyID, httpOptions);
  }

  getAssignedSurvey(surveyID: number, userName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get(
      this.baseURL + "/survey/assignees/" + userName + "/" + surveyID,
      httpOptions
    );
  }

  getSurveyAssigneesBySurveyID(surveyID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get(this.baseURL + "/survey/assignees/" + surveyID, httpOptions);
  }

  getSurveyAssigneesBySurveyIDWithName(surveyID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get(this.baseURL + "/survey/assignees/name/" + surveyID, httpOptions);
  }

  getSurveyAssigneesByUser(userName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.get(this.baseURL + "/survey/assignees/user/" + userName, httpOptions);
  }

  assignSurveyToUser(surveyID: number, userName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.post(
      this.baseURL + "/survey/assign/" + surveyID + "/" + userName,
      null,
      httpOptions
    );
  }

  assignSurveyToUsers(surveyID: number, userNames: string[]) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.post(
      this.baseURL + "/survey/assign",
      {
        surveyID: surveyID,
        assignees: userNames,
      },
      httpOptions
    );
  }

  unassignSurveyFromUser(surveyID: number, userName: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.delete(
      this.baseURL + "/survey/unassign/" + surveyID + "/" + userName,
      httpOptions
    );
  }

  submitUserAnswers(userAnswers: UserAnswers) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.post(this.baseURL + "/survey/submitAnswers", userAnswers, httpOptions);
  }

  addSurvey(survey: Survey) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.post(this.baseURL + "/survey/post", this.surveyCleanup(survey), httpOptions);
  }

  updateSurvey(surveyID: number, survey: Survey) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.put(
      this.baseURL + "/survey/update/" + surveyID,
      this.surveyCleanup(survey),
      httpOptions
    );
  }

  patchSurvey(surveyID: number, patchDoc: Array<any>) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.patch(this.baseURL + "/survey/update/" + surveyID, patchDoc, httpOptions);
  }

  changeCompletionStatus(surveyID: number, username: string, patchDoc: Object) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.patch(
      this.baseURL + "/survey/assignee/update/" + username + "/" + surveyID,
      patchDoc,
      httpOptions
    );
  }

  deleteSurvey(surveyID: number) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    };

    return this.http.delete(this.baseURL + "/survey/delete/" + surveyID, httpOptions);
  }

  surveyCleanup(survey: Survey) {
    //Remove empty options
    survey.questionsAndAnswers.forEach((qa) => {
      qa.options = qa.options.filter((option) => {
        return option.answer != "";
      });
      if (qa.options.length == 0) {
        qa.options.push({
          answer: "",
          answerID: 0,
        });
      }
      qa.numberOfAnswers = qa.options.length;
    });

    //Remove empty questions or questions with no options
    if (survey.questionsAndAnswers.length > 1) {
      survey.questionsAndAnswers = survey.questionsAndAnswers.filter((qa) => {
        return qa.question != "";
      });
    }
    survey.numberOfQuestions = survey.questionsAndAnswers.length;
    delete survey.surveyID;
    return survey;
  }
}
