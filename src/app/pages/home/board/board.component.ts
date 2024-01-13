import { Component, OnInit } from '@angular/core';
import { OverlayService } from '../../../shared/services/overlay.service';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';
import { TaskService } from '../../../shared/services/task.service';
import { CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';

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
  public isDragging = false;

  private backendUrl = 'http://localhost/backend/';


  constructor(
    public overlayService: OverlayService,
    private sql: FetchSqlService,
    private taskService: TaskService,
    private http: HttpClient,
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
    this.listenTaskDelete();

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

  /**
   * listen to task delete and sort tasks by status
   */
  listenTaskDelete() {
    this.taskService.taskDelete.subscribe((task) => {
      this.isLoading = true;
      this.allTasks = this.allTasks.filter((t) => {
        return t.task_id !== task.task_id;
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

  dropTask(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data,
        event.previousIndex, event.currentIndex);
      this.changeTaskStatus(event.container.data[event.currentIndex], event.container.id);
    };
  }

  changeTaskStatus(task: any, status: string) {
    task.status = status;
    this.http.post(this.backendUrl + 'update_task.php',
      task, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.taskService.emitUpdateTask(task);
        }
      });
  }

  toggleDragState() {
    this.isDragging = !this.isDragging;
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
    this.isLoading = false;
  }
}
