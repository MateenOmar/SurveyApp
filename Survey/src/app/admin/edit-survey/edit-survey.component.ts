import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Survey } from "src/app/model/survey";
import { SurveyService } from "src/app/services/survey.service";

@Component({
  selector: "app-edit-survey",
  templateUrl: "./edit-survey.component.html",
  styleUrls: ["./edit-survey.component.css"],
})
export class EditSurveyComponent implements OnInit {
  survey: Survey;
  allDataFetched: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit() {
    if (localStorage.getItem("token") == null || localStorage.getItem("admin") === "false") {
      this.router.navigate(["/"]);
    }
    this.route.params.subscribe((params) => {
      this.surveyService.getCompleteSurveyByID(+params["id"]).subscribe((data) => {
        this.survey = data;
        this.allDataFetched = true;
        console.log(this.survey);
      });
    });
  }
}
