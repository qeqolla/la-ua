import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IProductRequest, IProductResponse } from '../../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public changeProducts$ = new Subject<boolean>();

  private url = environment.BACKEND_URL;
  private api = { products: `${this.url}/products` };

  constructor(private http: HttpClient) { }

  getAll(): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(this.api.products);
  }

  getAllByCategory(name: string): Observable<IProductResponse[]> {
    return this.http.get<IProductResponse[]>(`${this.api.products}?category.path=${name}`);
  }

  getOne(id: number): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.api.products}/${id}`);
  }

  create(product: IProductRequest): Observable<void> {
    return this.http.post<void>(this.api.products, product);
  }

  update(product: IProductRequest, id: number): Observable<void> {
    return this.http.put<void>(`${this.api.products}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return  this.http.delete<void>(`${this.api.products}/${id}`);
  }
}
