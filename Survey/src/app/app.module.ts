import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { BsModalService, ModalModule } from "ngx-bootstrap/modal";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";

import { AppComponent } from "./app.component";
import { UserLoginComponent } from "./user/user-login/user-login.component";
import { UserAddComponent } from "./user/user-add/user-add.component";
import { AlertifyService } from "./services/alertify.service";
import { HNavBarComponent } from "./nav-bar/h-nav-bar/h-nav-bar.component";
import { AddSurveyComponent } from "./admin/add-survey/add-survey.component";
import { ManageSurveysComponent } from "./admin/manage-surveys/manage-surveys.component";
import { SurveyCardComponent } from "./admin/survey-card/survey-card.component";
import { FilterPipe } from "./pipes/filter.pipe";
import { EditSurveyComponent } from "./admin/edit-survey/edit-survey.component";
import { SurveyResultsComponent } from "./admin/survey-results/survey-results.component";
import { SurveyService } from "./services/survey.service";
import { UserManageComponent } from "./user/user-manage/user-manage.component";
import { UserEditComponent } from "./user/user-edit/user-edit.component";
import { UserHomeComponent } from "./user/user-home/user-home.component";
import { SortPipe } from "./pipes/sort.pipe";
import { UserFillOutComponent } from "./user/user-fill-out/user-fill-out.component";
import { AssignSurveyComponent } from "./admin/assign-survey/assign-survey.component";
import { SurveyLinkComponent } from "./admin/survey-link/survey-link.component";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guards/auth.guard";

const appRoutes: Routes = [
  { path: "", component: UserLoginComponent },
  { path: "admin/users/manage/register", component: UserAddComponent, canActivate: [AuthGuard] },
  { path: "admin/surveys/manage", component: ManageSurveysComponent, canActivate: [AuthGuard] },
  { path: "admin/surveys/add", component: AddSurveyComponent, canActivate: [AuthGuard] },
  { path: "admin/surveys/add/success", component: SurveyLinkComponent, canActivate: [AuthGuard] },
  {
    path: "admin/surveys/add/assign-survey",
    component: AssignSurveyComponent,
    canActivate: [AuthGuard],
  },
  { path: "admin/surveys/edit/:id", component: EditSurveyComponent, canActivate: [AuthGuard] },
  { path: "admin/surveys/results", component: SurveyResultsComponent, canActivate: [AuthGuard] },
  {
    path: "admin/surveys/results/:id",
    component: SurveyResultsComponent,
    canActivate: [AuthGuard],
  },
  { path: "admin/users/manage", component: UserManageComponent, canActivate: [AuthGuard] },
  {
    path: "admin/users/manage/edit/:userName",
    component: UserEditComponent,
    canActivate: [AuthGuard],
  },
  { path: "user/surveys/fill-out/:id", component: UserFillOutComponent, canActivate: [AuthGuard] },
  { path: "user/surveys", component: UserHomeComponent, canActivate: [AuthGuard] },
  { path: "**", component: UserLoginComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserAddComponent,
    HNavBarComponent,
    AddSurveyComponent,
    ManageSurveysComponent,
    EditSurveyComponent,
    SurveyCardComponent,
    SurveyResultsComponent,
    FilterPipe,
    UserManageComponent,
    UserEditComponent,
    SortPipe,
    UserHomeComponent,
    UserFillOutComponent,
    AssignSurveyComponent,
    SurveyLinkComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  providers: [AlertifyService, SurveyService, AuthService, BsModalService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
