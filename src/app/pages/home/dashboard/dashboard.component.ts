import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public greetings = 'Hello, ';

  constructor() { }

  ngOnInit() {
    this.setCurrentTimeGreeting();
  }


  private setCurrentTimeGreeting() {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      this.greetings = 'Good Morning, ';
    } else if (currentTime < 18) {
      this.greetings = 'Good Afternoon, ';
    } else {
      this.greetings = 'Good Evening, ';
    }
  }
}
