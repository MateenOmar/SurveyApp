import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UserData, UserForRegister } from "src/app/model/user";
import { AlertifyService } from "src/app/services/alertify.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.css"],
})
export class UserEditComponent implements OnInit {
  username = this.route.snapshot.paramMap.get("userName");

  registrationForm!: FormGroup;
  user!: UserData;
  userEdit!: UserForRegister;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alertify: AlertifyService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (localStorage.getItem("token") == null || localStorage.getItem("admin") === "false") {
      this.router.navigate(["/"]);
    }
    this.auth.getUserByUser(this.username!).subscribe((res: any) => {
      this.user = res;
      this.createRegistrationForm();
    });
  }

  createRegistrationForm() {
    this.registrationForm = this.fb.group(
      {
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        userName: [this.user.userName],
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [null],
        confirmPassword: [null],
      },
      { validators: this.passwordMatchingValidator }
    );
  }

  passwordMatchingValidator(fc: AbstractControl): ValidationErrors | null {
    return fc.get("password")?.value === fc.get("confirmPassword")?.value
      ? null
      : { notmatched: true };
  }

  get firstName() {
    return this.registrationForm.get("firstName") as FormControl;
  }

  get lastName() {
    return this.registrationForm.get("lastName") as FormControl;
  }

  get email() {
    return this.registrationForm.get("email") as FormControl;
  }

  get userName() {
    return this.registrationForm.get("userName") as FormControl;
  }

  get password() {
    return this.registrationForm.get("password") as FormControl;
  }

  get confirmPassword() {
    return this.registrationForm.get("confirmPassword") as FormControl;
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.auth.updateUser(this.username!, this.userData(), this.user).subscribe(() => {
        this.registrationForm.reset();
        this.alertify.success("User Edited Successfully");
        this.router.navigate(["/admin/users/manage"]);
      });
    }
  }

  userData(): UserForRegister {
    return (this.userEdit = {
      userName: this.userName.value,
      password: this.password.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
    });
  }
}
