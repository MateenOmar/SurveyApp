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
  constructor(
    private auth: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {}

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value);
    this.auth.authUser(loginForm.value).subscribe((response: any) => {
      console.log(response);
      const user = response;
      localStorage.setItem("token", user.token);
      localStorage.setItem("userName", user.userName);
      localStorage.setItem("admin", user.admin);
      this.alertify.success("Login Successful");
      this.router.navigate(["/register"]);
    });
  }
}
