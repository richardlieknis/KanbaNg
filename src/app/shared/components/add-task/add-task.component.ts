import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import test from 'node:test';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { get } from 'http';

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
  public selectedPriority: string = 'low';
  public selectedColor: string = 'red';

  public currentDate: string = '';
  public contacts: Array<any> = [];

  // data to process add task form
  public subtasks: Array<string> = ['Subtask 1', 'Subtask 2', 'Subtask 3'];
  public assignees: Array<any> = [];

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
    private sql: FetchSqlService,
  ) { }

  ngOnInit() {
    this.setCurrentDate();
    this.getContacts();

  }

  getContacts() {
    this.sql.getContacts().subscribe((data) => {
      this.contacts = data.contacts;
      // this.processContactData(data.contacts);
    });
  }

  // processContactData(contacts: any) {
  //   contacts.forEach((contact: any) => {
  //     this.contacts.push(contact);
  //   });
  // }

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

  /**
   * Add or remove assignee from task
   * @param checkbox HTMLInputElement
   * @param id contact id
   */
  addAssignee(checkbox: HTMLInputElement, id: number) {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      this.assignees.push(id);
    } else {
      this.assignees.splice(this.assignees.indexOf(id), 1);
    }
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  inviteContact() {
    this.snackbar.show('Sorry, this feature is not available yet.', 'error');
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
