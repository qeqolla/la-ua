import {Component, OnInit} from '@angular/core';
import {CategoryService} from "../../system/services/category/category.service";
import {ICategoryResponse} from "../../system/interfaces/category.interface";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {AddCategoryComponent} from "./add-category/add-category.component";

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  categories: Array<ICategoryResponse> = [];
  editCategoryStatus = false;
  editCategoryId!: number;

  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    })
  }

  editCategory(category: ICategoryResponse): void {
    this.dialog.open(AddCategoryComponent, {
      backdropClass: 'dialog-back',
      data: {
        category: category
      }
    }).afterClosed().subscribe(result => {
      if (result && result.category) {
        this.categoryService.update(result.category, category.id).subscribe(() => {
          this.loadCategories();
          this.toastr.success('Category successfully updated');
        })
      }
    })
  }

  deleteCategory(category: ICategoryResponse) {
    this.categoryService.delete(category.id).subscribe(() => {
      this.loadCategories();
      this.toastr.success('Category successfully deleted');
    })
  }

  openDialog() {
    this.dialog.open(AddCategoryComponent).afterClosed().subscribe(result => {
      if (result && result.category) {
        this.categoryService.create(result.category).subscribe(() => {
          this.loadCategories();
          this.toastr.success('Category successfully created');
        });
      }
    });
  }
}
