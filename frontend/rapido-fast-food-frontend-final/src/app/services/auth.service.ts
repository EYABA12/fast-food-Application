import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  constructor(private http: HttpClient) { }
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscription`, user);
  }

  login(credentials: any): Observable<string> {
    return this.http.post(`${this.apiUrl}/connexion`, credentials, {
      responseType: 'text' // car ton backend retourne un token String
    });
  }

  getUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.email || null;
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    const email = this.getUserEmail();
    return email === 'hassenzouari@gmail.com';
  }

  logout() {
  localStorage.removeItem('token'); 
  // Supprime aussi les infos admin si tu en as
  localStorage.removeItem('role');
}
}
