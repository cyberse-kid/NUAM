import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  
  features = [
    {
      icon: '📊',
      title: 'Gestión de Calificaciones',
      description: 'Crea, edita y administra calificaciones tributarias de forma eficiente'
    },
    {
      icon: '📁',
      title: 'Carga Masiva',
      description: 'Importa archivos DJ1948 y factores tributarios de manera automatizada'
    },
    {
      icon: '🛠',
      title: 'Control de Instrumentos',
      description: 'Administra y da seguimiento a instrumentos no inscritos'
    },
    {
      icon: '📈',
      title: 'Reportes y Análisis',
      description: 'Visualiza métricas y genera reportes detallados'
    }
  ];

  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToCalificaciones() {
    this.router.navigate(['/calificaciones']);
  }

  goToLogin() {
    // Implementar cuando tengas el login
    console.log('Ir a login');
  }
}