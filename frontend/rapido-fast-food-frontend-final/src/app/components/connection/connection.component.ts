import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-connection',
  standalone: true, // Recommandé pour les imports
  imports: [
    RouterModule, 
    ReactiveFormsModule, 
    CommonModule
  ], 
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.css'
})
export class ConnectionComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  

  onLogin() {
    if (this.loginForm.valid) {
      this.errorMessage = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (token: string) => {
          // Succès : le token est une string pure
          localStorage.setItem('token', token);
          console.log("tokenest ",token)
          this.toastr.success('Connexion réussie !', 'Bienvenue');
          this.router.navigate(['/Accueil']);
        },
        error: (err) => {
          console.error('Erreur brut du serveur:', err);
          
          let message = "Une erreur serveur est survenue.";

          // Sécurité : Si l'erreur est du texte (à cause du responseType: text), on la parse
          if (err.status === 401 || err.status === 403) {
            try {
              // On essaie de lire le message JSON envoyé par le GlobalExceptionHandler
              const errorObj = typeof err.error === 'string' ? JSON.parse(err.error) : err.error;
              message = errorObj.message || "Email ou mot de passe incorrect";
            } catch (e) {
              message = "Email ou mot de passe incorrect";
            }
          }
          
          this.errorMessage = message;
          this.toastr.error(this.errorMessage, 'Erreur');
        }
      });
    }
  }
}