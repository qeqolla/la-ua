import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IOrderRequest, IOrderResponse } from '../../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public changeBasket$ = new Subject<boolean>();

  private url = environment.BACKEND_URL;
  private api = { orders: `${this.url}/orders` };

  constructor(private http: HttpClient) { }

  getAll(): Observable<IOrderResponse[]> {
    return this.http.get<IOrderResponse[]>(this.api.orders);
  }

  getOne(id: number): Observable<IOrderResponse> {
    return this.http.get<IOrderResponse>(`${this.api.orders}/${id}`);
  }

  create(order: IOrderRequest): Observable<void> {
    return this.http.post<void>(this.api.orders, order);
  }

  update(order: IOrderRequest, id: number): Observable<void> {
    return this.http.put<void>(`${this.api.orders}/${id}`, order);
  }

  delete(id: number): Observable<void> {
    return  this.http.delete<void>(`${this.api.orders}/${id}`);
  }
}
