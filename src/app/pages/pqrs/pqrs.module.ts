import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PqrsPageRoutingModule } from './pqrs-routing.module';

import { PqrsPage } from './pqrs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PqrsPageRoutingModule
  ],
  declarations: [PqrsPage]
})
export class PqrsPageModule {}
