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
    CrosswordComponent
  ],
  imports: [CommonModule],
  exports: [
    BingoComponent,
    DrawWriteComponent,
    FillInTheBlanksComponent,
    LabelingExerciseComponent,
    ListeningExerciseComponent,
    MatchExerciseComponent,
    SequenceExerciseComponent,
    SpeakingExerciseComponent,
    WordGameComponent,
    CrosswordComponent
  ],
})
export class SharedModule {}
