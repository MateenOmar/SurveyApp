import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-h-nav-bar',
  templateUrl: './h-nav-bar.component.html',
  styleUrls: ['./h-nav-bar.component.css'],
})
export class HNavBarComponent implements OnInit {
  loggedInUser!: string;
  admin!: boolean;
  constructor(private alertify: AlertifyService, private router: Router) {}

  ngOnInit() {
    this.loggedInUser = localStorage.getItem('userName')!;
    this.admin = localStorage.getItem('admin') === 'true';
  }

  loggedIn() {
    return this.loggedInUser;
  }

  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('admin');
    this.alertify.success('You have been logged out!');
    this.router.navigate(['/']);
  }
}
