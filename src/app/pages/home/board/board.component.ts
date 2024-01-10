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

  public isLoading = true;


  constructor(
    public overlayService: OverlayService,
    private sql: FetchSqlService,
    private taskService: TaskService,
  ) { }

  ngOnInit(): void {

    // TODO: Alle subscriptions in ngOnDestroy() aufräumen 
    // (in einem Array speichern und in einer Schleife durchgehen)
    this.sql.getTasks().subscribe((data: any) => {
      this.isLoading = true;
      this.allTasks = data.tasks;
      this.sortTasksByStatus(this.allTasks);
    });
    this.taskService.taskState.subscribe((task) => {
      this.isLoading = true;
      this.allTasks.push(task);
      this.sortTasksByStatus(this.allTasks);
    }, null, () => { this.isLoading = false });
    this.listenTaskUpdate();

  }

  /**
   * listen to task update and sort tasks by status
   * @returns old or updated task
   */
  listenTaskUpdate() {
    this.taskService.updateTaskState.subscribe((task) => {
      this.isLoading = true;
      this.allTasks = this.allTasks.map((t) => {
        if (t.task_id === task.task_id) {
          return task;
        }
        return t;
      });
      this.sortTasksByStatus(this.allTasks);
    });
  }

  onInputChange(event: any) {
    const input = (event.target as HTMLInputElement).value;
    this.filterTask(input);
  }

  /**
   * filter tasks by title or description
   * @param input search input
   */
  filterTask(input: string) {
    this.sortTasksByStatus(this.allTasks.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(input.toLowerCase());
      const descriptionMatch = task.description.toLowerCase().includes(input.toLowerCase());

      return titleMatch || descriptionMatch;
    }));
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
