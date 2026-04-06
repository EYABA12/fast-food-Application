import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inscription',
  standalone: true, // Assure-toi que c'est un standalone component si tu utilises 'imports'
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator } // Validateur de groupe
    );
  }

  // Correction de la signature du validateur
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    // Si les mots de passe ne correspondent pas, on retourne l'erreur 'mismatch'
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.errorMessage = null; 

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.toastr.success('Inscription réussie !', 'Succès');
          console.log('Utilisateur créé avec succès', response);
          // Redirection après 2 secondes pour laisser le temps de voir le message
          setTimeout(() => {
            this.router.navigate(['/connection']);
          }, 2000);
        },
        error: (err) => {
          console.error('Erreur reçue du backend', err);
          
          // Récupération du message du Backend (ton DuplicateEmailException)
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = "Une erreur de connexion est survenue.";
          }
          
          // On affiche aussi l'erreur en Toastr pour une meilleure visibilité
          this.toastr.error(this.errorMessage || 'Erreur', 'Échec');
        }
      });
    } else {
      // Si le formulaire est envoyé alors qu'il est invalide (bouton forcé)
      this.toastr.warning('Veuillez remplir correctement tous les champs.');
    }
  }
}