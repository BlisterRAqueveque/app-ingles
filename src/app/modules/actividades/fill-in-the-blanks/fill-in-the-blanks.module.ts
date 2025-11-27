import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FillInTheBlanksRoutingModule } from './fill-in-the-blanks-routing.module';
import { CompletarTextoComponent } from './completar-texto/completar-texto.component';
import { SharedModule } from '@/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    CompletarTextoComponent
  ],
  imports: [
    CommonModule,
    FillInTheBlanksRoutingModule,
    SharedModule,
    IonicModule
  ]
})
export class FillInTheBlanksModule { }
