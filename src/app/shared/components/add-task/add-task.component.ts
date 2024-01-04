import { Component, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import test from 'node:test';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { get } from 'http';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

  public categoryText = 'Select or create a category';

  public currentDate: string = '';
  public contacts: Array<any> = [];

  // data to process add task form
  public subtasks: Array<string> = ['Subtask 1', 'Subtask 2', 'Subtask 3'];
  public assignees: Array<number> = [];
  public category?: number;

  newCategory: any;
  categories: Array<any> = [];


  constructor(
    private snackbar: SnackbarService,
    private sql: FetchSqlService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.setCurrentDate();
    this.getContacts();
    this.getCategories();
  }

  getContacts() {
    this.sql.getContacts().subscribe((data) => {
      this.contacts = data.contacts;
    });
  }

  getCategories() {
    this.sql.getCategories().subscribe((data) => {
      this.categories = data.categories;
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
      this.newCategory = {
        category_id: Number(this.findLastCategoryId()) + 1,
        name: input,
        color: this.selectedColor,
      };
      this.categories.push(this.newCategory);
      this.writeOnDatabase(this.newCategory);
    }
  }



  writeOnDatabase(category: any) {
    this.http.post('http://localhost/backend/create_category.php',
      category, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.snackbar.show('New category has been created successfully!', 'success');;
        } else {
          this.snackbar.show('Something went wrong. :(', 'error');
        }
      });
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
   * Add or remove assignee with its ID
   * @param checkbox HTMLInputElement
   * @param id contact id
   */
  addAssignee(checkbox: HTMLInputElement, id: number) {
    checkbox.checked = !checkbox.checked;
    const nummericId = Number(id);
    if (checkbox.checked) {
      this.assignees.push(nummericId);
    } else {
      this.assignees.splice(this.assignees.indexOf(id), 1);
    }
  }

  toNumber(id: string) {
    return Number(id);
  }

  addCategory(category: any) {
    this.categoryText = category.name;
    this.category = category.category_id;
    this.toggleCategoryDropdown();
  }


  findLastCategoryId() {
    let lastId = 0;
    this.categories.forEach((category: any) => {
      if (category.category_id > lastId) {
        lastId = category.category_id;
      }
    });
    return lastId;
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  clearSubtaskInput() {
    (document.getElementById('subtask') as HTMLInputElement).value = '';
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
