import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CalificacionesService } from '../services/calificaciones.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-calificacion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar.html',
  styleUrls: ['./editar.css']
})
export class Editar implements OnInit {

  id: number = 0;
  
  form = {
    instrumento: '',
    tipo_calificacion: '',
    monto_original: null,
    factor_calculado: null,
    estado: '',
    usuario_responsable: '',
    observaciones: ''
  };

  // Opciones para los selects
  tiposCalificacion = [
    { value: 'Monto', label: 'Monto' },
    { value: 'Factor', label: 'Factor' },
    { value: 'Mixto', label: 'Mixto' }
  ];

  estadosDisponibles = [
    { value: 'Activa', label: 'Activa' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Inactiva', label: 'Inactiva' },
    { value: 'Rechazada', label: 'Rechazada' }
  ];

  loading = true;
  loadingSubmit = false;
  error = '';
  successMessage = '';
  notFound = false;

  constructor(
    private api: CalificacionesService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef  // ✅ Agregar esto
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('📝 Editando calificación ID:', this.id);
    
    if (!this.id || isNaN(this.id)) {
      this.error = 'ID de calificación inválido';
      this.notFound = true;
      this.loading = false;
      this.cdr.detectChanges();  // ✅ Forzar detección
      return;
    }

    this.cargarCalificacion();
  }

  cargarCalificacion(): void {
    this.loading = true;
    this.error = '';

    this.api.obtener(this.id).subscribe({
      next: (data) => {
        console.log('✅ Calificación cargada:', data);
        
        // Cargar datos en el formulario
        this.form = {
          instrumento: data.instrumento || '',
          tipo_calificacion: data.tipo_calificacion || '',
          monto_original: data.monto_original || null,
          factor_calculado: data.factor_calculado || null,
          estado: data.estado || '',
          usuario_responsable: data.usuario_responsable || '',
          observaciones: data.observaciones || ''
        };
        
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección
      },
      error: (err) => {
        console.error('❌ Error cargando calificación:', err);
        
        if (err.status === 404) {
          this.error = 'No se encontró la calificación solicitada';
          this.notFound = true;
        } else {
          this.error = 'Error al cargar la calificación. Intenta nuevamente.';
        }
        
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección
      }
    });
  }

  guardar(): void {
    // Validaciones
    if (!this.form.instrumento.trim()) {
      this.error = 'El campo Instrumento es obligatorio';
      return;
    }

    if (!this.form.tipo_calificacion) {
      this.error = 'El campo Tipo de Calificación es obligatorio';
      return;
    }

    if (!this.form.usuario_responsable.trim()) {
      this.error = 'El campo Usuario Responsable es obligatorio';
      return;
    }

    this.loadingSubmit = true;
    this.error = '';

    console.log('📤 Actualizando calificación:', this.form);

    this.api.actualizar(this.id, this.form).subscribe({
      next: (response) => {
        console.log('✅ Calificación actualizada:', response);
        this.successMessage = '✅ Calificación actualizada exitosamente';
        this.loadingSubmit = false;
        this.cdr.detectChanges();  // ✅ Forzar detección
        
        setTimeout(() => {
          this.router.navigate(['/calificaciones']);
        }, 1500);
      },
      error: (err) => {
        this.loadingSubmit = false;
        console.error('❌ Error actualizando:', err);
        
        if (err.error && typeof err.error === 'object') {
          const errorMessages = Object.entries(err.error)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          this.error = `Error: ${errorMessages}`;
        } else {
          this.error = err.error?.detail || 'Error al actualizar la calificación. Intenta nuevamente.';
        }
        
        this.cdr.detectChanges();  // ✅ Forzar detección
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/calificaciones']);
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }

  eliminar(): void {
    if (!confirm('¿Estás seguro de eliminar esta calificación? Esta acción no se puede deshacer.')) {
      return;
    }

    this.loadingSubmit = true;

    this.api.eliminar(this.id).subscribe({
      next: () => {
        console.log('✅ Calificación eliminada');
        this.successMessage = '✅ Calificación eliminada exitosamente';
        this.cdr.detectChanges();  // ✅ Forzar detección
        
        setTimeout(() => {
          this.router.navigate(['/calificaciones']);
        }, 1500);
      },
      error: (err) => {
        this.loadingSubmit = false;
        console.error('❌ Error eliminando:', err);
        this.error = 'Error al eliminar la calificación.';
        this.cdr.detectChanges();  // ✅ Forzar detección
      }
    });
  }
}