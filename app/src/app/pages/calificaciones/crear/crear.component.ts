import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CalificacionesService } from '../services/calificaciones.service';  // Ajusta la ruta si es necesario
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-calificacion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './crear.html',
  styleUrls: ['./crear.css']
})
export class Crear {

  form = {
    instrumento: '',
    tipo_calificacion: 'Monto',
    monto_original: null,
    factor_calculado: 1.0,
    estado: 'Activa',
    usuario_responsable: '',
    observaciones: ''
  };

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

  loading = false;
  error = '';
  successMessage = '';

  constructor(private api: CalificacionesService, private router: Router) {}

  guardar() {
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

    this.loading = true;
    this.error = '';

    console.log('📤 Enviando datos:', this.form);

    this.api.crear(this.form).subscribe({
      next: (response) => {
        console.log('✅ Respuesta exitosa:', response);
        this.successMessage = '✅ Calificación creada exitosamente';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/calificaciones']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error completo:', err);
        
        if (err.error && typeof err.error === 'object') {
          const errorMessages = Object.entries(err.error)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          this.error = `Error: ${errorMessages}`;
        } else {
          this.error = err.error?.detail || 'Error al crear la calificación. Intenta nuevamente.';
        }
      }
    });
  }

  cancelar() {
    this.router.navigate(['/calificaciones']);
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}