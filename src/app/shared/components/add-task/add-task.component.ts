import { Component, Input, OnInit } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { OverlayService } from '../../services/overlay.service';
import { TaskService } from '../../services/task.service';
import { DialogService } from '../../services/dialog.service';
@Component({
  selector: 'app-add-task-comp',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskCompComponent implements OnInit {
  @Input() directlyAssigned: any = null;
  @Input() status: string = 'todo';
  @Input() taskEdit: any = null;

  private backendUrl = "http://localhost/backend/";
  private categoryDictionary: any = {};

  public addTaskType: string = 'show';
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
  public subtasks: Array<any> = [];
  public assignees: Array<number> = [];
  public category?: number;

  newCategory: any;
  categories: Array<any> = [];


  taskForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
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
    private overlay: OverlayService,
    private taskService: TaskService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getCategoryDict();
    this.getContacts();
    this.getCategories();
    if (this.taskEdit) {
      this.setInputValueEdit();
    } else {
      this.setStatus(this.status);
      this.setCurrentDate();
      if (this.directlyAssigned) {
        this.assignees.push(this.toNumber(this.directlyAssigned.contact_id));
        this.taskForm.get('assignees')?.setValue([this.toNumber(this.directlyAssigned.contact_id)]);
      }
    }
    this.taskService.addTaskType.subscribe((type: string) => {
      this.addTaskType = type;
    });
    this.taskService.taskStatus.subscribe((status: string) => {
      this.taskForm.get('status')?.setValue(status);
    });
  }

  /**
   * Set input values when editing a task
   */
  setInputValueEdit() {
    const formControls = ['title', 'description', 'category',
      'assignees', 'due_date', 'priority', 'subtasks', 'status'];

    formControls.forEach(control => {
      this.taskForm.get(control)?.setValue(this.taskEdit[control]);
    });

    this.taskService.createCategoryDictionary().subscribe((data: any) => {
      this.categoryText = data[this.taskEdit.category].name;
    });

    this.selectedPriority = this.taskEdit.priority;
    this.subtasks = this.taskEdit.subtasks;
    this.assignees = this.taskEdit.assignees;
    this.category = this.taskEdit.category;
  }

  setStatus(status: string) {
    if (status === 'In Progress') {
      this.status = 'progress';
    } else if (status === 'Awaiting Feedback') {
      this.status = 'feedback';
    } else if (status === 'Done') {
      this.status = 'done';
    } else {
      this.status = 'todo';
    }

    this.taskForm.get('status')?.setValue(this.status);
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

  getCategoryDict() {
    this.taskService.createCategoryDictionary().subscribe((data: any) => {
      this.categoryDictionary = data;
    });
  }

  onSubmit() {
    if (this.taskEdit && this.taskForm.valid) {
      this.updateTask();
    } else if (!this.taskEdit && this.taskForm.valid) {
      this.createTask();
      this.overlay.hide();
    } else {
      this.snackbar.show('Please fill all the required fields', 'error');
    }
  }

  createTask() {
    this.writeTaskOnDb(this.taskForm.value);
    this.taskService.emitTask(this.taskForm.value);
  }


  updateTask() {
    let formData = this.taskForm.value;
    Object.assign(formData, { task_id: this.taskEdit.task_id });
    this.http.post(this.backendUrl + 'update_task.php',
      this.taskForm.value, { responseType: 'text' })
      .subscribe((result: any) => {
        result = JSON.parse(result);
        this.snackbar.show(result.message, result.status);
        if (result.status === 'success') {
          this.taskService.emitUpdateTask(formData);
          this.taskService.emitAddTaskType('show');
        }
      });
  }

  deleteTask(task: any) {
    this.dialogService.confirm('This task will be permanently deleted.').then((result) => {
      if (result) {
        this.http.post(this.backendUrl + 'delete_task.php',
          task, { responseType: 'text' })
          .subscribe((result: any) => {
            result = JSON.parse(result);
            this.snackbar.show(result.message, result.status);
            if (result.status === 'success') {
              this.taskService.emitDeleteTask(task);
              this.overlay.hide();
            }
          });
      }
    });
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
    } else if (input.length >= 150) {
      this.snackbar.show('Subtask text is too long. Max 150 characters', 'error');
    } else {
      this.subtasks.push({
        text: input,
        done: false,
      });
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
    if (!(this.directlyAssigned === this.toNumber(id)) && this.directlyAssigned !== null) {
      return;
    }
    const numericId = Number(id);
    this.assignees = this.taskForm.get('assignees')?.value as number[];

    if (!this.assignees.includes(this.toNumber(id))) {
      this.assignees.push(numericId);
      checkbox.checked = true;
    } else {
      this.assignees.splice(this.assignees.indexOf(this.toNumber(id)), 1);
    }
    this.taskForm.get('assignees')?.setValue(this.assignees);
  }

  filterDuplicates(array: any) {
    return [...new Set(array)]
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

  toNumber(id: string) {
    return Number(id);
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
