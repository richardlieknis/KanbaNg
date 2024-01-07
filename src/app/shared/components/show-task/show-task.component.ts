import { Component, Input, OnInit } from '@angular/core';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { TaskService } from '../../services/task.service';
import { formatDate } from '@angular/common';

formatDate

@Component({
  selector: 'app-show-task',
  templateUrl: './show-task.component.html',
  styleUrl: './show-task.component.scss'
})
export class ShowTaskComponent implements OnInit {
  @Input() task: any;
  public assignees: any[] = [];

  constructor(
    private sql: FetchSqlService,
    private taskService: TaskService
  ) { }

  ngOnInit() {
    console.log(this.task);
    this.loadAssignees();
  }

  loadAssignees() {
    this.taskService.createAssigneeDictionary().subscribe((data: any) => {
      this.assignees = data;
    });
  }

  getAssigneeName(assigneeId: any) {
    return this.assignees[assigneeId]?.name;
  }

  getAssigneeImage(assigneeId: any) {
    return this.assignees[assigneeId]?.image;
  }

}
