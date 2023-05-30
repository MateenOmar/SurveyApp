import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-survey-card',
  templateUrl: './survey-card.component.html',
  styleUrls: ['./survey-card.component.css']
})
export class SurveyCardComponent implements OnInit {
@Input() survey: any;
@Input() parent: any;
@Input() userType!: string;
  constructor() { }

  ngOnInit() {
  }

  onDelete() {
    this.parent.removeSurvey(this.survey.id);
  }

  onPublish() {
    this.parent.publishSurvey(this.survey.id);
  }

  onClose() {
    this.parent.closeSurvey(this.survey.id);
  }
}
