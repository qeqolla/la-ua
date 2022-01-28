import { Component, OnInit } from '@angular/core';
import { IOrderResponse } from '../../../system/interfaces/order.interface';
import { OrderService } from '../../../system/services/order/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'phoneNumber', 'address', 'totalPrice', 'actions'];
  public dataSource!: IOrderResponse[];

  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAll().subscribe(data => {
      this.dataSource = data;
    })
  }

}
