import { Component, HostBinding, HostListener, OnInit } from "@angular/core";
import { Route, Router } from "@angular/router";
import { BasicSurvey } from "src/app/model/basicSurvey";
import { Survey } from "src/app/model/survey";
import { AlertifyService } from "src/app/services/alertify.service";
import { SurveyService } from "src/app/services/survey.service";

@Component({
  selector: "app-manage-surveys",
  templateUrl: "./manage-surveys.component.html",
  styleUrls: ["./manage-surveys.component.css"],
})
export class ManageSurveysComponent implements OnInit {
  SearchByStatus: string = "All";
  Surveys: Array<BasicSurvey> = [];

  constructor(
    private alertify: AlertifyService,
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem("token") == null || localStorage.getItem("admin") === "false") {
      this.router.navigate(["/"]);
    }
    this.surveyService.getBasicSurveys().subscribe((data) => {
      this.Surveys = data;
      console.log(this.Surveys);
    });
  }

  @HostListener("window:scroll", [])
  onScrollEvent() {
    let elem = document.getElementById("filters");
    console.log(elem!.offsetTop);
    if (window.scrollY < 60) {
      elem!.style.top = 129 - window.scrollY + "px";
    } else if (elem!.offsetTop == 129) {
      elem!.style.top = 129 - 60 + "px";
    }
  }

  removeSurvey(surveyID: number, surveyTitle: string) {
    this.Surveys = this.Surveys.filter((survey) => survey.surveyID != surveyID);
    this.surveyService.deleteSurvey(surveyID).subscribe();
    this.alertify.success('You have successfully removed survey "' + surveyTitle + '"');
  }

  publishSurvey(surveyID: number) {
    this.Surveys = this.Surveys.map((survey) => {
      if (survey.surveyID == surveyID) {
        survey.status = "Published";
      }
      return survey;
    });
    let patchDoc = [
      {
        op: "replace",
        path: "/status",
        value: "Published",
      },
    ];
    console.log(patchDoc);
    this.surveyService.patchSurvey(surveyID, patchDoc).subscribe(() => {
      this.surveyService.sendEmails(surveyID).subscribe();
    });
    this.alertify.success("You have successfully published survey with ID" + surveyID);
  }

  closeSurvey(surveyID: number) {
    this.Surveys = this.Surveys.map((survey) => {
      if (survey.surveyID == surveyID) {
        survey.status = "Finished";
      }
      return survey;
    });
    let patchDoc = [
      {
        op: "replace",
        path: "/status",
        value: "Finished",
      },
    ];
    this.surveyService.patchSurvey(surveyID, patchDoc).subscribe();
    this.alertify.success("You have successfully closed survey with ID" + surveyID);
  }

  setSurveyFilter(filter: string) {
    let prevItem = document.getElementById(this.SearchByStatus);
    let item = document.getElementById(filter);

    prevItem?.classList.remove("highlight");
    item?.classList.add("highlight");

    this.SearchByStatus = filter;
  }
}
