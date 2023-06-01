import { Component, OnInit, Input } from "@angular/core";
import { AccordionConfig } from "ngx-bootstrap/accordion";
import { UserData } from "src/app/model/user";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-user-manage",
  templateUrl: "./user-manage.component.html",
  styleUrls: ["./user-manage.component.css"],
})
export class UserManageComponent implements OnInit {
  oneAtATime = true;
  isContentOpen: boolean = false;
  users: UserData[];
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getUsers().subscribe((res: any) => {
      this.users = res as UserData[];
    });
  }

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
        this.auth.deleteUser(userName).subscribe((res: any) => {});
        Swal.fire("Deleted!", "The user has been removed.", "success");
      }
    });
  }
}
