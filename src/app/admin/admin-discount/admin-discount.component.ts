import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../system/services/discount/discount.service';
import { IDiscountRequest, IDiscountResponse } from '../../system/interfaces/discount.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent implements OnInit {

  public adminDiscounts: Array<IDiscountResponse> = [];
  public id = 1;
  public description!: string;
  public imagePath = 'https://la.ua/wp-content/uploads/2021/08/pryvedy-druga2.jpg';
  public editStatus = false;

  constructor(
    private discountService: DiscountService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAdminDiscounts();
  }

  getAdminDiscounts(): void {
    // this.adminDiscounts = this.discountService.getDiscounts();
    this.discountService.getAll().subscribe(data => {
      this.adminDiscounts = data;
    }, err => {
      console.log('get all discounts', err);
    })
  }

  // addAdminDiscount(): void {
  //   const discount: IDiscountResponse = {
  //     id: this.adminDiscounts.length === 0 ? this.id : this.adminDiscounts.slice(-1)[0].id + 1,
  //     description: this.description,
  //     imagePath: this.imagePath
  //   };
  //   this.discountService.addDiscount(discount);
  //   this.description = '';
  // }

  addAdminDiscount(): void {
    const discount: IDiscountRequest = {
      description: this.description,
      imagePath: this.imagePath
    };
    this.discountService.create(discount).subscribe(() => {
      this.getAdminDiscounts();
      this.toastr.success('Discount successfully created');
    }, err => {
      this.toastr.error(err.message, 'Post discount')
    });
    this.description = '';
  }

  deleteAdminDiscount(discount: IDiscountResponse): void {
    // this.discountService.deleteDiscount(discount.id);
    this.discountService.delete(discount.id).subscribe(() => {
      this.getAdminDiscounts();
      this.toastr.success('Discount successfully deleted');
    }, err => {
      this.toastr.error(err.message, 'Delete discount')
    });
  }

  editAdminDiscount(discount: IDiscountResponse): void {
    this.id = discount.id;
    this.description = discount.description;
    this.imagePath = discount.imagePath;
    this.editStatus = true;
  }

  // saveAdminDiscount(): void {
  //   const discount: IDiscountResponse = {
  //     id: this.id,
  //     description: this.description,
  //     imagePath: this.imagePath
  //   };
  //   this.discountService.updateDiscount(discount);
  //   this.resetFields();
  // }

  saveAdminDiscount(): void {
    const discount: IDiscountRequest = {
      description: this.description,
      imagePath: this.imagePath
    };
    this.discountService.update(discount, this.id).subscribe(() => {
      this.getAdminDiscounts();
      this.toastr.success('Discount successfully updated');
    }, err => {
      this.toastr.error(err.message, 'Put discount')
    });
    this.resetFields();
    // this.discountService.update(discount, this.id).subscribe({
    //   complete: () => this.getAdminDiscounts(),
    //   error: (e) => console.log('put discount', e)
    // });
  }

  private resetFields(): void {
    this.id = 1;
    this.description = '';
    this.imagePath = 'https://la.ua/wp-content/uploads/2021/08/pryvedy-druga2.jpg';
    this.editStatus = false;
  }
}
