import { Component, OnInit, TemplateRef } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Survey } from "src/app/model/Survey";
import { UserData } from "src/app/model/user";
import { AuthService } from "src/app/services/auth.service";
import { SurveyService } from "src/app/services/survey.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-survey",
  templateUrl: "./add-survey.component.html",
  styleUrls: ["./add-survey.component.css"],
})
export class AddSurveyComponent implements OnInit {
  displayGeneralInfo: boolean = true;
  addSurveyForm: FormGroup;
  currentDate: Date = new Date();
  currSurvey: Survey = {
    SurveyID: 0,
    Title: "",
    DueDate: this.addWeeks(this.currentDate, 1),
    Description: "",
    QA: [
      {
        QId: 1,
        QTitle: "Question 1",
        Answers: [
          { AId: 0, Answer: "" },
          { AId: 1, Answer: "" },
          { AId: 2, Answer: "" },
          { AId: 3, Answer: "" },
        ],
      },
    ],
    Priority: "Medium",
  };
  currQuestion: any;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private survey: SurveyService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.addSurveyForm = new FormGroup(
      {
        title: new FormControl(null, Validators.required),
        due: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        priority: new FormControl(null, Validators.required),
      },
      this.dueDateValidator
    );
    this.auth.getUsers().subscribe((res: any) => {
      this.users = res as UserData[];
    });
  }

  ngAfterViewInit() {
    this.setDefaultDate(this.currSurvey.DueDate!);
  }

  onSubmit() {
    console.log(this.currSurvey);
    console.log(this.addSurveyForm);
  }

  onSelectQuestion(id: number) {
    this.currQuestion = this.currSurvey.QA[id];
    this.displayGeneralInfo = false;
  }

  onDeleteQuestion(id: number) {
    this.currSurvey.QA.splice(id, 1);
  }

  onDeleteAnswer(id: number) {
    this.currQuestion.Answers.splice(id, 1);
  }

  onAddQuestion() {
    let qid = this.currSurvey.QA[this.currSurvey.QA.length - 1].QId + 1;
    this.currSurvey.QA.push({
      QId: qid,
      QTitle: "Question " + qid,
      Answers: [
        { AId: 0, Answer: "" },
        { AId: 1, Answer: "" },
        { AId: 2, Answer: "" },
        { AId: 3, Answer: "" },
      ],
    });
  }

  onAddAnswer() {
    let aid = this.currQuestion.Answers[this.currQuestion.Answers.length - 1].AId + 1;
    this.currQuestion.Answers.push({ AId: aid, Answer: "" });
  }

  onSelectGeneralInfo() {
    this.displayGeneralInfo = true;
  }

  addWeeks(date: Date, weeks: number) {
    const dateCopy = new Date(date);
    dateCopy.setDate(dateCopy.getDate() + 7 * weeks);
    return dateCopy;
  }

  setDefaultDate(date: Date) {
    let myDate: HTMLInputElement = document.getElementById("due") as HTMLInputElement;
    myDate.value = date.toISOString().substring(0, 10);
  }

  dueDateValidator(fc: AbstractControl): ValidationErrors | null {
    let today = new Date().toISOString().substring(0, 10);
    /*Before the user touches the date picker, fc.get('due').value returns a full date-time string,
    which isn't comparable to today, and (fc.get('due')?.value > today) will return false, even though it's true.
    As soon as the user touches the date component, it becomes of the same format as 'today' variable (10 digit date),
    and now they are comparable. As the default value of date in datepicker
    is valid initially (today + 1 week), if fc.get('due')?.value > 10, which means it hasn't been touched, return null (no errors)
    */
    return fc.get("due")?.value > today || fc.get("due")?.value > 10
      ? null
      : { lessThanToday: true };
  }

  onSaveAsDraft() {
    let storageDrafts = localStorage.getItem("drafts")!;
    if (!localStorage.getItem("drafts")) {
      localStorage.setItem("drafts", JSON.stringify([this.currSurvey]));
    } else {
      localStorage.setItem(
        "drafts",
        JSON.stringify(JSON.parse(storageDrafts).concat([this.currSurvey]))
      );
    }
  }

  onDiscard() {
    this.router.navigate(["admin/surveys/manage"]);
    console.log("sdds");
  }

  get Title() {
    return this.addSurveyForm.controls["title"] as FormControl;
  }

  get Description() {
    return this.addSurveyForm.controls["description"] as FormControl;
  }

  get Date() {
    return this.addSurveyForm.controls["date"] as FormControl;
  }

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

  openModal(template: TemplateRef<any>) {
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

  onAssignUsers() {}
}
