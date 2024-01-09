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

  public urgentTasks: any[] = [];
  public upcomingDeadline: string = '';

  public greetings = 'Hello, ';
  public isLoading = true;

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
      this.getAndSortUrgentTasks(this.allTasks);
      this.isLoading = false;
    });
  }

  // NOTE: Vergangene Deadlines werden als erstes angezeigt
  getAndSortUrgentTasks(allTasks: any[]) {
    this.urgentTasks = this.sortByDate(allTasks.filter((task) =>
      task.priority === 'urgent' && task.status !== 'done'));
    this.upcomingDeadline = this.formatDate(this.urgentTasks[0].due_date);
  }

  sortByDate(tasks: any[]) {
    return tasks.sort((a, b) => {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
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

  /**
   * format date to 'January 1, 2000'
   * @param inputDate due_date from task
   * @returns formatted date
   */
  formatDate(inputDate: string): string {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
    const [year, month, day] = inputDate.split('-').map(Number);
    const monthName = months[month - 1];

    const formattedDate = new Date(year, month - 1, day).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    return formattedDate;
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
