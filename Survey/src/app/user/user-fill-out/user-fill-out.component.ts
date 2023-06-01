import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Answer } from "src/app/model/answer";
import { Question } from "src/app/model/question";
import { Survey } from "src/app/model/survey";
import { UserAnswers } from "src/app/model/userAnswers";
import { AlertifyService } from "src/app/services/alertify.service";
import { SurveyService } from "src/app/services/survey.service";

@Component({
  selector: "app-user-fill-out",
  templateUrl: "./user-fill-out.component.html",
  styleUrls: ["./user-fill-out.component.css"],
})
export class UserFillOutComponent implements OnInit {
  public surveyID!: number;
  userSubmissionForm!: FormGroup;
  allQuestions: Array<Question> = [];
  totalQuestions: number = 0;
  currSubmission: UserAnswers = { surveyID: 0, questionsAndAnswers: {} };
  currQuestion!: Question;
  currQuestionID: number = 0;
  survey: Survey = {
    surveyID: 1,
    title: "Survey1",
    description: "This is a survey",
    status: "Open",
    numberOfQuestions: 2,
    priority: "low",
    dueDate: new Date(),
    questionsAndAnswers: [
      {
        questionID: 1,
        question: "Favourite color",
        numberOfAnswers: 2,
        options: [
          { answerID: 1, answer: "option1" },
          { answerID: 2, answer: "option2" },
        ],
      },
      {
        questionID: 2,
        question: "Favourite object",
        numberOfAnswers: 2,
        options: [
          { answerID: 1, answer: "option1" },
          { answerID: 2, answer: "option2" },
        ],
      },
    ],
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private alertify: AlertifyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.userSubmissionForm = this.formBuilder.group({});
    this.surveyID = +this.route.snapshot.params["id"];

    this.allQuestions = this.survey.questionsAndAnswers;
    this.totalQuestions = this.allQuestions.length;
    this.currQuestion = this.allQuestions[this.currQuestionID];
    // console.log(this.allQuestions);
    // console.log(this.currQuestionID);
    // console.log(this.currQuestion);

    // Initialize the questions in the currentSubmission JSON
    console.log(this.surveyID);
    this.currSubmission.surveyID = this.surveyID;
    for (const questionKey in this.allQuestions) {
      const question = this.allQuestions[questionKey];
      this.currSubmission.questionsAndAnswers[question.questionID] = 0;
      this.userSubmissionForm.addControl(
        `question${question.questionID}`,
        new FormControl(null, Validators.required)
      );
    }
    console.log(this.currSubmission);
    console.log(this.userSubmissionForm);
  }

  checkIfAnswered(answerID: number) {
    return this.currSubmission.questionsAndAnswers[this.currQuestion.questionID] === answerID;
  }

  changeQuestion(questionID: number) {
    // Index is 0-based
    const newQuestion = questionID;
    if (newQuestion < 0 || newQuestion >= this.totalQuestions) {
      this.alertify.error("Invalid");
    } else {
      // Store selected answer ID in currSubmission
      this.currQuestionID = questionID;
      this.currQuestion = this.allQuestions[this.currQuestionID];
      console.log(this.currSubmission);
      console.log(this.currQuestion);
    }
  }

  updateSelectedAnswer(selectedAnswerID: number) {
    this.currSubmission.questionsAndAnswers[this.currQuestionID + 1] = selectedAnswerID;
  }

  saveAsDraft() {
    console.log(this.currSubmission);
    localStorage.setItem("userDraft", JSON.stringify([this.currSubmission]));
  }

  onSubmit() {
    if (this.userSubmissionForm.valid && this.currQuestionID == this.totalQuestions - 1) {
      this.surveyService.submitUserAnswers(this.surveyID, this.currSubmission).subscribe(() => {
        this.alertify.success("Answers submitted");
        console.log(this.userSubmissionForm);
        this.router.navigate(["/home"]);
      });
    }
  }
}
