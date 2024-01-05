import { Component, OnInit } from '@angular/core';
import { OverlayService } from '../../../shared/services/overlay.service';
import { FetchSqlService } from '../../../shared/services/fetch-sql.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  public toDo: any[] = [];
  public inProgress: any[] = [];
  public inReview: any[] = [];
  public done: any[] = [];


  constructor(
    public overlayService: OverlayService,
    private sql: FetchSqlService,
  ) { }

  ngOnInit(): void {
    this.sql.getTasks().subscribe((data: any) => {
      this.sortTasksByStatus(data.tasks);
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
    // console.log(this.toDo, this.inProgress, this.inReview, this.done);
  }
}
