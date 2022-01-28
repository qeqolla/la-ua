import { Component, OnInit } from '@angular/core';
import { DiscountService } from '../../system/services/discount/discount.service';
import { ActivatedRoute } from '@angular/router';
import {IDiscountResponse} from "../../system/interfaces/discount.interface";

@Component({
  selector: 'app-discount-details',
  templateUrl: './discount-details.component.html',
  styleUrls: ['./discount-details.component.scss']
})
export class DiscountDetailsComponent implements OnInit {

  public currentDiscount!: IDiscountResponse;

  constructor(
    private discountService: DiscountService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getUserOneDiscount();
  }

  getUserOneDiscount(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.discountService.getOne(id).subscribe(data => {
      this.currentDiscount = data;
    })
  }

}
