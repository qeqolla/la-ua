import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../../system/services/product/product.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IProductResponse } from '../../system/interfaces/product.interface';
import { OrderService} from '../../system/services/order/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  public products: Array<IProductResponse> = [];
  public eventsSubscriptions!: Subscription;
  public currentCategoryName!: string;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventsSubscriptions = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.loadProductsByCategory();
      }
    })
  }

  ngOnInit(): void {}

  loadProductsByCategory(): void {
    const category = this.activatedRoute.snapshot.params['name'];
    this.productService.getAllByCategory(category).subscribe(data => {
      this.products = data;
    })
  }

  productCount(prod: IProductResponse, status: boolean) {
    if(status) {
      prod.count++;
    } else if(!status && prod.count > 1){
      prod.count--;
    }
  }

  addBasket(prod: IProductResponse) {
    let basket: Array<IProductResponse> = [];
    if(localStorage.length > 0 && localStorage.getItem('basket')){
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if(basket.some((product: IProductResponse) => product.id === prod.id)){
        const index = basket.findIndex((product: IProductResponse) => product.id === prod.id);
        basket[index].count += prod.count;
      } else {
        basket.push(prod);
      }
    } else {
      basket.push(prod);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.orderService.changeBasket$.next(true);
    prod.count = 1;
  }

  ngOnDestroy(): void {
    this.eventsSubscriptions.unsubscribe();
  }
}
