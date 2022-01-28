import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductResponse } from '../../system/interfaces/product.interface';
import { OrderService } from '../../system/services/order/order.service';
import { IOrderRequest } from '../../system/interfaces/order.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public orderForm!: FormGroup;
  public basket: Array<IProductResponse> = [];
  public total = 0;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initOrderForm();
    this.loadBasket();
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      city: [null, Validators.required],
      street: [null, Validators.required],
      house: [null, Validators.required],
      comment: [null],
    });
  }

  loadBasket(): void {
    if(localStorage.length > 0 && localStorage.getItem('basket')){
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    } else {
      this.basket = [];
    }
    this.totalPrice();
  }

  totalPrice(): void {
    this.total = this.basket.reduce((total: number, prod :IProductResponse) => total + prod.price * prod.count, 0);
  }

  createOrder() {
    const order: IOrderRequest = {
      ...this.orderForm.value,
      products: this.basket,
      status: 'PENDING',
      totalPrice: this.total
    };
    this.orderService.create(order).subscribe(() => {
      this.basket = [];
      localStorage.removeItem('basket');
      this.orderService.changeBasket$.next(true);
    })
  }

  productCount(prod: IProductResponse, status: boolean) {
    if(status) {
      prod.count++;
    } else if(!status && prod.count > 1){
      prod.count--;
    }
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.orderService.changeBasket$.next(true);
    this.totalPrice();
  }

  removeProduct(prod: IProductResponse) {
    const index = this.basket.findIndex(product => product.id === prod.id);
    this.basket.splice(index, 1);
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.orderService.changeBasket$.next(true);
    this.totalPrice();
  }

  goToHomePage() {
    this.router.navigateByUrl('');
  }
}
