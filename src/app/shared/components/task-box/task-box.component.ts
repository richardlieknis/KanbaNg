import { Component, Input, OnInit } from '@angular/core';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { OverlayService } from '../../services/overlay.service';

@Component({
  selector: 'app-task-box',
  templateUrl: './task-box.component.html',
  styleUrl: './task-box.component.scss'
})
export class TaskBoxComponent implements OnInit {
  @Input() task: any = {};

  public displayedAssignees: number = 3;

  public categories: any[] = [];
  public contacts: any[] = [];
  public assignees: [] = [];

  constructor(
    private sql: FetchSqlService,
    public overlay: OverlayService
  ) { }

  ngOnInit(): void {
    this.createCategoryDictionary();
    this.createAssigneeDictionary();

  }

  getSubtaskStatus(subtasks: any) {
    let counter = 0;
    subtasks.forEach((e: any) => {
      e.done ? counter++ : null;
    });
    return counter;
  }


  /** fetch categories from database and create a dictionary
   * save dictionary in this.categories
   *  @returns dictionary of categories with category_id as key
   */
  createCategoryDictionary() {
    this.sql.getCategories().subscribe((data: any) => {
      this.categories = data.categories.reduce((acc: any, category: any) => {
        acc[category.category_id] = category;
        return acc;
      }, {});
    });
  }

  /** fetch contacts from database and create a dictionary
   * save dictionary in this.contacts
   *  @returns dictionary of contacts with contact_id as key
   */
  createAssigneeDictionary() {
    this.sql.getContacts().subscribe((data: any) => {
      this.contacts = data.contacts.reduce((acc: any, contact: any) => {
        acc[contact.contact_id] = contact;
        return acc;
      }, {});
    });
  }

  getCategoryName(categoryId: any) {
    return this.categories[categoryId]?.name;
  }

  getCategoryColor(categoryId: any) {
    return this.categories[categoryId]?.color;
  }

  getAssigneeName(assigneeId: any) {
    return this.contacts[assigneeId]?.name;
  }

  getAssigneeImage(assigneeId: any) {
    return this.contacts[assigneeId]?.image;
  }
}
