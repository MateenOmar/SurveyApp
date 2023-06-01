import { Component, OnInit } from "@angular/core";
import { ChartData, ChartEvent, ChartType } from "chart.js";
import { SurveyService } from "src/app/services/survey.service";
import { Survey } from "src/app/model/survey";
import { Chart, Colors } from "chart.js/auto";

@Component({
  selector: "app-survey-results",
  templateUrl: "./survey-results.component.html",
  styleUrls: ["./survey-results.component.css"],
})
export class SurveyResultsComponent implements OnInit {
  //surveys: Survey[];
  surveys: Survey;
  surveyLabels: string[][] = [];
  surveyData: object[] = [];
  surveyQuestions: string[] = [];
  chart: Chart;
  currentQuestion: number = 0;
  constructor(private surveyService: SurveyService) {}

  ngOnInit() {
    this.getSurveys();
  }

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1 / 2,
    plugins: {
      colors: {
        forceOverride: true,
      },
    },
  };

  public chartClicked({ event, active }: { event: ChartEvent; active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: ChartEvent; active: {}[] }): void {
    console.log(event, active);
  }

  getSurveys() {
    //this.surveyService.getSurveys().subscribe((res: Survey[]) => {
    this.surveyService.getSurveyByID(1).subscribe((res: Survey) => {
      //this.surveys = res;
      this.surveys = res;
      this.populateData();
    });
  }

  populateData() {
    this.surveyService.getSurveyAnswers(1).subscribe((res: any) => {
      //var numberOfAnswers = this.surveys[0].questionsAndAnswers;
      var numberOfAnswers = this.surveys.questionsAndAnswers;

      //for (let i = 0; i < this.surveys[0].numberOfQuestions; i++) {
      for (let i = 0; i < this.surveys.numberOfQuestions; i++) {
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
        // @ts-ignore: Argument of type 'string' is not assignable to parameter of type 'number'
        this.surveyData[res[i].questionID - 1].data[res[i].answerID - 1] += 1;
      }

      this.createChart("doughnut");
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
            label: this.surveys.questionsAndAnswers[this.currentQuestion].question,
            //label: this.surveys[0].questionsAndAnswers[this.currentQuestion].question,
            data: this.surveyData[this.currentQuestion]["data" as keyof object],
          },
        ],
      },
      options: this.chartOptions,
    });
  }

  onTabSelect(event: any) {
    // if (this.currentQuestion == 0) {
    //   this.currentQuestion = 1;
    // } else {
    //   this.currentQuestion = 0;
    // }

    this.chart.destroy();
    this.createChart(event.id);
  }
}
