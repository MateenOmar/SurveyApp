import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UserForRegister } from "src/app/model/user";
import { AlertifyService } from "src/app/services/alertify.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-user-add",
  templateUrl: "./user-add.component.html",
  styleUrls: ["./user-add.component.css"],
})
export class UserAddComponent implements OnInit {
  registrationForm!: FormGroup;
  user!: UserForRegister;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createRegistrationForm();
  }

  createRegistrationForm() {
    this.registrationForm = this.fb.group(
      {
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        userName: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        confirmPassword: [null, Validators.required],
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
      this.authService.registerUser(this.userData()).subscribe(() => {
        this.registrationForm.reset();
        this.alertify.success("User Added");
        this.router.navigate(["/admin/users/manage"]);
      });
    }
  }

  userData(): UserForRegister {
    return (this.user = {
      userName: this.userName.value,
      password: this.password.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
    });
  }
}
