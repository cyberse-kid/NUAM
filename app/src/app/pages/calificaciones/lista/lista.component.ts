import { Component, OnInit } from '@angular/core';
import { CalificacionesService } from '../services/calificaciones.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './lista.html',
  styleUrls: ['./lista.css']
})
export class Lista implements OnInit {

  calificaciones: any[] = [];
  filtro = '';
  loading = true;
  error = '';
  successMessage = '';

  constructor(
    private api: CalificacionesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCalificaciones();
  }

  cargarCalificaciones(): void {
    this.loading = true;
    this.error = '';

    this.api.listar().subscribe({
      next: (data: any[]) => {
        this.calificaciones = data;
        this.loading = false;
        console.log('✅ Calificaciones cargadas:', data.length);
      },
      error: (err) => {
        console.error('❌ Error cargando calificaciones:', err);
        this.error = 'Error al cargar las calificaciones. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  buscar(): void {
    this.loading = true;
    this.error = '';

    if (this.filtro.trim() === '') {
      this.cargarCalificaciones();
      return;
    }

    this.api.buscar(this.filtro).subscribe({
      next: (data: any[]) => {
        this.calificaciones = data;
        this.loading = false;
        console.log(`🔍 Búsqueda "${this.filtro}": ${data.length} resultados`);
      },
      error: (err) => {
        console.error('❌ Error en búsqueda:', err);
        this.error = 'Error al realizar la búsqueda.';
        this.loading = false;
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta calificación? Esta acción no se puede deshacer.')) {
      return;
    }

    this.api.eliminar(id).subscribe({
      next: () => {
        this.successMessage = '✅ Calificación eliminada exitosamente';
        console.log('✅ Calificación eliminada:', id);
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.cargarCalificaciones();
      },
      error: (err) => {
        console.error('❌ Error eliminando:', err);
        this.error = 'Error al eliminar la calificación.';
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/calificaciones/editar', id]);
  }

  crear(): void {
    this.router.navigate(['/calificaciones/crear']);
  }

  volverDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  limpiarFiltro(): void {
    this.filtro = '';
    this.cargarCalificaciones();
  }
}