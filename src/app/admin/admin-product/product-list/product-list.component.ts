import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../system/services/product/product.service';
import { IProductResponse } from '../../../system/interfaces/product.interface';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  public displayedColumns: string[] = ['category', 'name', 'path', 'description', 'weight', 'price', 'image', 'actions'];
  public dataSource!: IProductResponse[];

  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.checkChangeProducts();
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(data => {
      this.dataSource = data;
    })
  }

  checkChangeProducts(): void {
    this.productService.changeProducts$.subscribe(() => {
      this.loadProducts()
    })
  }

  editProduct(product: IProductResponse): void {
    this.dialog.open(AddProductComponent, {
      backdropClass: 'dialog-back',
      data: {
        prod: product
      }
    }).afterClosed().subscribe(result => {
      if (result && result.prod) {
        this.productService.update(result.prod, product.id).subscribe(() => {
          this.loadProducts();
          this.toastr.success('Product successfully updated');
        })
      }
    })
  }

  deleteProduct(product: IProductResponse): void {
    this.productService.delete(product.id).subscribe(() => {
      this.loadProducts();
      this.toastr.success('Product successfully deleted');
    })
  }
}
