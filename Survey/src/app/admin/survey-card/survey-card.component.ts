import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { Survey } from "src/app/model/survey";
import { AssignedSurvey } from "src/app/model/assignedSurvey";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SurveyService } from "src/app/services/survey.service";
import { CompleteUserAnswers } from "src/app/model/completeUserAnswer";

@Component({
  selector: "app-survey-card",
  templateUrl: "./survey-card.component.html",
  styleUrls: ["./survey-card.component.css"],
})
export class SurveyCardComponent implements OnInit {
  @Input() survey: Survey;
  @Input() assignedSurvey: AssignedSurvey;
  @Input() parent: any;
  @Input() userType!: string;

  modalRef?: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: "modal-lg",
  };
  userAnswers: CompleteUserAnswers;
  loggedInUser: string;

  constructor(private modalService: BsModalService,
              private surveyService: SurveyService) { }

  ngOnInit() {}

  onDelete() {
    this.parent.removeSurvey(this.survey.surveyID, this.survey.title);
  }

  onPublish() {
    this.parent.publishSurvey(this.survey.surveyID);
  }

  onClose() {
    this.parent.closeSurvey(this.survey.surveyID);
  }

  openModal(template: TemplateRef<any>) {
    
    const userName = localStorage.getItem("userName");
    if (userName !== null) {
      this.loggedInUser = userName;
    } 
    else{
      console.error("User is not valid");
    }
    this.surveyService.getSurveyAnswersFromUser(this.survey.surveyID!, this.loggedInUser).subscribe(
      (data) => {
        this.userAnswers = data as CompleteUserAnswers;
        console.log(data);
        this.modalRef = this.modalService.show(template, this.config);
      }
    )
  }

}
