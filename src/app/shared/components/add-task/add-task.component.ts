import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import test from 'node:test';

@Component({
  selector: 'app-add-task-comp',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskCompComponent implements OnInit {
  public categoryDropdown: boolean = false;
  public assigneeDropdown: boolean = false;
  public categoryInputActive: boolean = false;
  public currentDate: string = '';
  public selectedPriority: string | null = null;
  public selectedColor: string = 'red';

  testDatensatz = [
    {
      categrory_id: 1,
      name: 'Test',
      color: 'red',
    },
    {
      categrory_id: 2,
      name: 'Test2',
      color: 'blue',
    },
    {
      categrory_id: 3,
      name: 'Test3',
      color: 'orange',
    }
  ]

  public categoryColors = ['red', 'blue', 'orange', 'green', 'yellow', 'purple', 'pink', 'brown'];

  constructor(
    private snackbar: SnackbarService,
  ) { }

  ngOnInit() {
    this.setCurrentDate();
  }

  createNewCategory() {
    let input = (document.getElementById('category') as HTMLInputElement).value;
    if (input.length <= 0) {
      this.snackbar.show('Please enter a category name', 'error');
      return;
    } else if (input.length > 20) {
      this.snackbar.show('Category name is too long', 'error');
      return;
    } else {
      this.snackbar.show('Category created', 'success');
      this.categoryInputActive = false;
      (document.getElementById('category') as HTMLInputElement).value = '';
      this.testDatensatz.push({
        categrory_id: 4,
        name: input,
        color: this.selectedColor,
      });
    }
  }

  toggleNewCategory() {
    this.categoryInputActive = !this.categoryInputActive;
  }

  toggleCategoryDropdown() {
    this.categoryDropdown = !this.categoryDropdown;
  }

  toggleAssigneeDropdown() {
    this.assigneeDropdown = !this.assigneeDropdown;
  }

  changePriority(priority: string) {
    this.selectedPriority = priority;
  }

  changeColor(color: string) {
    this.selectedColor = this.selectedColor === color ? 'red' : color;
  }

  setCurrentDate() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.currentDate = `${year}-${month}-${day}`;
  }
}
