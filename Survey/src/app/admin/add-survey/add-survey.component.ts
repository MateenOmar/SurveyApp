import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Question } from 'src/app/model/question';
import { Survey } from 'src/app/model/survey';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css']
})
export class AddSurveyComponent implements OnInit {
  displayGeneralInfo: boolean = true;
  addSurveyForm: FormGroup;
  currentDate: Date = new Date();
  currQuestion: Question;
  currSurvey: Survey = {
    surveyID: 0,
    name: '',
    dueDate: this.addWeeks(this.currentDate, 1),
    description: '',
    numberOfQuestions: 1,
    status: 'Drafted',
    priority: 'Medium',
    questions: [
      {
        questionID: 1,
        question: 'Question 1',
        numberOfAnswers: 4,
        options: [
          {answerID: 0, answer: ''},
          {answerID: 1, answer: ''},
          {answerID: 2, answer: ''},
          {answerID: 3, answer: ''}
        ]
      }
    ]
  };

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.addSurveyForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      due: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required)
    }, this.dueDateValidator);
  }

  ngAfterViewInit() {
    this.setDefaultDate(this.currSurvey.dueDate!);
  }

  onSubmit() {
    this.http.post('http://localhost:5000/api/survey/post', this.currSurvey);
    console.log(this.currSurvey);
    console.log(this.addSurveyForm);
  }

  onSelectQuestion(id: number) {
    this.currQuestion = this.currSurvey.questions[id];
    this.displayGeneralInfo = false;
  }

  onDeleteQuestion(id: number) {
    this.currSurvey.questions.splice(id, 1);
  }

  onDeleteAnswer(id: number) {
    this.currQuestion.options.splice(id, 1)
  }

  onAddQuestion() {
    let qid = this.currSurvey.questions[this.currSurvey.questions.length - 1].questionID + 1
    this.currSurvey.questions.push({
      questionID: qid,
      question: 'Question ' + qid,
      numberOfAnswers: 4,
      options: [
        {answerID:0, answer:''},
        {answerID:1, answer:''},
        {answerID:2, answer:''},
        {answerID:3, answer:''}
      ]
    });
  }

  onAddAnswer() {
    let aid = this.currQuestion.options[this.currQuestion.options.length - 1].answerID + 1;
    this.currQuestion.options.push({answerID: aid, answer: ''});
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
    let myDate: HTMLInputElement = (document.getElementById('due') as HTMLInputElement);
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
    return (fc.get('due')?.value > today || fc.get('due')?.value > 10) ? null : { lessThanToday: true }
  }

  onSaveAsDraft() {
    let storageDrafts = localStorage.getItem('drafts')!;
    if (!localStorage.getItem('drafts')) {
      localStorage.setItem('drafts', JSON.stringify([this.currSurvey]));
    } else {
      localStorage.setItem('drafts', JSON.stringify(JSON.parse(storageDrafts).concat([this.currSurvey])));
    }
  }

  onDiscard() {
    this.router.navigate(["admin/surveys/manage"]);
  }

  get Title() {
    return this.addSurveyForm.controls['title'] as FormControl
  }

  get Description() {
    return this.addSurveyForm.controls['description'] as FormControl
  }

  get Date() {
    return this.addSurveyForm.controls['date'] as FormControl
  }

}
