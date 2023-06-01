import { Component, Input, OnInit } from "@angular/core";
import { Survey } from "src/app/model/survey";
import { SurveyAssignee } from "src/app/model/surveyAssignee";

@Component({
  selector: "app-survey-card",
  templateUrl: "./survey-card.component.html",
  styleUrls: ["./survey-card.component.css"],
})
export class SurveyCardComponent implements OnInit {
  @Input() survey: Survey;
  @Input() assignedSurvey: SurveyAssignee;
  @Input() parent: any;
  @Input() userType!: string;
  constructor() { }

  ngOnInit() {
    console.log(this.assignedSurvey);
  }

  onDelete() {
    this.parent.removeSurvey(this.survey.surveyID);
  }

  onPublish() {
    this.parent.publishSurvey(this.survey.surveyID);
  }

  onClose() {
    this.parent.closeSurvey(this.survey.surveyID);
  }
}
