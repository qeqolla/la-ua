import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../system/services/discount/discount.service';
import { IDiscountResponse } from '../../system/interfaces/discount.interface';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {

  public userDiscounts: Array<IDiscountResponse> = [];

  constructor(
    private discountService: DiscountService
  ) { }

  ngOnInit(): void {
    this.getUserDiscounts();
  }

  getUserDiscounts(): void {
    this.discountService.getAll().subscribe(data => {
      this.userDiscounts = data;
    }, err => {
      console.log('get all discounts', err);
    })
  }

}
