import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { ForgotPwComponent } from './pages/login/forgot-pw/forgot-pw.component';
import { LoginComponent } from './pages/login/login/login.component';
import { SignUpComponent } from './pages/login/sign-up/sign-up.component';
import { ResetPwComponent } from './pages/login/reset-pw/reset-pw.component';
import { HttpClientModule } from '@angular/common/http';
import { SnackbarComponent } from './shared/components/snackbar/snackbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ForgotPwComponent,
    LoginComponent,
    SignUpComponent,
    ResetPwComponent,
    SnackbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
