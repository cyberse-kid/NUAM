import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalificacionesService } from '../services/calificaciones.service';

@Component({
  selector: 'app-editar-calificacion',
  standalone: true,
  templateUrl: './editar.html',
  styleUrls: ['./editar.css']
})
export class Editar {

  id!: number;
  form: any = {};

  constructor(
    private route: ActivatedRoute,
    private api: CalificacionesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.obtener(this.id).subscribe((data: any) => {
      this.form = data;
    });
  }

  guardar() {
    this.api.actualizar(this.id, this.form).subscribe(() => {
      this.router.navigate(['/calificaciones']);
    });
  }
}
