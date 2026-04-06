import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProduitCommande {
  nom: string;
  prix: number;
}

export interface Commande {
  id: string; // Match frontend component expectations
  orderNumber: string; // Match backend entity
  date: string;
  heure: string;
  produits: ProduitCommande[];
  statut: string;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = '/api/commandes';

  constructor(private http: HttpClient) {}

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommandesByDate(date: string): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.apiUrl}/search?date=${date}`);
  }

  createCommande(commande: any): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }
}
