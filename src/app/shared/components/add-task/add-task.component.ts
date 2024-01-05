import { Component, Input, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import test from 'node:test';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { get } from 'http';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-add-task-comp',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskCompComponent implements OnInit {
  @Input() directlyAssigned: any = null;
  @Input() status: string = 'todo';

  private backendUrl = "http://localhost/backend/";

  public categoryColors = ['red', 'blue', 'orange', 'green', 'yellow', 'purple', 'pink', 'brown'];
  public categoryDropdown: boolean = false;
  public assigneeDropdown: boolean = false;
  public categoryInputActive: boolean = false;
  public subtaskInputActive: boolean = false;
  public selectedPriority: string = '';
  public selectedColor: string = 'red';

  public categoryText = 'Select or create a category';

  public currentDate: string = '';
  public contacts: Array<any> = [];

  // data to process add task form
  public subtasks: Array<string> = [];
  public assignees: Array<number> = [];
  public category?: number;

  newCategory: any;
  categories: Array<any> = [];


  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    category: new FormControl('', [Validators.required]),
    assignees: new FormControl([], [Validators.required]),
    due_date: new FormControl(this.currentDate, [Validators.required]),
    priority: new FormControl('', [Validators.required]),
    subtasks: new FormControl([], []),
    status: new FormControl(this.status, [Validators.required]),
  });


  constructor(
    private snackbar: SnackbarService,
    private sql: FetchSqlService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.setCurrentDate();
    this.getContacts();
    this.getCategories();
    if (this.directlyAssigned) {
      //this.assignees.push(this.toNumber(this.directlyAssigned.contact_id));
      this.taskForm.get('assignees')?.setValue([this.toNumber(this.directlyAssigned.contact_id)]);
    }
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

  onSubmit() {
    console.log(this.taskForm.value);
    if (this.taskForm.valid) {
      this.writeTaskOnDb(this.taskForm.value);
    } else {
      this.snackbar.show('Please fill all the required fields', 'error');
    }
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
      this.newCategory = {
        category_id: Number(this.findLastCategoryId()) + 1,
        name: input,
        color: this.selectedColor,
      };
      this.categories.push(this.newCategory);
      this.wirteCategoryOnDb(this.newCategory);
    }
  }


  writeTaskOnDb(task: any) {
    this.http.post(this.backendUrl + 'create_task.php',
      task, { responseType: 'text' })
      .subscribe((result: any) => {
        console.log(result);
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.snackbar.show(result.message, 'success');;
        } else {
          this.snackbar.show(result.message, 'error');
        }
      });
  }

  wirteCategoryOnDb(category: any) {
    this.http.post(this.backendUrl + 'create_category.php',
      category, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        if (result.status === 'success') {
          this.snackbar.show(result.message, 'success');;
        } else {
          this.snackbar.show(result.message, 'error');
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
      this.taskForm.get('subtasks')?.setValue(this.subtasks);
      (document.getElementById('subtask') as HTMLInputElement).value = '';
    }
  }

  /**
   * Add or remove assignee with its ID
   * @param checkbox HTMLInputElement
   * @param id contact id
   */
  addAssignee(checkbox: HTMLInputElement, id: string) {
    const numericId = Number(id);
    const assignees = this.taskForm.get('assignees')?.value as number[];

    if (!this.assignees.includes(this.toNumber(id))) {
      this.assignees.push(numericId);
      assignees.push(numericId);
      checkbox.checked = true;
    } else {
      this.assignees.splice(this.assignees.indexOf(this.toNumber(id)), 1);
      assignees.splice(assignees.indexOf(numericId), 1);
    }
    this.taskForm.get('assignees')?.setValue(assignees);
    console.log(this.assignees);
  }

  toNumber(id: string) {
    return Number(id);
  }

  addCategory(category: any) {
    this.categoryText = category.name;
    this.category = category.category_id;
    this.taskForm.get('category')?.setValue(this.category);
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
    this.taskForm.get('priority')?.setValue(this.selectedPriority);
  }

  changeColor(color: string) {
    this.selectedColor = this.selectedColor === color ? 'red' : color;
  }

  setCurrentDate() {
    const addLeadingZero = (number: number) => {
      return number < 10 ? `0${number}` : `${number}`;
    };

    const date = new Date();
    const day = addLeadingZero(date.getDate());
    const month = addLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear();
    this.currentDate = `${year}-${month}-${day}`;
    this.taskForm.get('due_date')?.setValue(this.currentDate);
  }
}
