import { Component, Input, OnInit } from '@angular/core';
import { FetchSqlService } from '../../services/fetch-sql.service';

@Component({
  selector: 'app-task-box',
  templateUrl: './task-box.component.html',
  styleUrl: './task-box.component.scss'
})
export class TaskBoxComponent implements OnInit {
  @Input() task: any = {};

  public categories: any[] = [];

  constructor(
    private sql: FetchSqlService,
  ) { }

  ngOnInit(): void {
    this.sql.getCategories().subscribe((data: any) => {
      this.categories = data.categories.reduce((acc: any, category: any) => {
        acc[category.category_id] = category;
        return acc;
      }, {});
    });
  }

  /**
   * get category name by id
   * @param categoryId 
   */
  getCategoryName(categoryId: any) {
    return this.categories[categoryId]?.name;
  }

  /**
   * get category color by id
   * @param categoryId 
   */
  getCategoryColor(categoryId: any) {
    return this.categories[categoryId]?.color;
  }
}
