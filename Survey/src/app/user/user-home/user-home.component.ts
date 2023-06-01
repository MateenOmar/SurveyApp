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
  surveysAssigned: Array<SurveyAssignee>;
  priorityFilter: string = "";
  statusFilter: string = "";
  sortByParam = "";
  sortDirection = "desc";
  loggedInUser: string = "";

  constructor(private surveyService: SurveyService) {
    this.surveysAssigned = [];
  }

  ngOnInit(): void {
    let item = document.getElementById("All_Statuses");
    item?.classList.add("highlight");
    item = document.getElementById("All_Priorities");
    item?.classList.add("highlight");

    const userName = localStorage.getItem("userName");
    if (userName !== null) {
      this.loggedInUser = userName;
    } 
    else{
      console.error("User is not valid");
    }

    this.surveyService.getSurveyAssigneesByUser(this.loggedInUser).subscribe(
      (data) => {
        this.surveysAssigned = data as SurveyAssignee[];
        console.log(data)
      }, error => {
        console.log("httperror:");
        console.log(error);
      }
    )
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
