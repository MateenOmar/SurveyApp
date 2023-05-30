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

  constructor(private router: Router, private location: Location) {
  }

  ngOnInit() {
    this.id = this.router.getCurrentNavigation()?.extras.state?.['id'];
    this.baseURL = this.location.toString();
  }

}
