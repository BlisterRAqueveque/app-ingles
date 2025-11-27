import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletarTextoComponent } from './completar-texto/completar-texto.component';

const routes: Routes = [
  { path: '', component: CompletarTextoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class FillInTheBlanksRoutingModule { }
