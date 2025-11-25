import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SpeakingExerciseComponent } from './shared/speaking-exercise/speaking-exercise.component';
import { CrosswordComponent } from './shared/crossword/crossword.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'completar-texto',
    loadChildren: () =>
      import(
        './modules/actividades/fill-in-the-blanks/fill-in-the-blanks.module'
      ).then((m) => m.FillInTheBlanksModule),
  },
  // Ejercicios
  {
    path: 'speaking-exercise',
    component: SpeakingExerciseComponent,
  },
  {
    path: 'crossword',
    component: CrosswordComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
