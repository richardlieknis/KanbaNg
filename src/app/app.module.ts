import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login/login.component';
import { ForgotPwComponent } from './pages/login/forgot-pw/forgot-pw.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPwComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
