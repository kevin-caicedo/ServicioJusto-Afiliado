import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiciosRealizadosPage } from './servicios-realizados.page';

const routes: Routes = [
  {
    path: '',
    component: ServiciosRealizadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiciosRealizadosPageRoutingModule {}
