import { Component, OnInit, TemplateRef, Input } from "@angular/core";
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
import { Survey } from "src/app/model/survey";
import { UserData } from "src/app/model/user";
import { AuthService } from "src/app/services/auth.service";
import { SurveyService } from "src/app/services/survey.service";
import Swal from "sweetalert2";
import { HttpClient } from "@angular/common/http";
import { Question } from "src/app/model/question";

@Component({
  selector: "app-add-survey",
  templateUrl: "./add-survey.component.html",
  styleUrls: ["./add-survey.component.css"],
})
export class AddSurveyComponent implements OnInit {
  @Input() surveyForEdit: Survey;

  displayGeneralInfo: boolean = true;
  addSurveyForm: FormGroup;
  currentDate: Date = new Date();

  currQuestion: Question;
  currSurvey: Survey;

  constructor(
    private router: Router,
    private surveyService: SurveyService,
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

    if (this.surveyForEdit) {
      this.currSurvey = this.surveyForEdit;
    } else {
      this.currSurvey = {
        surveyID: 0,
        title: "",
        dueDate: this.addWeeks(this.currentDate, 1),
        description: "",
        numberOfQuestions: 1,
        status: "Drafted",
        priority: "Medium",
        questionsAndAnswers: [
          {
            questionID: 1,
            question: "Question 1",
            numberOfAnswers: 4,
            options: [
              { answerID: 0, answer: "" },
              { answerID: 1, answer: "" },
              { answerID: 2, answer: "" },
              { answerID: 3, answer: "" },
            ],
          },
        ],
      };
    }
    this.getAddedUsers();
    this.auth.getUsers().subscribe((res: any) => {
      this.users = res as UserData[];
      this.users = this.users.filter((x) => !this.addedUsers.includes(x.userName));
    });
  }

  ngAfterViewInit() {
    this.setDefaultDate(this.currSurvey.dueDate!);
  }

  onSubmit() {
    this.currSurvey.status = "Published";
    this.surveyService.addSurvey(this.currSurvey);
    console.log(this.currSurvey);
    this.router.navigate(["/admin/surveys/add/success"], {
      state: { id: this.currSurvey.surveyID },
    });
  }

  onSelectQuestion(id: number) {
    this.currQuestion = this.currSurvey.questionsAndAnswers[id];
    this.displayGeneralInfo = false;
  }

  onDeleteQuestion(id: number) {
    this.currSurvey.questionsAndAnswers.splice(id, 1);
  }

  onDeleteAnswer(id: number) {
    this.currQuestion.options.splice(id, 1);
  }

  onAddQuestion() {
    let qid =
      this.currSurvey.questionsAndAnswers[this.currSurvey.questionsAndAnswers.length - 1]
        .questionID + 1;
    this.currSurvey.questionsAndAnswers.push({
      questionID: qid,
      question: "Question " + qid,
      numberOfAnswers: 4,
      options: [
        { answerID: 0, answer: "" },
        { answerID: 1, answer: "" },
        { answerID: 2, answer: "" },
        { answerID: 3, answer: "" },
      ],
    });
  }

  onAddAnswer() {
    let aid = this.currQuestion.options[this.currQuestion.options.length - 1].answerID + 1;
    this.currQuestion.options.push({ answerID: aid, answer: "" });
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
    //   let storageDrafts = localStorage.getItem("drafts")!;
    //   if (!localStorage.getItem("drafts")) {
    //     localStorage.setItem("drafts", JSON.stringify([this.currSurvey]));
    //   } else {
    //     localStorage.setItem(
    //       "drafts",
    //       JSON.stringify(JSON.parse(storageDrafts).concat([this.currSurvey]))
    //     );
    //   }
    this.surveyService.addSurvey(this.currSurvey);
    console.log(this.currSurvey);
    this.router.navigate(["/admin/manage-surveys"]);
  }

  onDiscard() {
    this.router.navigate(["/admin/surveys/manage"]);
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

  addedUsers: string[] = [];
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
  }

  invite() {
    this.modalRef?.hide();
    this.survey.assignSurveyToUsers(this.currSurvey.surveyID, this.addUsers).subscribe((res) => {
      this.addedUsers.push(...this.addUsers);
      this.users = this.users.filter((x) => !this.addedUsers.includes(x.userName));
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

  getAddedUsers() {
    this.survey
      .getSurveyAssigneesBySurveyIDWithName(this.currSurvey.surveyID)
      .subscribe((res: any) => {
        for (let i = 0; i < res.length; i++) {
          this.addedUsers.push(res[i].userName);
        }
      });
  }
}
