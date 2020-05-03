import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiciosRealizadosPageRoutingModule } from './servicios-realizados-routing.module';

import { ServiciosRealizadosPage } from './servicios-realizados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiciosRealizadosPageRoutingModule
  ],
  declarations: [ServiciosRealizadosPage]
})
export class ServiciosRealizadosPageModule {}
