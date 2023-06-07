import { Component, Input, OnInit, TemplateRef } from "@angular/core";
import { Survey } from "src/app/model/survey";
import { AssignedSurvey } from "src/app/model/assignedSurvey";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SurveyService } from "src/app/services/survey.service";
import { CompleteUserAnswers } from "src/app/model/completeUserAnswer";
import { UserData } from "src/app/model/user";
import Swal from "sweetalert2";
import { AuthService } from "src/app/services/auth.service";

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

  dataFetched: boolean = false;
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

  constructor(private modalService: BsModalService, private surveyService: SurveyService,
              private auth: AuthService) {}

  ngOnInit() {
    if (this.userType === "admin") {
      this.getAddedUsers();
      this.auth.getUsers().subscribe((res: any) => {
        this.users = res as UserData[];
        this.users = this.users.filter((x) => !this.addedUsers.includes(x.userName));
      });
      this.dataFetched = true;
    }
  }

  onDelete() {
    this.parent.removeSurvey(this.survey.surveyID, this.survey.title);
  }

  onPublish() {
    this.parent.publishSurvey(this.survey.surveyID);
  }

  onClose() {
    this.parent.closeSurvey(this.survey.surveyID);
  }

  openAnswersModal(template: TemplateRef<any>) {
    const userName = localStorage.getItem("userName");
    if (userName !== null) {
      this.loggedInUser = userName;
    } else {
      console.error("User is not valid");
    }
    this.surveyService
      .getSurveyAnswersFromUser(this.survey.surveyID!, this.loggedInUser)
      .subscribe((data) => {
        this.userAnswers = data as CompleteUserAnswers;
        console.log(data);
        this.modalRef = this.modalService.show(template, this.config);
      });
  }

  addedUsers: string[] = [];
  addUsers: string[] = [];
  users: UserData[];

  openInviteModal(template: TemplateRef<any>) {
    this.addUsers = [];
    this.modalRef = this.modalService.show(template, this.config);
  }

  onChange(userName: string, isChecked: boolean) {
    if (isChecked) {
      this.addUsers.push(userName);
    } else {
      let index = this.addUsers.findIndex((x) => x == userName);
      this.addUsers.splice(index, 1);
    }
  }

  invite() {
    this.modalRef?.hide();
    this.addedUsers.push(...this.addUsers);
    this.users = this.users.filter((x) => !this.addedUsers.includes(x.userName));
    Swal.fire({
      title: "Users invited!",
      icon: "success",
      timer: 1000,
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Done",
    });
    this.surveyService
    .assignSurveyToUsers(this.survey.surveyID!, this.addUsers)
    .subscribe(() => {
      this.surveyService
        .updateSurvey(this.survey.surveyID!, this.survey)
        .subscribe(() => {});
      this.surveyService.sendEmails(this.survey.surveyID!).subscribe();
    });
  }

  getAddedUsers() {
    this.surveyService
      .getSurveyAssigneesBySurveyIDWithName(this.survey.surveyID!)
      .subscribe((res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.addedUsers.push(res[i].userName);
        }
      });
  }
}
