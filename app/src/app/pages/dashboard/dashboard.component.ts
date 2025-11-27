import { Component, OnInit } from '@angular/core';
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
  
  // KPIs
  totalCalificaciones = 0;
  calificacionesPendientes = 0;
  calificacionesActivas = 0;
  instrumentosNoInscritos = 0;
  ultimaCargaFecha = '—';

  // Actividad reciente
  actividadReciente: any[] = [];
  
  // Estados
  loading = true;
  error = '';

  // Datos para el gráfico de distribución
  distribucionEstados = {
    activas: 0,
    pendientes: 0,
    inactivas: 0,
    rechazadas: 0
  };

  constructor(
    private router: Router,
    private calificacionesService: CalificacionesService
  ) {}

  ngOnInit(): void {
    this.cargarDatosOptimizado();
  }

  // ✅ MÉTODO OPTIMIZADO - Usa el endpoint dashboard_stats
  cargarDatosOptimizado(): void {
    this.loading = true;
    const startTime = performance.now();
    
    this.calificacionesService.obtenerEstadisticasDashboard().subscribe({
      next: (response) => {
        console.log(`⚡ Datos recibidos en ${(performance.now() - startTime).toFixed(2)}ms`);
        
        // Asignar estadísticas directamente
        this.totalCalificaciones = response.stats.total;
        this.calificacionesActivas = response.stats.activas;
        this.calificacionesPendientes = response.stats.pendientes;
        this.distribucionEstados = response.stats.distribucion;
        this.ultimaCargaFecha = response.stats.ultima_fecha 
          ? new Date(response.stats.ultima_fecha).toLocaleDateString('es-CL') 
          : '—';
        
        // Actividad reciente ya viene optimizada
        this.actividadReciente = response.actividad_reciente.map((c: any) => ({
          tipo: 'Calificación',
          accion: 'creada',
          detalle: `${c.instrumento} - ${c.tipo_calificacion}`,
          fecha: c.fecha_registro,
          usuario: c.usuario_responsable
        }));
        
        this.loading = false;
        const totalTime = (performance.now() - startTime).toFixed(2);
        console.log(`✅ Dashboard cargado en ${totalTime}ms`);
        console.log('📊 Estadísticas:', {
          total: this.totalCalificaciones,
          activas: this.calificacionesActivas,
          pendientes: this.calificacionesPendientes
        });
      },
      error: (err) => {
        console.error('❌ Error cargando dashboard:', err);
        this.error = 'Error al cargar los datos del dashboard';
        this.loading = false;
      }
    });
  }

  // Navegación
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

  // Calcular porcentaje para barras de progreso
  calcularPorcentaje(valor: number, total: number): number {
    return total > 0 ? Math.round((valor / total) * 100) : 0;
  }
}