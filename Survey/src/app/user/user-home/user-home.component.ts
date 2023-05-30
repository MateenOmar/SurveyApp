import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Survey } from 'src/app/model/survey';
import { SurveyService } from 'src/app/services/survey.service';
import { SurveyCardComponent } from '../../admin/survey-card/survey-card.component';


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  //userType: string = "user";
  // surveys: Array<Survey>;
  surveys: Array<any> = [
    {
    "id": 1,
    "Title": "Survey1",
    "Description": "This is a survey",
    "Status": "Open",
    "QA": {
      "question1": ["option1", "option2"],
      "question2": ["option1", "option2"]
      }
    },
    {
      "id": 2,
      "Title": "Survey2",
      "Description": "This is a survey2",
      "Status": "Open",
      "QA": {
        "question1": ["option1", "option2"],
        "question2": ["option1", "option2"]
      }
    },
    {
      "id": 3,
      "Title": "Survey3",
      "Description": "This is a survey3",
      "Status": "In-Progress",
      "QA": {
        "question1": ["option1", "option2"],
        "question2": ["option1", "option2"]
      }
    },
    {
      "id": 4,
      "Title": "Survey4",
      "Description": "This is a survey",
      "Status": "Completed",
      "QA": {
        "question1": ["option1", "option2"],
        "question2": ["option1", "option2"]
        }
    }
  ];
  today = new Date();
  priority = "";
  searchPriority = "";
  sortByParam = "";
  sortDirection = "desc";
  searchByStatus: string = "";

  constructor(private route: Router,
              private surveyService: SurveyService) {
    // this.surveys = [];
  }

  ngOnInit(): void {
    // this.surveyService.getSurveys().subscribe(
    //   (data) => {
    //     this.surveys = data as Survey[];
    //     console.log(data);
    //   }, error => {
    //     console.log("httperror:")
    //     console.log(error);
    //   }
    // );
  }

  onPriorityFilter() {
    this.searchPriority = this.priority;
  }

  onPriorityFilterClear() {
    this.searchPriority = "";
    this.priority = "";
  }

  onSortDirection() {
    if (this.sortDirection === "desc") {
      this.sortDirection = "asc";
    } else {
      this.sortDirection = "desc";
    }
  }

  setSurveyFilter(filter: string) {
    console.log(this.surveys);
    let prevItem = document.getElementById(this.searchByStatus);
    let item = document.getElementById(filter);
    
    prevItem?.classList.remove('highlight');
    item?.classList.add('highlight');
    
    if (filter === "All") {
      this.searchByStatus = "";
    }
    else {
      this.searchByStatus = filter;
    }
  }
}