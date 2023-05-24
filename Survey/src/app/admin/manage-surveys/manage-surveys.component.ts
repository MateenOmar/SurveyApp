import { Component, HostBinding, OnInit } from '@angular/core';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-manage-surveys',
  templateUrl: './manage-surveys.component.html',
  styleUrls: ['./manage-surveys.component.css']
})

export class ManageSurveysComponent implements OnInit {
  SearchByStatus: string = 'Draft';
  Surveys: Array<any> = [
    {
    "Id": 1,
    "Title": "Survey1",
    "Description": "This is a survey",
    "Status": "Draft",
    "QA": {
      "question1": ["option1", "option2"],
      "question2": ["option1", "option2"]
      }
    },
    {
      "Id": 2,
      "Title": "Survey2",
      "Description": "This is a survey2",
      "Status": "Published",
      "QA": {
        "question1": ["option1", "option2"],
        "question2": ["option1", "option2"]
      }
    },
    {
      "Id": 3,
      "Title": "Survey3",
      "Description": "This is a survey3",
      "Status": "Finished",
      "QA": {
        "question1": ["option1", "option2"],
        "question2": ["option1", "option2"]
      }
    },
    {
      "Id": 4,
      "Title": "Survey4",
      "Description": "This is a survey",
      "Status": "Draft",
      "QA": {
        "question1": ["option1", "option2"],
        "question2": ["option1", "option2"]
        }
    }
  ];


  constructor(private alertify: AlertifyService) { }

  ngOnInit() {
  }

  removeSurvey(surveyID: number) {
    this.Surveys = this.Surveys.filter(survey => survey.Id != surveyID)
    this.alertify.success("You have successfully removed survey with ID " + surveyID)
  }

  publishSurvey(surveyID: number) {
    this.Surveys = this.Surveys.map(survey =>{
      if (survey.Id == surveyID) {
        survey.Status = "Published";
      }
      return survey;
    })
    this.alertify.success("You have successfully published survey with ID" + surveyID)
  }

  closeSurvey(surveyID: number) {
    this.Surveys = this.Surveys.map(survey =>{
      if (survey.Id == surveyID) {
        survey.Status = "Finished";
      }
      return survey;
    })
    this.alertify.success("You have successfully closed survey with ID" + surveyID)
  }

  setSurveyFilter(filter: string) {
    let prevItem = document.getElementById(this.SearchByStatus);
    let item = document.getElementById(filter);

    prevItem?.classList.remove('highlight');
    item?.classList.add('highlight');

    this.SearchByStatus = filter;
  }

}
