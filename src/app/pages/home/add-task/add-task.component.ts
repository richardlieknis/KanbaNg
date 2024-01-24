import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit {
  public categoryDropdown: boolean = false;
  public assigneeDropdown: boolean = false;
  public currentDate: string = '';
  public selected = '';

  constructor() { }

  ngOnInit() {
    this.setCurrentDate();
  }

  toggleCategoryDropdown() {
    this.categoryDropdown = !this.categoryDropdown;
  }

  toggleAssigneeDropdown() {
    this.assigneeDropdown = !this.assigneeDropdown;
  }

  changePriority(priority: string) {
    this.selected = priority;
  }

  setCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.currentDate = `${year}-${month}-${day}`;
  }
}
