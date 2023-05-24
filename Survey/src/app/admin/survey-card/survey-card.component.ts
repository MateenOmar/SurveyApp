import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-survey-card',
  templateUrl: './survey-card.component.html',
  styleUrls: ['./survey-card.component.css']
})
export class SurveyCardComponent implements OnInit {
@Input() survey: any;
@Input() parent: any;
  constructor() { }

  ngOnInit() {
  }

  onDelete() {
    this.parent.removeSurvey(this.survey.Id);
  }

  onPublish() {
    this.parent.publishSurvey(this.survey.Id);
  }

  onClose() {
    this.parent.closeSurvey(this.survey.Id);
  }

}
