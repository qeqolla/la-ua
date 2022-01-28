import { Injectable } from '@angular/core';
import {IDiscountRequest, IDiscountResponse} from '../../interfaces/discount.interface';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

  private discounts: Array<IDiscountResponse> = [
    {
      id: 1,
      description: `Акція «2+1» діє в понеділок, вівторок, середу та четвер. Замовляйте дві піци та отримуйте ще одну безкоштовно!`,
      imagePath: 'https://la.ua/wp-content/uploads/2021/08/4.png'
    }
  ];

  private url = environment.BACKEND_URL;
  private api = { discounts: `${this.url}/discounts` };

  constructor(private http: HttpClient) { }

  getDiscounts(): Array<IDiscountResponse> {
    return this.discounts;
  }

  getOneDiscount(id: number): IDiscountResponse {
    return this.discounts.filter(d => d.id === id)[0];
  }

  addDiscount(discount: IDiscountResponse): void {
    this.discounts.push(discount);
  }

  updateDiscount(discount: IDiscountResponse): void {
    const index = this.discounts.findIndex(d => d.id === discount.id);
    this.discounts.splice(index, 1, discount);
  }

  deleteDiscount(id: number) {
    const index = this.discounts.findIndex(d => d.id === id);
    this.discounts.splice(index, 1);
  }

  // ======================================================================

  getAll(): Observable<IDiscountResponse[]> {
    return this.http.get<IDiscountResponse[]>(this.api.discounts);
  }

  getOne(id: number): Observable<IDiscountResponse> {
    return this.http.get<IDiscountResponse>(`${this.api.discounts}/${id}`);
  }

  create(discount: IDiscountRequest): Observable<void> {
    return this.http.post<void>(this.api.discounts, discount);
  }

  update(discount: IDiscountRequest, id: number): Observable<void> {
    return this.http.put<void>(`${this.api.discounts}/${id}`, discount);
  }

  delete(id: number): Observable<void> {
    return  this.http.delete<void>(`${this.api.discounts}/${id}`);
  }
}
