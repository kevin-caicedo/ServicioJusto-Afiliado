import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeticionesPage } from './peticiones.page';

const routes: Routes = [
  {
    path: '',
    component: PeticionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeticionesPageRoutingModule {}
