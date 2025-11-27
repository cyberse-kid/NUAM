import { Routes } from '@angular/router';

// Dashboard
import { Dashboard } from './pages/dashboard/dashboard.component';

// Calificaciones
import { Lista } from './pages/calificaciones/lista/lista.component';
import { Crear } from './pages/calificaciones/crear/crear.component';
import { Editar } from './pages/calificaciones/editar/editar.component';

// Landing
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
  // Landing page
  { path: '', component: LandingComponent },
  
  // Dashboard
  { path: 'dashboard', component: Dashboard },
  
  // Calificaciones
  { path: 'calificaciones', component: Lista },
  { path: 'calificaciones/crear', component: Crear },
  { path: 'calificaciones/editar/:id', component: Editar },
  
  // Carga masiva (por ahora redirigen al dashboard hasta que crees los componentes)
  { path: 'carga-masiva/dj1948', component: Dashboard },
  { path: 'carga-masiva/factores', component: Dashboard },
  { path: 'carga-masiva', component: Dashboard },
  
  // Instrumentos
  { path: 'instrumentos/no-inscritos', component: Dashboard },
  
  // Wildcard - redirige a landing si la ruta no existe
  { path: '**', redirectTo: '' }
];