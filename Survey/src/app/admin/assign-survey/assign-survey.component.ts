import { Component, OnInit, TemplateRef, ViewEncapsulation } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { UserData } from "src/app/model/user";
import { AuthService } from "src/app/services/auth.service";
import { SurveyService } from "src/app/services/survey.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-assign-survey",
  templateUrl: "./assign-survey.component.html",
  styleUrls: ["./assign-survey.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AssignSurveyComponent implements OnInit {
  addUsers: string[] = [];
  modalRef?: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,
    class: "modal-lg",
  };
  users: UserData[];

  constructor(
    private modalService: BsModalService,
    private survey: SurveyService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.auth.getUsers().subscribe((res: any) => {
      this.users = res as UserData[];
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  onChange(userName: string, isChecked: boolean) {
    if (isChecked) {
      this.addUsers.push(userName);
    } else {
      let index = this.addUsers.findIndex((x) => x == userName);
      this.addUsers.splice(index, 1);
    }
    console.log(this.addUsers);
  }

  invite() {
    this.modalRef?.hide();
    this.survey.assignSurveyToUsers(2, this.addUsers).subscribe((res) => {
      console.log(res);
    });
    Swal.fire({
      title: "Users invited!",
      icon: "success",
      timer: 2000,
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Done",
    });
  }
}
