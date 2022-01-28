import { Component, OnInit } from '@angular/core';
import { IProductResponse } from '../../system/interfaces/product.interface';
import { OrderService } from '../../system/services/order/order.service';
import { AuthService } from '../../system/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public total = 0;
  public basket: Array<IProductResponse> = [];
  public isUserLogin = false;
  public isAdminLogin = false;

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
    this.getAuthRole();
    this.checkLoginStatus();
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

  updateBasket(): void {
    this.orderService.changeBasket$.subscribe(() => {
      this.loadBasket();
    })
  }

  getAuthRole(): void {
    if(localStorage.length > 0 && localStorage.getItem('user')){
      const user = JSON.parse(localStorage.getItem('user') as string);
      if(user && user.role === 'ADMIN') {
        this.isAdminLogin = true;
        this.isUserLogin = false;
      } else if(user && user.role === 'USER'){
        this.isAdminLogin = false;
        this.isUserLogin = true;
      } else {
        this.isUserLogin = false;
        this.isAdminLogin = false;
      }
    } else {
      this.isUserLogin = false;
      this.isAdminLogin = false;
    }
  }

  checkLoginStatus(): void {
    this.authService.currentUser$.subscribe(() => {
      this.getAuthRole();
    })
  }

}
