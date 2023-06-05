import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertifyService } from "src/app/services/alertify.service";
import { AuthService } from "src/app/services/auth.service";
@Component({
  selector: "app-user-login",
  templateUrl: "./user-login.component.html",
  styleUrls: ["./user-login.component.css"],
})
export class UserLoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("token") != null && localStorage.getItem("admin") === "false") {
      this.router.navigate(["/user/surveys"]);
    } else if (localStorage.getItem("token") != null && localStorage.getItem("admin") === "true") {
      this.router.navigate(["/admin/surveys/manage"]);
    }
  }

  onLogin(loginForm: NgForm) {
    this.auth.login(loginForm);
  }
}
