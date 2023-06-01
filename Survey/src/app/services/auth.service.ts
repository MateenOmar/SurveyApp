import { Injectable } from "@angular/core";
import { UserData, UserForLogin, UserForRegister } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject } from "rxjs";
import { NgForm } from "@angular/forms";
import { AlertifyService } from "./alertify.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseURL = environment.baseUrl;
  public isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  setIsLoggedIn() {
    this.isLoggedIn.next(localStorage.getItem("token") != null);
  }

  get getIsLoggedIn() {
    return this.isLoggedIn.asObservable();
  }

  login(loginForm: NgForm) {
    this.authUser(loginForm.value).subscribe((response: any) => {
      console.log(response);
      const user = response;
      localStorage.setItem("token", user.token);
      localStorage.setItem("userName", user.userName);
      localStorage.setItem("admin", user.admin);
      this.alertify.success("Login Successful");
      if (user.admin) {
        this.router.navigate(["/admin/surveys/manage"]);
      } else {
        this.router.navigate(["/user/surveys"]);
      }
    });
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("admin");
    this.setIsLoggedIn();
    this.alertify.success("You have been logged out!");
    this.router.navigate(["/"]);
  }

  authUser(user: UserForLogin) {
    return this.http.post(this.baseURL + "/account/login", user);
  }

  registerUser(user: UserForRegister) {
    return this.http.post(this.baseURL + "/account/register", user);
  }

  getUsers() {
    return this.http.get(this.baseURL + "/account/users");
  }

  getUserByUser(userName: string) {
    return this.http.get(this.baseURL + "/account/users/" + userName);
  }

  deleteUser(userName: string) {
    return this.http.delete(this.baseURL + "/account/users/delete/" + userName);
  }

  updateUser(userName: string, user: UserForRegister, userData: UserData) {
    var payload = [];
    for (var key in user) {
      if (Object(user)[key] != null && Object(user)[key] != Object(userData)[key]) {
        payload.push({ op: "replace", path: "/" + key, value: Object(user)[key] });
      }
    }

    return this.http.patch(this.baseURL + "/account/users/update/" + userName, payload);
  }
}
