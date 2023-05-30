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

import { AppComponent } from "./app.component";
import { UserLoginComponent } from "./user/user-login/user-login.component";
import { UserAddComponent } from "./user/user-add/user-add.component";
import { AlertifyService } from "./services/alertify.service";
import { HNavBarComponent } from "./nav-bar/h-nav-bar/h-nav-bar.component";
import { VNavBarComponent } from "./nav-bar/v-nav-bar/v-nav-bar.component";
import { AddSurveyComponent } from "./admin/add-survey/add-survey.component";
import { ManageSurveysComponent } from "./admin/manage-surveys/manage-surveys.component";
import { SurveyCardComponent } from "./admin/survey-card/survey-card.component";
import { FilterPipe } from "./pipes/filter.pipe";
import { EditSurveyComponent } from "./admin/edit-survey/edit-survey.component";
import { SurveyResultsComponent } from "./admin/survey-results/survey-results.component";
import { SurveyService } from "./services/survey.service";
import { UserManageComponent } from "./user/user-manage/user-manage.component";
import { UserEditComponent } from "./user/user-edit/user-edit.component";
import { UserHomeComponent } from './user/user-home/user-home.component';
import { SortPipe } from './pipes/sort.pipe';
import { UserFillOutComponent } from './user/user-fill-out/user-fill-out.component';

const appRoutes: Routes = [
  { path: "", component: ManageSurveysComponent },
  { path: "admin/register", component: UserAddComponent },
  { path: "admin/users/manage", component: UserManageComponent },
  { path: "admin/users/manage/edit", component: UserEditComponent },
  { path: "edit-survey/:id", component: EditSurveyComponent },
  { path: "survey-results/:id", component: SurveyResultsComponent },
  { path: 'home', component: UserHomeComponent},
  { path: 'fill-out/:id', component: UserFillOutComponent},
  { path: '**', component: UserLoginComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    UserLoginComponent,
    UserAddComponent,
    HNavBarComponent,
    VNavBarComponent,
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
    UserFillOutComponent
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
  ],
  providers: [AlertifyService, SurveyService],
  bootstrap: [AppComponent],
})
export class AppModule {}
