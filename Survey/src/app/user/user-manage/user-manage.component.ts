import { Component, OnInit, Input } from "@angular/core";
import { AccordionConfig } from "ngx-bootstrap/accordion";
import { UserForRegister } from "src/app/model/user";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-manage",
  templateUrl: "./user-manage.component.html",
  styleUrls: ["./user-manage.component.css"],
})
export class UserManageComponent implements OnInit {
  oneAtATime = true;
  isContentOpen: boolean = false;
  users: UserForRegister[] = [
    {
      userName: "Billy",
      password: "",
      firstName: "Joe",
      lastName: "Bills",
      email: "billy@soti.net",
    },
    { userName: "test", password: "test", firstName: "test", lastName: "test", email: "test" },
    { userName: "test", password: "test", firstName: "test", lastName: "test", email: "test" },
  ];
  constructor() {}

  ngOnInit() {}

  onDelete(userName: string) {
    console.log(userName);
    Swal.fire({
      title: "Remove " + userName + " from the system?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "The user has been removed.", "success");
      }
    });
  }
}
