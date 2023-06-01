import { Component, HostBinding, OnInit } from "@angular/core";
import { Survey } from "src/app/model/survey";
import { AlertifyService } from "src/app/services/alertify.service";
import { SurveyService } from "src/app/services/survey.service";

@Component({
  selector: "app-manage-surveys",
  templateUrl: "./manage-surveys.component.html",
  styleUrls: ["./manage-surveys.component.css"],
})
export class ManageSurveysComponent implements OnInit {
  SearchByStatus: string = "Draft";
  Surveys: Array<Survey>;

  constructor(private alertify: AlertifyService, private surveyService: SurveyService) {}

  ngOnInit() {
    this.surveyService.getSurveys().subscribe(data => {
      this.Surveys = data;
    });
  }

  removeSurvey(surveyID: number) {
    this.Surveys = this.Surveys.filter((survey) => survey.surveyID != surveyID);
    this.surveyService.deleteSurvey(surveyID);
    this.alertify.success("You have successfully removed survey with ID " + surveyID);
  }

  publishSurvey(surveyID: number) {
    this.Surveys = this.Surveys.map((survey) => {
      if (survey.surveyID == surveyID) {
        survey.status = "Published";
      }
      return survey;
    });
    let patchDoc =
    `[
      {
        "op": "replace",
        "path": "/status",
        "value": "Published"
      }
    ]`;
    this.surveyService.editSurvey(surveyID, patchDoc);
    this.alertify.success("You have successfully published survey with ID" + surveyID);
  }

  closeSurvey(surveyID: number) {
    this.Surveys = this.Surveys.map((survey) => {
      if (survey.surveyID == surveyID) {
        survey.status = "Finished";
      }
      return survey;
    });
    let patchDoc =
    `[
      {
        "op": "replace",
        "path": "/status",
        "value": "Finished"
      }
    ]`;
    this.surveyService.editSurvey(surveyID, patchDoc);
    this.alertify.success("You have successfully closed survey with ID" + surveyID);
  }

  setSurveyFilter(filter: string) {
    let prevItem = document.getElementById(this.SearchByStatus);
    let item = document.getElementById(filter);

    prevItem?.classList.remove("highlight");
    item?.classList.add("highlight");

    this.SearchByStatus = filter;
  }
}
