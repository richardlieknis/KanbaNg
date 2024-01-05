import { Component, Input, OnInit } from '@angular/core';
import { FetchSqlService } from '../../services/fetch-sql.service';
import { get } from 'http';

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
  ) { }

  ngOnInit(): void {
    this.createCategoryDictionary();
    this.createAssigneeDictionary();

  }

  getAssignedContacts() {

  }

  createCategoryDictionary() {
    this.sql.getCategories().subscribe((data: any) => {
      this.categories = data.categories.reduce((acc: any, category: any) => {
        acc[category.category_id] = category;
        return acc;
      }, {});
    });
  }

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
