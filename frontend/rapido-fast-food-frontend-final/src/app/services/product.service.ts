import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private apiUrl = '/api/products'; // Port par défaut Spring Boot
constructor(private http: HttpClient) {}
getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
addProduct(product: any): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }
deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
updateProduct(id: number, updates: any): Observable<any> {
  // L'URL inclut l'ID du produit : /api/products/123
  return this.http.patch<any>(`${this.apiUrl}/${id}`, updates);
}

}
