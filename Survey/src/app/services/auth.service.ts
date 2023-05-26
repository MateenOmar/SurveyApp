import { Injectable } from "@angular/core";
import { UserForLogin, UserForRegister } from "../model/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseURL = environment.baseUrl;
  constructor(private http: HttpClient) {}

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
    return this.http.delete(this.baseURL + "/account/users/delete" + userName);
  }

  updateUser(userName: string, user: UserForRegister) {
    return this.http.put(this.baseURL + "/account/users/update/" + userName, user);
  }
}
