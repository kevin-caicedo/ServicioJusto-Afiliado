import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PqrsPage } from './pqrs.page';

const routes: Routes = [
  {
    path: '',
    component: PqrsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PqrsPageRoutingModule {}
