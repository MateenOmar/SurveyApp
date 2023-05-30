import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Survey } from 'src/app/model/Survey';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.css']
})
export class AddSurveyComponent implements OnInit {
  displayGeneralInfo: boolean = true;
  addSurveyForm: FormGroup;
  currentDate: Date = new Date()
  currSurvey: Survey = {
    SurveyID: 0,
    Title: '',
    DueDate: new Date(),
    Description: '',
    QA: [
      {
        QId: 1,
        QTitle: 'Question 1',
        Answers: [
          {AId:0, Answer:''},
          {AId:1, Answer:''},
          {AId:2, Answer:''},
          {AId:3, Answer:''}
        ]
      }
    ],
    Priority: 'Medium'
  }
  currQuestion: any;

  constructor() { }

  ngOnInit() {
    this.addSurveyForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      due: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      priority: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    console.log(this.currSurvey);
  }

  onSelectQuestion(id: number) {
    this.currQuestion = this.currSurvey.QA[id];
    this.displayGeneralInfo = false;
  }

  onDeleteQuestion(id: number) {
    this.currSurvey.QA.splice(id, 1);
  }

  onDeleteAnswer(id: number) {
    this.currQuestion.Answers.splice(id, 1)
  }

  onAddQuestion() {
    let qid = this.currSurvey.QA[this.currSurvey.QA.length - 1].QId + 1
    this.currSurvey.QA.push({
      QId: qid,
      QTitle: 'Question ' + qid,
      Answers: [
        {AId:0, Answer:''},
        {AId:1, Answer:''},
        {AId:2, Answer:''},
        {AId:3, Answer:''}
      ]
    });
  }

  onAddAnswer() {
    let aid = this.currQuestion.Answers[this.currQuestion.Answers.length - 1].AId + 1;
    this.currQuestion.Answers.push({AId: aid, Answer: ''});
  }

  onSelectGeneralInfo() {
    this.displayGeneralInfo = true;
  }

}
