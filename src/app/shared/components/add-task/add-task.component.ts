import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import test from 'node:test';

@Component({
  selector: 'app-add-task-comp',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskCompComponent implements OnInit {
  public categoryColors = ['red', 'blue', 'orange', 'green', 'yellow', 'purple', 'pink', 'brown'];
  public categoryDropdown: boolean = false;
  public assigneeDropdown: boolean = false;
  public categoryInputActive: boolean = false;
  public subtaskInputActive: boolean = false;
  public currentDate: string = '';
  public selectedPriority: string = 'low';
  public selectedColor: string = 'red';

  public subtasks: Array<string> = ['Subtask 1', 'Subtask 2', 'Subtask 3'];

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
    } else if (input.length >= 10) {
      this.snackbar.show('Category name is too long. Max 10 characters', 'error');
    } else {
      this.snackbar.show('Category created', 'success');
      this.categoryInputActive = false;
      this.testDatensatz.push({
        categrory_id: 4,
        name: input,
        color: this.selectedColor,
      });
    }
  }

  addSubtask() {
    let input = (document.getElementById('subtask') as HTMLInputElement).value;
    if (input.length <= 0) {
      this.snackbar.show('Please enter a subtask name', 'error');
    } else if (input.length >= 50) {
      this.snackbar.show('Subtask name is too long. Max 50 characters', 'error');
    } else {
      this.subtasks.push(input);
      this.subtaskInputActive = false;
      (document.getElementById('subtask') as HTMLInputElement).value = '';
    }
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  toggleSubtaskInput() {
    this.subtaskInputActive = !this.subtaskInputActive;
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
