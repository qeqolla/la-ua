import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MatDialog} from "@angular/material/dialog";
import { ProductService} from "../../system/services/product/product.service";
import { AddProductComponent} from "./add-product/add-product.component";
import { ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  searchForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.initSearchForm();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      search: [null]
    })
  }

  openProductDialog(): void {
    this.dialog.open(AddProductComponent).afterClosed().subscribe(result => {
      if (result && result.prod) {
        this.productService.create(result.prod).subscribe(() => {
          this.productService.changeProducts$.next(true);
          this.toastr.success('Product successfully created');
        });
      }
    });
  }
}
