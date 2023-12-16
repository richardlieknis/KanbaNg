import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login-page/login-page.component';
import { ForgotPwComponent } from './pages/login/forgot-pw/forgot-pw.component';
import { LoginComponent } from './pages/login/login/login.component';
import { SignUpComponent } from './pages/login/sign-up/sign-up.component';
import { ResetPwComponent } from './pages/login/reset-pw/reset-pw.component';
import { HomeComponent } from './pages/home/home/home.component';
import { DashboardComponent } from './pages/home/dashboard/dashboard.component';
import { BoardComponent } from './pages/home/board/board.component';
import { AddTaskComponent } from './pages/home/add-task/add-task.component';
import { ContactsComponent } from './pages/home/contacts/contacts.component';
import { LegalNoticeComponent } from './pages/home/legal-notice/legal-notice.component';
import { HelpComponent } from './pages/home/help/help.component';

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
  {
    path: '', component: HomeComponent, children: [
      { path: 'home', component: DashboardComponent },
      { path: 'board', component: BoardComponent },
      { path: 'add-task', component: AddTaskComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'legal-notice', component: LegalNoticeComponent },
      { path: 'help', component: HelpComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
