import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Questions } from 'src/app/model/questions';
import { Survey } from 'src/app/model/survey';
import { AlertifyService } from 'src/app/services/alertify.service';
import { SurveyService } from 'src/app/services/survey.service';

@Component({
  selector: 'app-user-fill-out',
  templateUrl: './user-fill-out.component.html',
  styleUrls: ['./user-fill-out.component.css']
})
export class UserFillOutComponent implements OnInit {

  public surveyID!: number;
  userSubmissionForm!: FormGroup;
  userAnswers: any;
  allQuestions: Questions[] = [];
  totalQuestions: number = 0;
  currSubmission: { surveyID: number, questionsAndAnswers: { [key: number]: number} } = {
    surveyID: 0,
    questionsAndAnswers: {}
  };

  currQuestion!: Questions;
  currQuestionID: number = 0;
  // survey = new Survey();
  survey: Survey =
    {
    "id": 1,
    "title": "Survey1",
    "description": "This is a survey",
    "status": "Open",
    "numberOfQuestions": 2,
    "priority": "low",
    "dueDate": Date.now().toString(),
    "QA":[ 
      {
        "id": 1,
        "text": "Favourite color",
        "options": [
          {"id": 1, "answer": "option1"}, 
          {"id": 2, "answer": "option2"}
        ],
        "selectedAnswerID": null,
      },
      {
        "id": 2,
        "text": "Favourite object",
        "options": [
          {"id": 1, "answer": "option1"}, 
          {"id": 2, "answer": "option2"}
        ],
        "selectedAnswerID": null,
      }
      ]
    }
  constructor(private route: ActivatedRoute,
              private router: Router,
              private surveyService: SurveyService,
              private alertify: AlertifyService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userSubmissionForm = this.formBuilder.group({});
    this.surveyID = +this.route.snapshot.params['id'];

    this.allQuestions = this.survey.QA;
    this.totalQuestions = this.allQuestions.length;
    this.currQuestion = this.allQuestions[this.currQuestionID];
    console.log(this.allQuestions);
    console.log(this.currQuestionID);
    console.log(this.currQuestion);

    // Initialize the questions in the currentSubmission JSON
    this.currSubmission.surveyID = this.surveyID;
    for (const questionKey in this.allQuestions) {
      const question = this.allQuestions[questionKey];
      this.currSubmission.questionsAndAnswers[question.id] = 0;
      this.userSubmissionForm.addControl(`question${question.id}`, new FormControl(null, Validators.required));
    }
    console.log(this.currSubmission);
    console.log(this.userSubmissionForm);
  }

  changeQuestion(questionID: number) {
    // Index is 0-based
    const newQuestion = questionID;
    if (newQuestion < 0 || newQuestion >= this.totalQuestions) {
      this.alertify.error("Invalid")
    }
    else {
      // Store selected answer ID in currSubmission
      const formControl = this.userSubmissionForm.get("answers");
      console.log(formControl);
      this.currQuestionID = questionID;
      this.currQuestion = this.allQuestions[this.currQuestionID];
      console.log(this.currSubmission);
      console.log(this.currQuestion);
      if (this.currQuestion.selectedAnswerID === null) {
        console.log("Hello");
        formControl?.reset();
      }
      else {

      }
    }
  }

  updateSelectedAnswer(selectedAnswerID: number) {
    this.allQuestions[this.currQuestionID].selectedAnswerID = selectedAnswerID;
    this.currSubmission.questionsAndAnswers[this.currQuestionID + 1] = Number(this.allQuestions[this.currQuestionID].selectedAnswerID);
  }

  saveAsDraft() {
    console.log(this.currSubmission);
    const draft = {
      surveyID: this.currSubmission.surveyID,
      questionsAndAnswers: { ...this.currSubmission.questionsAndAnswers }
    };
  
    let storageDrafts = localStorage.getItem('userDraft')!;
    if (!localStorage.getItem('userDraft')) {
      localStorage.setItem('userDraft', JSON.stringify([draft]));
    } else {
      localStorage.setItem('userDraft', JSON.stringify(JSON.parse(storageDrafts).concat([draft])));
    }
  }

  onSubmit() {
    if (this.userSubmissionForm.valid && this.currQuestionID == this.totalQuestions - 1) {
      this.surveyService.submitUserAnswers(this.surveyID, this.userAnswers).subscribe(
        () => {
          this.alertify.success('Answers submitted');
          console.log(this.userSubmissionForm);
          this.router.navigate(['/home']);
        }
      );
    }
  }
}
