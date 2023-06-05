import { Injectable } from "@angular/core";
import { Survey } from "../model/survey";
import * as FileSaver from "file-saver";
import { formatDate } from "@angular/common";
import { Chart } from "chart.js";
import { jsPDF } from "jspdf";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  temp = true;
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

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1 / 2,
  };
  constructor() {}

  sum(arr: number[]) {
    var sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum;
  }

  generateCSVContent(survey: Survey, surveyData: any, surveyLabels: string[][]) {
    const separator = ",";

    const surveyInfo =
      "Survey" +
      separator +
      survey.surveyID +
      "\n" +
      "Title" +
      separator +
      survey.title +
      "\n" +
      "Description" +
      separator +
      survey.description +
      "\n" +
      "Status" +
      separator +
      survey.status +
      "\n" +
      "Priority" +
      separator +
      survey.priority +
      "\n" +
      "Due Date" +
      separator +
      formatDate(survey.dueDate, "dd/MM/YYYY hh:mm:ss", "en_US") +
      "\n" +
      "Number of Questions" +
      separator +
      survey.numberOfQuestions +
      "\n\n" +
      "CSV Download Date" +
      separator +
      formatDate(Date.now(), "dd/MM/YYYY hh:mm:ss", "en_US") +
      "\n";

    var questionInfo = [];

    for (let i = 0; i < survey.numberOfQuestions; i++) {
      var numberOfOptions = "";
      var options = "";
      var answers = "";
      for (let j = 0; j < surveyData[i].data.length; j++) {
        numberOfOptions += "Question " + (i + 1) + "- option " + (j + 1) + separator;
        options += surveyLabels[i][j] + separator;
        answers += surveyData[i].data[j] + separator;
      }
      questionInfo.push(
        "\n\n" +
          "Question " +
          (i + 1) +
          separator +
          "Number of Options: " +
          surveyData[i].data.length +
          separator +
          numberOfOptions +
          "\n" +
          surveyData[i].label +
          separator +
          separator +
          options +
          "\n" +
          "Total Answers" +
          separator +
          this.sum(surveyData[i].data) +
          separator +
          answers
      );
    }

    const csvContent: any = surveyInfo + questionInfo;

    this.exportFile(csvContent, "text/csv");
  }

  generatePDFContent(survey: Survey, surveyData: any, surveyLabels: string[][], question: number) {
    var doc = new jsPDF("p", "pt", "a4", true);
    var chart: Chart;
    chart = new Chart("canvas2", {
      type: "bar",
      data: {
        labels: surveyLabels[question],
        datasets: [
          {
            label: survey.questionsAndAnswers[question].question,
            data: surveyData[question]["data" as keyof object],
            backgroundColor: this.defaultColors,
          },
        ],
      },
      options: this.chartOptions,
    });

    doc.setFontSize(25);
    doc.text("Survey Results", 40, 40);
    doc.setFontSize(15);
    doc.text("Question: " + survey.questionsAndAnswers[question].question, 40, 80);

    var options = "";
    let i = 0;
    for (i = 0; i < surveyData[question].data.length - 1; i++) {
      options += surveyLabels[question][i] + ": " + surveyData[question].data[i] + " answers, ";
    }

    doc.text(
      "Options: " +
        options +
        surveyLabels[question][i] +
        ": " +
        surveyData[question].data[i] +
        " answers",
      40,
      110
    );
    doc.text("Total Answers: " + this.sum(surveyData[question].data), 40, 140);
    var newCanvas = <HTMLCanvasElement>chart.canvas.cloneNode(true);
    var ctx = newCanvas.getContext("2d");
    ctx!.fillStyle = "#FFF";
    ctx!.fillRect(0, 0, newCanvas.width, newCanvas.height);

    setTimeout(() => {
      ctx!.drawImage(chart.canvas, 0, 0, newCanvas.width, newCanvas.height);

      doc.addImage(
        newCanvas.toDataURL("image/jpeg", 1.0),
        "JPEG",
        40,
        170,
        500,
        300,
        undefined,
        "FAST"
      );
      chart.destroy();
      doc.save(survey.title + "_Report.pdf");
    }, 1000);
  }

  exportFile(data: any, fileType: string) {
    const blob = new Blob([data], { type: fileType });
    FileSaver.saveAs(blob, "Survey_Report.csv");
  }
}
