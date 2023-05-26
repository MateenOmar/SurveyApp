import { Component, OnInit, TemplateRef } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

@Component({
  selector: "app-assign-survey",
  templateUrl: "./assign-survey.component.html",
  styleUrls: ["./assign-survey.component.css"],
})
export class AssignSurveyComponent implements OnInit {
  modalRef?: BsModalRef;
  items: any[];

  constructor(private modalService: BsModalService) {
    this.items = Array(15).fill(0);
  }

  ngOnInit(): void {}

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
