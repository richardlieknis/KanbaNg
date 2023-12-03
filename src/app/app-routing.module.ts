import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login/login.component';
import { ForgotPwComponent } from './pages/login/forgot-pw/forgot-pw.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPwComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
