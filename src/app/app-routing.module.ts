import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { ForgotPwComponent } from './pages/login/forgot-pw/forgot-pw.component';
import { LoginComponent } from './pages/login/login/login.component';
import { SignUpComponent } from './pages/login/sign-up/sign-up.component';
import { ResetPwComponent } from './pages/login/reset-pw/reset-pw.component';

const routes: Routes = [
  {
    path: '', component: LoginPageComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
      { path: 'forgot-password', component: ForgotPwComponent },
      { path: 'reset-password', component: ResetPwComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
