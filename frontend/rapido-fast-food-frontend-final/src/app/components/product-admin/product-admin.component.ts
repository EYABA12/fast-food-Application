import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/Product';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, FormsModule],
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {
  editProduct: any = {};
  isPopupOpen = false;
  isEditPopupOpen = false;
  categories: any[] = []; // Liste pour stocker les catégories du backend
  // Modèles de données
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';


  newProduct: any = {
    name: '',
    description: '',
    price: '',
    category: null,
    imageUrl: '',
    available: true,
  };



  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.refreshCategories(); // Charge les catégories au démarrage
  }
  refreshCategories() {
    this.categoryService.getAllCategories().subscribe(data => {
      this.categories = data.reverse();
      console.log("Catégories chargées :", data);
    });
  }
  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data.reverse();
      console.log(this.products)
      this.filterProducts();    });
  }

  // --- ACTIONS ---

  addProduct() {
   
    const productData = {
      name: this.newProduct.name,
      description: this.newProduct.description,
      imageUrl: this.newProduct.imageUrl, 
      category: this.newProduct.category,
      available: true,
      price: this.newProduct.price,

    };

    this.productService.addProduct(productData).subscribe({
      next: () => {
        this.toastr.success('Produit ajouté avec succès !', 'Succès');
        this.loadProducts();
        this.togglePopup();
      },
      error: (err) => console.error("Erreur Backend:", err)
    });
  }

  deleteProduct(id: number) {
    if (confirm('Supprimer ce produit ?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.toastr.warning('Produit supprimé !', 'Suppression');
        this.loadProducts();
      });
    }
  }

  // Mapping des IDs de catégories (à adapter selon ta DB)
  getSelectedCategoryId(categoryName: string): number {
    const mapping: { [key: string]: number } = { 'pizza': 5, 'burger': 6, 'jus': 7 };
    return mapping[categoryName.toLowerCase()] || 0;
  }

  // --- FILTRAGE ---

filterProducts() {
  this.filteredProducts = this.products.filter(product => {
    // 1. Logique Recherche
    const matchesSearch = !this.searchQuery ||
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(this.searchQuery.toLowerCase()));

    // 2. Logique Catégorie
    // Si selectedCategory est vide (""), on retourne true pour tout le monde
    const matchesCategory = !this.selectedCategory || 
      (product.category && product.category.name.toLowerCase() === this.selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });
}

  

  // --- UI & FILES ---

  togglePopup() {
    this.isPopupOpen = !this.isPopupOpen;
    if (this.isPopupOpen) this.resetNewProduct();
  }


  resetNewProduct() {
    this.newProduct = { name: '', description: '', category: '', image: '', price: 0 };
  }
  openEditPopup(product: any) {
    this.isEditPopupOpen = true;
    // {...} crée une copie pour ne pas modifier le tableau en direct avant d'enregistrer
    this.editProduct = { ...product };

   
  }

  closeEditPopup() {
    this.isEditPopupOpen = false;
  }

 

  updateProduct() {


    // Préparation de l'objet propre
    const finalData = {
      ...this.editProduct,
    };

    this.productService.updateProduct(this.editProduct.id, finalData).subscribe({
      next: () => {
        this.toastr.success('Produit modifié avec succès !', 'Succès');
        this.loadProducts(); // Rafraîchir le tableau principal
        this.closeEditPopup(); // Fermer le popup
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour :", err);
      }
    });
  }
  onFileSelected(event: any, isEdit: boolean = false) {
    const file = event.target.files[0]; // On récupère le fichier sélectionné

    if (file) {
      // Vérification optionnelle de la taille (ex: max 2Mo)
      if (file.size > 2 * 1024 * 1024) {
        this.toastr.error("L'image est trop lourde ! Choisissez une image de moins de 2Mo.", "Fichier Trop Large");
        return;
      }

      const reader = new FileReader();

      // Cette fonction s'exécute quand la lecture du fichier est terminée
      reader.onload = () => {
        const base64String = reader.result as string;

        if (isEdit) {
          // Si on est dans le popup MODIFIER
          this.editProduct.imageUrl = base64String;
        } else {
          this.newProduct.imageUrl = base64String;
        }
      };

      // On lance la lecture du fichier sous format URL (Base64)
      reader.readAsDataURL(file);
    }
  }
  // Fi west el classe mta3ek
  compareCategories(cat1: any, cat2: any): boolean {
    // Ken el zouz null, mriguel
    if (!cat1 && !cat2) return true;
    // Ken el zouz mawjoudin, n-9arnou bil ID
    return cat1 && cat2 ? cat1.id === cat2.id : false;
  }
}