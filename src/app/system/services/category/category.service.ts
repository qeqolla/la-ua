import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoryRequest, ICategoryResponse } from '../../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.BACKEND_URL;
  private api = { category: `${this.url}/category` };

  constructor(private http: HttpClient) { }

  getAll(): Observable<ICategoryResponse[]> {
    return this.http.get<ICategoryResponse[]>(this.api.category);
  }

  create(category: ICategoryRequest): Observable<void> {
    return this.http.post<void>(this.api.category, category);
  }

  update(category: ICategoryRequest, id: number): Observable<void> {
    return this.http.put<void>(`${this.api.category}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return  this.http.delete<void>(`${this.api.category}/${id}`);
  }
}
