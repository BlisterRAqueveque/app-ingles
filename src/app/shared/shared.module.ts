import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BingoComponent } from './bingo/bingo.component';
import { DrawWriteComponent } from './draw-write/draw-write.component';
import { FillInTheBlanksComponent } from './fill-in-the-blanks/fill-in-the-blanks.component';
import { LabelingExerciseComponent } from './labeling-exercise/labeling-exercise.component';
import { ListeningExerciseComponent } from './listening-exercise/listening-exercise.component';
import { MatchExerciseComponent } from './match-exercise/match-exercise.component';
import { SequenceExerciseComponent } from './sequence-exercise/sequence-exercise.component';
import { SpeakingExerciseComponent } from './speaking-exercise/speaking-exercise.component';
import { WordGameComponent } from './word-game/word-game.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Módulo necesario para las directivas del CDK (cdkDrag, cdkDropList)
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    BingoComponent,
    DrawWriteComponent,
    FillInTheBlanksComponent,
    LabelingExerciseComponent,
    ListeningExerciseComponent,
    MatchExerciseComponent,
    SequenceExerciseComponent,
    SpeakingExerciseComponent,
    WordGameComponent,
    CrosswordComponent,
  ],
  imports: [CommonModule, IonicModule, FormsModule, DragDropModule],
  exports: [
    FormsModule,
    DragDropModule,
    IonicModule,
    /* Ejercicios */
    BingoComponent,
    DrawWriteComponent,
    FillInTheBlanksComponent,
    LabelingExerciseComponent,
    ListeningExerciseComponent,
    MatchExerciseComponent,
    SequenceExerciseComponent,
    SpeakingExerciseComponent,
    WordGameComponent,
    CrosswordComponent,
    FormsModule,
    IonicModule,
    DragDropModule,
    CrosswordComponent,
  ],
})
export class SharedModule { }
