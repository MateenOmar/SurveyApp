import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertifyService } from "src/app/services/alertify.service";
import { AuthService } from "src/app/services/auth.service";
import { SurveyService } from "src/app/services/survey.service";

@Component({
  selector: "app-h-nav-bar",
  templateUrl: "./h-nav-bar.component.html",
  styleUrls: ["./h-nav-bar.component.css"],
})
export class HNavBarComponent implements OnInit {
  notifications: number = 0;
  notificationsList: string[] = [];
  urgentNotificationsList: string[] = [];
  surveyIDs: number[] = [];
  loggedInUser!: string;
  admin!: boolean;
  constructor(
    private router: Router,
    public auth: AuthService,
    public surveyService: SurveyService
  ) {}

  ngOnInit() {
    this.loggedInUser = localStorage.getItem("userName")!;
    this.admin = localStorage.getItem("admin") === "true";
    if (!this.admin && this.loggedInUser != null) {
      this.getNotifications();
    }
  }

  getNotifications() {
    this.surveyService.getSurveyAssigneesByUser(this.loggedInUser).subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].completionStatus == "Assigned") {
          this.notifications++;
          this.notificationsList.push(data[i].title);
          this.surveyIDs.push(data[i].surveyID);
          if (Date.parse(data[i].dueDate) - Date.now() < 7 * 1000 * 3600 * 24) {
            this.notifications++;
            this.urgentNotificationsList.push(data[i].title);
          }
        }
      }
    });
  }

  clickNotification(title: string) {
    for (let i = 0; i < this.notificationsList.length; i++) {
      if (this.notificationsList[i] == title) {
        this.router.navigate(["/user/surveys/fill-out/" + this.surveyIDs[i]]);
      }
    }
  }

  removeNotification(title: string) {
    this.notifications--;
    this.notificationsList.splice(this.notificationsList.indexOf(title), 1);
  }

  onLogout() {
    this.auth.logout();
  }
}
