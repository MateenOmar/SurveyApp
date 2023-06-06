import { Component, ElementRef, Input, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from 'src/app/model/question';
import { Survey } from 'src/app/model/survey';
import { UserAnswers } from 'src/app/model/userAnswers';
import { AlertifyService } from 'src/app/services/alertify.service';
import { SurveyService } from 'src/app/services/survey.service';
import { SurveyAssignee } from 'src/app/model/surveyAssignee';

@Component({
  selector: "app-user-fill-out",
  templateUrl: "./user-fill-out.component.html",
  styleUrls: ["./user-fill-out.component.css"],
})
export class UserFillOutComponent implements OnInit {
  @ViewChild("radioButtons") radioButtonsRef: ElementRef;

  public surveyID!: number;
  userSubmissionForm: FormGroup = this.formBuilder.group({});;
  allQuestions: Array<Question> = [];
  totalQuestions: number = 0;
  currSubmission: UserAnswers = { surveyID: 0, username: "", questionAndAnswerIDs: [] };
  currQuestion!: Question;
  currQuestionID: number = 0;
  survey: Survey;
  loggedInUser: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private alertify: AlertifyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    if (localStorage.getItem("token") == null || localStorage.getItem("admin") === "true") {
      this.router.navigate(["/"]);
    }
    this.userSubmissionForm = this.formBuilder.group({});
    this.surveyID = +this.route.snapshot.params["id"];
    const username = localStorage.getItem("userName");
    if (username !== null) {
      this.loggedInUser = username;
    }
    else {
      this.alertify.error("Invalid user");
    }
    this.surveyService.getAssignedSurvey(this.surveyID, this.loggedInUser).subscribe(
      (data) => {
        const surveyAssigned = data as SurveyAssignee;
        if (surveyAssigned.completionStatus === "Completed") {
          this.alertify.error("You already completed this survey!");
          this.router.navigate(["/user/surveys"]);
        }
    });
    this.initializeUserCurrSubmission();
    this.surveyService.getCompleteSurveyByID(this.surveyID).subscribe(
      (data) => {
        this.survey = data;
        this.allQuestions = this.survey.questionsAndAnswers;
        this.totalQuestions = this.allQuestions.length;
        this.currQuestion = this.allQuestions[this.currQuestionID];

        this.initializeFormBuilder();
        let item = document.getElementById("question1");
        console.log(item);
        item?.classList.add("highlight");
      }, error => {
        console.log("httperror:");
        console.log(error);
      });
  }

  initializeUserCurrSubmission() {
    // Initialize currSubmission form
    const currDraft = this.findCurrentDraft();
    if (currDraft !== null) {
        this.currSubmission = currDraft;
    }
    else {
      this.currSubmission.surveyID = this.surveyID;
      this.currSubmission.username = this.loggedInUser;
    }
  }

  initializeFormBuilder() {
    // Add form controls
    for (const questionKey in this.allQuestions) {
      const question = this.allQuestions[questionKey];
      this.userSubmissionForm.addControl(`question${question.questionID}`, new FormControl(null, Validators.required));
    }

    // Fill in existing answers
    this.allQuestions.forEach((question) => {
      question.options.forEach((answer) => {
        if (this.currSubmission.questionAndAnswerIDs.some(obj => obj.answerID === answer.answerID &&
                                                          obj.questionID === question.questionID)) {
          this.userSubmissionForm.patchValue({
            ['question' + question.questionID]: answer.answerID
          });
        }
      });
    });
  }

  findCurrentDraft() {
    const jsonData = localStorage.getItem("userDraft");
    if (jsonData === null) {
      return null;
    }
    const userDrafts = JSON.parse(jsonData);

    if (Array.isArray(userDrafts)) {
      for (const draft of userDrafts) {
        if (draft.surveyID === this.surveyID && draft.username === this.loggedInUser) {
          return draft;
        }
      }
    }
    return null;
  }

  changeQuestion(questionID: number) {
    this.setHighlight(questionID);

    this.currQuestionID = questionID;
    this.currQuestion = this.allQuestions[this.currQuestionID];
    
    item = document.getElementById("question" + (this.currQuestionID + 1));
    console.log(item);
    item?.classList.add("highlight");
  }

  updateSelectedAnswer(selectedAnswerID: number) {
    const questionID = this.currQuestionID + 1;
    const existingAnswer = this.currSubmission.questionAndAnswerIDs.find(
      (item) => item.questionID === questionID
    );

    if (!existingAnswer) {
      this.currSubmission.questionAndAnswerIDs.push({
        questionID: questionID,
        answerID: selectedAnswerID,
      });
    } else {
      existingAnswer.answerID = selectedAnswerID;
      console.log("Answer updated for question ID:", questionID);
    }
  }

  saveAsDraft() {
    const existingData = localStorage.getItem("userDraft");
    let userDraft = [];

    if (existingData) {
      userDraft = JSON.parse(existingData);
    }

    const index = userDraft.findIndex(
      (item: UserAnswers) => item.surveyID === this.currSubmission.surveyID
    );
    if (index !== -1) {
      // Item exists, update it
      userDraft[index] = this.currSubmission;
    } else {
      // Item does not exist, append it
      userDraft.push(this.currSubmission);
    }

    localStorage.setItem("userDraft", JSON.stringify(userDraft));
    var patchDoc = [
      {
        op: "replace",
        path: "/completionStatus",
        value: "In-Progress",
      },
    ];
    this.surveyService
      .changeCompletionStatus(this.surveyID, this.loggedInUser, patchDoc)
      .subscribe(() => {
        this.alertify.success("Answers saved as a draft!");
        this.router.navigate(["/user/surveys"]);
      });
  }

  onSubmit() {
    if (this.userSubmissionForm.valid && this.currQuestionID == this.totalQuestions - 1) {
      this.surveyService.submitUserAnswers(this.currSubmission).subscribe(() => {
        this.alertify.success("Answers submitted");
        console.log(this.userSubmissionForm);
      });
      var patchDoc = [
        {
          op: "replace",
          path: "/completionStatus",
          value: "Completed",
        },
      ];

      this.surveyService
        .changeCompletionStatus(this.surveyID, this.currSubmission.username, patchDoc)
        .subscribe(() => {
          this.router.navigate(["/user/surveys"]);
        });
    } else {
      console.log("Cannot submit");
    }
  }

  setHighlight(newID: number) {
    let prevItem = document.getElementById(this.currQuestionID.toString());
    let item = document.getElementById(newID.toString());

    prevItem?.classList.remove("highlight");
    item?.classList.add("highlight");
  }
}
