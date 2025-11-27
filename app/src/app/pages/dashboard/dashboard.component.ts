import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CalificacionesService } from '../calificaciones/services/calificaciones.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  
  totalCalificaciones = 0;
  calificacionesPendientes = 0;
  calificacionesActivas = 0;
  instrumentosNoInscritos = 0;
  ultimaCargaFecha = '—';
  actividadReciente: any[] = [];
  loading = true;
  error = '';

  distribucionEstados = {
    activas: 0,
    pendientes: 0,
    inactivas: 0,
    rechazadas: 0
  };

  constructor(
    private router: Router,
    private calificacionesService: CalificacionesService,
    private cdr: ChangeDetectorRef  // ✅ Agregar esto
  ) {}

  ngOnInit(): void {
    this.cargarDatosOptimizado();
  }

  cargarDatosOptimizado(): void {
    this.loading = true;
    const startTime = performance.now();
    
    this.calificacionesService.obtenerEstadisticasDashboard().subscribe({
      next: (response) => {
        console.log(`⚡ Datos recibidos en ${(performance.now() - startTime).toFixed(2)}ms`);
        
        this.totalCalificaciones = response.stats.total;
        this.calificacionesActivas = response.stats.activas;
        this.calificacionesPendientes = response.stats.pendientes;
        this.distribucionEstados = response.stats.distribucion;
        this.ultimaCargaFecha = response.stats.ultima_fecha 
          ? new Date(response.stats.ultima_fecha).toLocaleDateString('es-CL') 
          : '—';
        
        this.actividadReciente = response.actividad_reciente.map((c: any) => ({
          tipo: 'Calificación',
          accion: 'creada',
          detalle: `${c.instrumento} - ${c.tipo_calificacion}`,
          fecha: c.fecha_registro,
          usuario: c.usuario_responsable
        }));
        
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
        
        const totalTime = (performance.now() - startTime).toFixed(2);
        console.log(`✅ Dashboard cargado en ${totalTime}ms`);
      },
      error: (err) => {
        console.error('❌ Error cargando dashboard:', err);
        this.error = 'Error al cargar los datos del dashboard';
        this.loading = false;
        this.cdr.detectChanges();  // ✅ Forzar detección de cambios
      }
    });
  }

  goToCreate() {
    this.router.navigate(['/calificaciones/crear']);
  }

  goToCalificaciones() {
    this.router.navigate(['/calificaciones']);
  }

  goToCargaMontos() {
    this.router.navigate(['/carga-masiva/dj1948']);
  }

  goToCargaFactores() {
    this.router.navigate(['/carga-masiva/factores']);
  }

  goToInstrumentos() {
    this.router.navigate(['/instrumentos/no-inscritos']);
  }

  goToCargaMasiva() {
    this.router.navigate(['/carga-masiva']);
  }

  calcularPorcentaje(valor: number, total: number): number {
    return total > 0 ? Math.round((valor / total) * 100) : 0;
  }
}