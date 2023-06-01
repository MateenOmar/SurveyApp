import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-link',
  templateUrl: './survey-link.component.html',
  styleUrls: ['./survey-link.component.css']
})
export class SurveyLinkComponent implements OnInit {
  id: number;
  baseURL: string;

  constructor(private router: Router) {
    this.id = this.router.getCurrentNavigation()?.extras.state?.['id'];
  }

  ngOnInit() {
    this.baseURL = window.location.origin + "/fill-out/";
  }

}
