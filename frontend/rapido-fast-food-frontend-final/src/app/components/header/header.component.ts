import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isFullscreen = false;
  isAdmin = false;
currentDate: Date = new Date();
  timer: any;
  constructor(private authService: AuthService) {
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.timer = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }
ngOnDestroy() {
    // Nettoie le timer quand on quitte le composant
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      // Entrer en mode plein écran
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen = true;
      }).catch(err => {
        console.log(`Erreur lors de l'activation du plein écran: ${err.message}`);
      });
    } else {
      // Sortir du mode plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          this.isFullscreen = false;
        });
      }
    }
  }
}