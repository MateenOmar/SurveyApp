import { Component, OnInit, ViewChild } from "@angular/core";
import { ChartData, ChartEvent, ChartType } from "chart.js";
import { SurveyService } from "src/app/services/survey.service";
import { Survey } from "src/app/model/survey";
import { Chart } from "chart.js/auto";
import { TabsetComponent } from "ngx-bootstrap/tabs";

@Component({
  selector: "app-survey-results",
  templateUrl: "./survey-results.component.html",
  styleUrls: ["./survey-results.component.css"],
})
export class SurveyResultsComponent implements OnInit {
  @ViewChild("tabset") tabset: TabsetComponent;
  surveys: Survey[];
  surveyLabels: string[][] = [];
  surveyData: object[] = [];
  surveyQuestions: string[] = [];
  chart: Chart;
  surveyNames: string[] = [];
  currentSurvey: number = 0;
  currentQuestion: number = 0;
  currentQuestionText: string = "";
  //currentQuestionNumberOfAnswers: number = 0;
  defaultColors = [
    "#3366CC",
    "#DC3912",
    "#FF9900",
    "#109618",
    "#990099",
    "#3B3EAC",
    "#0099C6",
    "#DD4477",
    "#66AA00",
    "#B82E2E",
    "#316395",
    "#994499",
    "#22AA99",
    "#AAAA11",
    "#6633CC",
    "#E67300",
    "#8B0707",
    "#329262",
    "#5574A6",
    "#651067",
  ];
  constructor(private surveyService: SurveyService) {}

  ngOnInit() {
    this.getSurveys();
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1 / 2,
  };

  public chartClicked({ event, active }: { event: ChartEvent; active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent; active: {}[] }): void {
    console.log(event, active);
  }

  getSurveys() {
    this.surveyService.getAllCompleteSurveys().subscribe((res: Survey[]) => {
      this.surveys = res;
      for (let i = 0; i < this.surveys.length; i++) {
        this.surveyNames.push(this.surveys[i].title);
      }
      this.populateData();
    });
  }

  populateData() {
    this.surveyService
      .getSurveyAnswers(this.surveys[this.currentSurvey].surveyID!)
      .subscribe((res: any) => {
        var numberOfAnswers = this.surveys[this.currentSurvey].questionsAndAnswers;

        for (let i = 0; i < this.surveys[this.currentSurvey].numberOfQuestions; i++) {
          var temp = [];
          for (let j = 0; j < numberOfAnswers[i].numberOfAnswers; j++)
            temp.push(numberOfAnswers[i].options[j].answer);

          this.surveyQuestions.push(numberOfAnswers[i].question);
          this.surveyLabels.push(temp);
          this.surveyData.push({
            label: numberOfAnswers[i].question,
            data: new Array<number>(numberOfAnswers[i].numberOfAnswers).fill(0),
          });
        }

        for (let i = 0; i < res.length; i++) {
          for (let j = 0; j < res[0].questionAndAnswerIDs.length; j++)
            // @ts-ignore: Argument of type 'string' is not assignable to parameter of type 'number'
            this.surveyData[res[i].questionAndAnswerIDs[j].questionID - 1].data[
              res[i].questionAndAnswerIDs[j].answerID - 1
            ] += 1;
        }

        this.onQuestionSelect(this.currentQuestion);
      });
  }

  createChart(type: string) {
    Chart.defaults.scale.grid.display = false;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart("canvas", {
      type: type as ChartType,
      data: {
        labels: this.surveyLabels[this.currentQuestion],
        datasets: [
          {
            label:
              this.surveys[this.currentSurvey].questionsAndAnswers[this.currentQuestion].question,
            data: this.surveyData[this.currentQuestion]["data" as keyof object],
            backgroundColor: this.defaultColors,
          },
        ],
      },
      options: this.chartOptions,
    });
  }

  onTabSelect(event: any) {
    this.chart.destroy();
    this.createChart(event.id);
  }

  onQuestionSelect(questionID: number) {
    document.getElementById("" + this.currentQuestion)?.classList.remove("highlight");
    this.currentQuestion = questionID;
    this.currentQuestionText = this.surveyQuestions[questionID];
    this.tabset.tabs[0].active = true;
    document.getElementById("" + questionID)?.classList.add("highlight");
    this.createChart("doughnut");
  }

  onSurveySelect(surveyID: number) {
    this.currentSurvey = surveyID;
    this.currentQuestion = 0;
    this.currentQuestionText = "";
    this.surveyQuestions = [];
    this.surveyLabels = [];
    this.surveyData = [];
    this.populateData();
  }
}
