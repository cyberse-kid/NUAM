import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private router: Router,
    private cdr: ChangeDetectorRef  // ✅ Agregar esto
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando carga de calificaciones...');
    this.cargarCalificaciones();
  }

  cargarCalificaciones(): void {
    this.loading = true;
    this.error = '';
    console.log('📡 Llamando al API...');

    this.api.listar().subscribe({
      next: (data: any[]) => {
        console.log('✅ Datos recibidos:', data.length, 'registros');
        this.calificaciones = data;
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
      },
      error: (err) => {
        console.error('❌ Error cargando calificaciones:', err);
        this.error = 'Error al cargar las calificaciones. Intenta nuevamente.';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
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
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
        console.log(`🔍 Búsqueda "${this.filtro}": ${data.length} resultados`);
      },
      error: (err) => {
        console.error('❌ Error en búsqueda:', err);
        this.error = 'Error al realizar la búsqueda.';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
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
          this.cdr.detectChanges();  // ✅ Forzar detección de cambios
        }, 3000);
        this.cargarCalificaciones();
      },
      error: (err) => {
        console.error('❌ Error eliminando:', err);
        this.error = 'Error al eliminar la calificación.';
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
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