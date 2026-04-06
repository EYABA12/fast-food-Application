import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Obligatoire pour *ngIf
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-categories-component',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, HeaderComponent, FormsModule], // Ajoute CommonModule ici
  templateUrl: './categories-component.component.html',
  styleUrl: './categories-component.component.css'
})
export class CategoriesComponentComponent implements OnInit {
  editCategory: any = {};
  isPopupAddOpen: boolean = false;
  isPopupModifOpen: boolean = false;
  categories: Category[] = []; // Liste des catégories
  selectedId: number | null = null;
  newCategory: Category = {
    name: '',
    imageUrl: '',
  };
  constructor(private categoryService: CategoryService, private toastr: ToastrService) { }
  ngOnInit() {
    this.refresh(); // Charger les données au démarrage
    const token: string | null = localStorage.getItem('token');

    if (token) {
      // Ton code ici si le token existe
      console.log("Token récupéré :", token);
    } else {
      // Gérer l'erreur ou rediriger vers login
      console.error("Aucun token trouvé !");
    }
  }
  toggleAddPopup() {
    this.isPopupAddOpen = !this.isPopupAddOpen;
    this.newCategory.name = '';
    this.newCategory.imageUrl = '';
  }
  toggleModifPopup() {
    this.isPopupModifOpen = !this.isPopupModifOpen;
  }
  refresh() {
    this.categoryService.getAllCategories().subscribe(data => {
    this.categories = data.reverse();
      console.log("data", data)
    });
  }
  onSave() {
  const CategorytData = {
      name: this.newCategory.name,
      imageUrl: this.newCategory.imageUrl, 


    }; 
    
    this.categoryService.addCategory(CategorytData).subscribe(() => {
      this.toastr.success('Catégorie ajoutée avec succès !', 'Succès');
      this.refresh(); // Recharge la liste
      this.toggleAddPopup(); // Ferme la fenêtre
    });
  }
  // Utilise ta fonction deleteCategory
  onDelete(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.toastr.warning('Catégorie supprimée !', 'Suppression');
      this.refresh();
    });
  }
  // 1. Bouton "Modifier" du tableau
  openEdit(cat: Category) {
    this.selectedId = cat.id!;
    this.editCategory = { ...cat };
    this.isPopupModifOpen = true;
  }
  // 2. Fonction UPDATE seule
onUpdate() {
  // On vérifie que selectedId existe ET que le nom de la catégorie en cours de modif n'est pas vide
  if (this.selectedId && this.editCategory.name && this.editCategory.name.trim() !== '') {
    
    // On envoie directement editCategory qui contient déjà le nom et l'image (Base64)
    this.categoryService.updateCategory(this.selectedId, this.editCategory).subscribe({
      next: () => {
        this.toastr.success('Catégorie modifiée avec succès !', 'Succès');
        this.refresh(); // Recharge la liste pour voir le changement
        this.toggleModifPopup(); // Ferme le modal
        this.selectedId = null; // Reset de l'ID sélectionné
      },
      error: (err) => {
        console.error("Erreur update", err);
        this.toastr.error('Erreur lors de la modification', 'Erreur');
      }
    });
  } else {
    this.toastr.error('Le nom de la catégorie est obligatoire', 'Attention');
  }
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
          this.editCategory.imageUrl = base64String;
        } else {
          this.newCategory.imageUrl = base64String;
        }
      };

      // On lance la lecture du fichier sous format URL (Base64)
      reader.readAsDataURL(file);
    }
  }
}