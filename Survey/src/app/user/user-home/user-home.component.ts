import { Component, OnInit } from "@angular/core";
import { SurveyService } from "src/app/services/survey.service";
import { AssignedSurvey } from "src/app/model/assignedSurvey";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-home",
  templateUrl: "./user-home.component.html",
  styleUrls: ["./user-home.component.css"],
})
export class UserHomeComponent implements OnInit {
  surveysAssigned: Array<AssignedSurvey>;
  priorityFilter: string = "";
  statusFilter: string = "";
  sortByParam = "";
  sortDirection = "desc";
  loggedInUser: string = "";

  constructor(private surveyService: SurveyService, private router: Router) {
    this.surveysAssigned = [];
  }

  ngOnInit(): void {
    if (localStorage.getItem("token") == null || localStorage.getItem("admin") === "true") {
      this.router.navigate(["/"]);
    }

    let item = document.getElementById("All_Statuses");
    item?.classList.add("highlight");
    item = document.getElementById("All_Priorities");
    item?.classList.add("highlight");

    const userName = localStorage.getItem("userName");
    if (userName !== null) {
      this.loggedInUser = userName;
    } else {
      console.error("User is not valid");
    }

    this.surveyService.getSurveyAssigneesByUser(this.loggedInUser).subscribe(
      (data) => {
        this.surveysAssigned = data as AssignedSurvey[];
        console.log(data)
      }, error => {
        console.log("httperror:");
        console.log(error);
      }
    );
  }

  setStatusFilter(filter: string) {
    let item = document.getElementById(filter);
    item?.classList.add("highlight");

    let prevItem;
    if (this.statusFilter === "") {
      prevItem = document.getElementById("All_Statuses");
    } else {
      prevItem = document.getElementById(this.statusFilter);
    }
    prevItem?.classList.remove("highlight");

    if (filter === "All_Statuses") {
      this.statusFilter = "";
    } else {
      this.statusFilter = filter;
    }
  }

  setPriorityFilter(filter: string) {
    let item = document.getElementById(filter);
    item?.classList.add("highlight");

    let prevItem;
    if (this.priorityFilter === "") {
      prevItem = document.getElementById("All_Priorities");
    } else {
      prevItem = document.getElementById(this.priorityFilter);
    }
    prevItem?.classList.remove("highlight");

    if (filter === "All_Priorities") {
      this.priorityFilter = "";
    } else {
      this.priorityFilter = filter;
    }
  }
}
