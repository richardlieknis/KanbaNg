import { Component, OnInit } from '@angular/core';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';
import { TaskService } from '../../../shared/services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public allTasks: any[] = [];

  public toDo: any[] = [];
  public inProgress: any[] = [];
  public inReview: any[] = [];
  public done: any[] = [];

  public greetings = 'Hello, ';

  constructor(
    private sql: FetchSqlService,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.setCurrentTimeGreeting();
    this.getAllTasks();
  }

  getAllTasks() {
    this.sql.getTasks().subscribe((data: any) => {
      this.allTasks = data.tasks;
      this.sortTasksByStatus(this.allTasks);
      console.log(this.toDo);
    });
  }

  /**
   * process task data
   * @param tasks 
   */
  sortTasksByStatus(tasks: any[]) {
    this.toDo = [];
    this.inProgress = [];
    this.inReview = [];
    this.done = [];
    tasks.forEach((task) => {
      switch (task.status) {
        case 'todo':
          this.toDo.push(task);
          break;
        case 'progress':
          this.inProgress.push(task);
          break;
        case 'feedback':
          this.inReview.push(task);
          break;
        case 'done':
          this.done.push(task);
          break;
      }
    });
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
