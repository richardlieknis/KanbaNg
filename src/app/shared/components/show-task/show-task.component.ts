import { Component, Input, OnInit } from '@angular/core';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { TaskService } from '../../services/task.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrl: './show-task.component.scss'
})
export class ShowTaskComponent implements OnInit {
  @Input() task: any;
  public assignees: any[] = [];
  public type: 'show' | 'edit' = 'show';

  private backendUrl = 'http://localhost/backend/';

  constructor(
    private sql: FetchSqlService,
    private taskService: TaskService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.loadAssignees();
    this.taskService.updateTaskState.subscribe((task: any) => {
      this.task = task;
      this.type = 'show';
    });
  }

  loadAssignees() {
    this.taskService.createAssigneeDictionary().subscribe((data: any) => {
      this.assignees = data;
    });
  }

  markSubtask(subtask: any) {
    subtask.done = !subtask.done;
    this.updateTask();
  }

  updateTask() {
    this.http.post(this.backendUrl + 'update_task.php',
      this.task, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
      });
  }

  getAssigneeName(assigneeId: any) {
    return this.assignees[assigneeId]?.name;
  }

  getAssigneeImage(assigneeId: any) {
    return this.assignees[assigneeId]?.image;
  }

  toggleEdit() {
    this.type = this.type === 'show' ? 'edit' : 'show';
    this.taskService.emitAddTaskType(this.type);
  }

  onStatusUpdate(status: string) {

  }

}
