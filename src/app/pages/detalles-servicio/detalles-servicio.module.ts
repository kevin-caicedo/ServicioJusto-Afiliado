import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallesServicioPageRoutingModule } from './detalles-servicio-routing.module';

import { DetallesServicioPage } from './detalles-servicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallesServicioPageRoutingModule
  ],
  declarations: [DetallesServicioPage]
})
export class DetallesServicioPageModule {}
