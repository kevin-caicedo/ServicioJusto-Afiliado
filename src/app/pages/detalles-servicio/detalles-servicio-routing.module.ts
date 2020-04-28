import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallesServicioPage } from './detalles-servicio.page';

const routes: Routes = [
  {
    path: '',
    component: DetallesServicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallesServicioPageRoutingModule {}
