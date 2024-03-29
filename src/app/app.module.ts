// Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Components
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { ForgotPwComponent } from './pages/login/forgot-pw/forgot-pw.component';
import { LoginComponent } from './pages/login/login/login.component';
import { SignUpComponent } from './pages/login/sign-up/sign-up.component';
import { ResetPwComponent } from './pages/login/reset-pw/reset-pw.component';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home/home.component';
import { BoardComponent } from './pages/home/board/board.component';
import { AddTaskComponent } from './pages/home/add-task/add-task.component';
import { ContactsComponent } from './pages/home/contacts/contacts.component';
import { LegalNoticeComponent } from './pages/home/legal-notice/legal-notice.component';
import { TaskBoxComponent } from './shared/components/task-box/task-box.component';
import { HelpComponent } from './pages/home/help/help.component';
import { AddTaskCompComponent } from './shared/components/add-task/add-task.component';
import { OverlayComponent } from './shared/components/overlay/overlay.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { Overlay2Component } from './shared/components/overlay2/overlay2.component';
import { ContactComponent } from './shared/components/contact/contact.component';
import { ShowTaskComponent } from './shared/components/show-task/show-task.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { DialogComponent } from './shared/components/dialog/dialog.component';
import { authGuard } from './shared/guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ForgotPwComponent,
    LoginComponent,
    SignUpComponent,
    ResetPwComponent,
    SnackbarComponent,
    DashboardComponent,
    HomeComponent,
    BoardComponent,
    AddTaskComponent,
    ContactsComponent,
    LegalNoticeComponent,
    TaskBoxComponent,
    HelpComponent,
    AddTaskCompComponent,
    OverlayComponent,
    ProfileComponent,
    Overlay2Component,
    ContactComponent,
    ShowTaskComponent,
    LoadingSpinnerComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    BrowserAnimationsModule,
    CommonModule,
    DragDropModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
