import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Survey } from "src/app/model/survey";
import { SurveyService } from "src/app/services/survey.service";
import { SurveyCardComponent } from "../../admin/survey-card/survey-card.component";
import { SurveyAssignee } from "src/app/model/surveyAssignee";

@Component({
  selector: "app-user-home",
  templateUrl: "./user-home.component.html",
  styleUrls: ["./user-home.component.css"],
})
export class UserHomeComponent implements OnInit {
  surveys: Array<Survey>;
  surveysAssigned: Array<SurveyAssignee>;
  // surveys: Array<any> = [
  //   {
  //     Id: 1,
  //     Title: "Survey1",
  //     Description: "This is a survey",
  //     Priority: "Low",
  //     Status: "Open",
  //     QA: {
  //       question1: ["option1", "option2"],
  //       question2: ["option1", "option2"],
  //     },
  //   },
  //   {
  //     Id: 2,
  //     Title: "Survey2",
  //     Description: "This is a survey2",
  //     Priority: "Low",
  //     Status: "Open",
  //     QA: {
  //       question1: ["option1", "option2"],
  //       question2: ["option1", "option2"],
  //     },
  //   },
  //   {
  //     Id: 3,
  //     Title: "Survey3",
  //     Description: "This is a survey3",
  //     Status: "In-Progress",
  //     Priority: "Medium",
  //     QA: {
  //       question1: ["option1", "option2"],
  //       question2: ["option1", "option2"],
  //     },
  //   },
  //   {
  //     Id: 4,
  //     Title: "Survey4",
  //     Description: "This is a survey",
  //     Priority: "High",
  //     Status: "Completed",
  //     QA: {
  //       question1: ["option1", "option2"],
  //       question2: ["option1", "option2"],
  //     },
  //   },
  // ];
  priorityFilter: string = "";
  statusFilter: string = "";
  sortByParam = "";
  sortDirection = "desc";

  constructor(private surveyService: SurveyService) {
    this.surveys = [];
    this.surveysAssigned = [];
  }

  ngOnInit(): void {
    let item = document.getElementById("All_Statuses");
    item?.classList.add("highlight");
    item = document.getElementById("All_Priorities");
    item?.classList.add("highlight");

    this.surveyService.getSurveys().subscribe(
      (data) => {
        this.surveys = data;
        console.log(data);
      }, error => {
        console.log("httperror:")
        console.log(error);
      }
    );

    
  }

  onSortDirection() {
    if (this.sortDirection === "desc") {
      this.sortDirection = "asc";
    } else {
      this.sortDirection = "desc";
    }
  }

  setStatusFilter(filter: string) {
    let item = document.getElementById(filter);
    item?.classList.add("highlight");

    let prevItem;
    if (this.statusFilter === "") {
      prevItem = document.getElementById("All_Statuses");
    }
    else {
      prevItem = document.getElementById(this.statusFilter);
    }
    prevItem?.classList.remove("highlight");

    if (filter === "All_Statuses") {
      this.statusFilter = "";
    }
    else {
      this.statusFilter = filter;
    }
  }

  setPriorityFilter(filter: string) {
    let item = document.getElementById(filter);
    item?.classList.add("highlight");

    let prevItem;
    if (this.priorityFilter === "") {
      prevItem = document.getElementById("All_Priorities");
    }
    else {
      prevItem = document.getElementById(this.priorityFilter);
    }
    prevItem?.classList.remove("highlight");

    if (filter === "All_Priorities") {
      this.priorityFilter = "";
    }
    else {
      this.priorityFilter = filter;
    }
  }
}
