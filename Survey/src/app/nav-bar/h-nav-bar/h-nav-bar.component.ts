import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AlertifyService } from "src/app/services/alertify.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-h-nav-bar",
  templateUrl: "./h-nav-bar.component.html",
  styleUrls: ["./h-nav-bar.component.css"],
})
export class HNavBarComponent implements OnInit {
  loggedInUser!: string;
  admin!: boolean;
  constructor(
    private alertify: AlertifyService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loggedInUser = localStorage.getItem("userName")!;
    this.admin = localStorage.getItem("admin") === "true";
  }

  onLogout() {
    this.auth.logout();
  }
}
