import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

private apiUrl = '/api/categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

 // Ajouter une catégorie
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Modifier partiellement (PATCH)
  updateCategory(id: number, updates: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.apiUrl}/${id}`, updates);
  }
}