import { Component, OnInit } from '@angular/core';
import { OverlayService } from '../../../shared/services/overlay.service';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';
import { TaskService } from '../../../shared/services/task.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  private allTasks: any[] = [];
  public toDo: any[] = [];
  public inProgress: any[] = [];
  public inReview: any[] = [];
  public done: any[] = [];


  constructor(
    public overlayService: OverlayService,
    private sql: FetchSqlService,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {
    this.sql.getTasks().subscribe((data: any) => {
      this.allTasks = data.tasks;
      this.sortTasksByStatus(this.allTasks);
    });
    this.taskService.taskState.subscribe((task) => {
      this.allTasks.push(task);
      this.sortTasksByStatus(this.allTasks);
    });
    this.taskService.updateTaskState.subscribe((task) => {
      this.allTasks = this.allTasks.map((t) => {
        if (t.task_id === task.task_id) {
          return task;
        }
        return t;
      });
      this.sortTasksByStatus(this.allTasks);
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
}
