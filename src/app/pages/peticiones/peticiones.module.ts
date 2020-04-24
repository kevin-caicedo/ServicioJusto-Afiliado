import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PeticionesPageRoutingModule } from './peticiones-routing.module';

import { PeticionesPage } from './peticiones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PeticionesPageRoutingModule
  ],
  declarations: [PeticionesPage]
})
export class PeticionesPageModule {}
