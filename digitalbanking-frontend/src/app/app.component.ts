import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    // Ajout de l'intégration de Bootstrap pour les dropdowns et autres fonctionnalités
    this.loadBootstrapJs();
  }

  private loadBootstrapJs(): void {
    // Cette méthode est nécessaire pour que les dropdowns fonctionnent correctement
    // Cette solution est adaptée pour un projet standalone sans jQuery
    if (typeof document !== 'undefined') { // Vérifier si exécuté côté navigateur
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js';
      script.integrity = 'sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4';
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);
    }
  }
}
