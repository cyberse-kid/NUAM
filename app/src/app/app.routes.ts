import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Landing } from './landing/landing'; // importa tu componente

// define tus rutas
const routes: Routes = [
  { path: '', component: Landing },
  // otras rutas si quieres
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
