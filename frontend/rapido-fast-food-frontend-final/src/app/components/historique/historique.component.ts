import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { CommandeService, Commande, ProduitCommande } from '../../services/commande.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, FormsModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnInit {
  commandeSelectionnee: Commande | null = null;
  dateSelectionnee: string = ''; // Format 'YYYY-MM-DD'
  totalJournalier: number = 0;
  commandesFiltrees: Commande[] = [];

  constructor(private commandeService: CommandeService, private toastr: ToastrService) { }

  ngOnInit(): void {
    // Par défaut, afficher les commandes du jour actuel
    this.dateSelectionnee = this.getTodayDate();
    this.filtrerParDate();
  }

  // Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  filtrerParDate() {
    this.commandeService.getCommandesByDate(this.dateSelectionnee).subscribe({
      next: (commandes: Commande[]) => {
        // Map backend orderNumber to id for display if needed, 
        // or just use the data as is if we updated the interface.
        this.commandesFiltrees = commandes.map(cmd => ({
          ...cmd,
          id: cmd.orderNumber || cmd.id.toString() // Fallback to id if orderNumber missing
        }));
        this.calculerTotalJournalier();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes', err);
        this.commandesFiltrees = [];
        this.totalJournalier = 0;
      }
    });
  }

  calculerTotalJournalier() {
    this.totalJournalier = this.commandesFiltrees.reduce((acc, cmd) => {
      // Use totalAmount from backend if available, otherwise calculate
      const amount = cmd.totalAmount !== undefined ? cmd.totalAmount : this.getSommeProduits(cmd.produits);
      return acc + amount;
    }, 0);
  }

  getSommeProduits(produits: ProduitCommande[]): number {
    return produits.reduce((acc, p) => acc + p.prix, 0);
  }

  ouvrirPopup(commande: Commande) {
    this.commandeSelectionnee = commande;
  }

  fermerPopup() {
    this.commandeSelectionnee = null;
  }

  imprimer() {
    this.toastr.info('Préparation de l\'impression...', 'Impression');
    window.print();
  }
}