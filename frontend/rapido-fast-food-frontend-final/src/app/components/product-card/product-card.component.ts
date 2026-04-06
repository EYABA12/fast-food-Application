import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

import { CommandeService } from '../../services/commande.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FormsModule],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  categories: Category[] = [];
  selectedCategory: string = '';
  filteredProducts: any[] = [];
  lastOrderNumber: string = '';
  searchTerm: string = '';
  products: any[] = [];
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private commandeService: CommandeService,
    private toastr: ToastrService
  ) { }
  ngOnInit() {
    this.refresh();
    this.loadProducts();

  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...this.products];
        console.log("Produits chargés :", this.products);
      },
      error: (err) => console.error("Erreur chargement :", err)
    });
  }
  //1- get all category
  refresh() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.reverse();
      console.log("data", data)
    });
  }

  getProductPrice(product: any): number {
    // 1. Si le prix simple existe, on l'utilise
    if (product.price && product.price > 0) {
      return product.price;
    }

    // 2. Sinon, on cherche le prix dans la première variation
    if (product.variations && product.variations.length > 0) {
      return product.variations[0].price; // Exemple: Prix de la taille "Petit"
    }

    // 3. Sécurité : si rien n'est trouvé, on retourne 0 pour ne pas casser le panier
    return 0;
  }
  cart: any[] = [];
  addToCart(name: string, price: number) {
    const existingItem = this.cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.qty++;
    } else {
      this.cart.push({ name, price, qty: 1, date: new Date() });
    }
    this.toastr.info(`${name} ajouté au panier`, 'Panier', {
      timeOut: 2000,
      positionClass: 'toast-top-right'
    });
  }

  // Diminuer la quantité
  decreaseQty(item: any) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      this.removeFromCart(item);
    }
  }

  // Supprimer
  removeFromCart(item: any) {
    this.cart = this.cart.filter(i => i !== item);
  }

  getTotal() {
    return this.cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  // Pour le popup Facture
  showInvoice = false;
  currentDate = new Date();

openInvoice() {
  if (this.cart.length === 0) return;

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);

  const nouvelleCommande = {
    date: dateStr,
    heure: timeStr,
    totalAmount: this.getTotal(),
    produits: this.cart.map(item => ({
      nom: item.name,
      prix: item.price,
      quantite: item.qty
    }))
  };

  // On enregistre en base ICI pour avoir le numéro de commande tout de suite
  this.commandeService.createCommande(nouvelleCommande).subscribe({
    next: (res) => {
      this.lastOrderNumber = res.orderNumber; // Le numéro (1, 2, 3...) arrive ici
      this.currentDate = new Date();
      this.showInvoice = true; // On n'affiche la facture que quand on a le numéro
      this.toastr.success('Commande générée n°' + res.orderNumber);
    },
    error: (err) => {
      this.toastr.error('Erreur lors de la création de la facture');
      console.error(err);
    }
  });
}

 imprimerFacture() {
  // On ne rappelle PAS le service ici car la commande est déjà en base !
  window.print();
  
  // On vide tout pour la commande suivante
  this.cart = []; 
  this.showInvoice = false;
  this.lastOrderNumber = ''; 
}
  selectCategory(categoryName: string) {
    this.selectedCategory = categoryName;
    this.filterProducts(); // Appelle ta fonction de filtrage existante
  }
  filterProducts() {
    // 1. On part de la liste complète des produits
    this.filteredProducts = this.products.filter(product => {

      // 2. Filtre par Catégorie
      const matchesCategory = !this.selectedCategory ||
        (product.category && product.category.name.toLowerCase().trim() === this.selectedCategory.toLowerCase().trim());

      // 3. Filtre par Texte (Recherche)
      const matchesSearch = !this.searchTerm ||
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase().trim());

      // Le produit est gardé s'il remplit les DEUX conditions
      return matchesCategory && matchesSearch;
    });

    console.log('Résultats :', this.filteredProducts.length);
  }
  addSelectedToCart(product: any) {
    let finalName = product.name;
    let finalPrice = this.getProductPrice(product);

    // Si une variation est sélectionnée, on change le nom et le prix
    if (product.selectedVariation) {
      finalName = `${product.name} (${product.selectedVariation.size})`;
      finalPrice = product.selectedVariation.price;
    } else if (product.variations && product.variations.length > 0) {
      // Si le client n'a rien choisi mais qu'il y a des variations, 
      // on prend la première par défaut (ex: Mini)
      const firstVar = product.variations[0];
      finalName = `${product.name} (${firstVar.size})`;
      finalPrice = firstVar.price;
    }

    this.addToCart(finalName, finalPrice);
  }
}
