import { Component, OnInit, Input } from '@angular/core';
import { DataLoaderService } from '../../services/data-loader.service';
import { UserProgressService } from '../../services/user-progress.service';
import { Flashcard, FlashcardOption, FlashcardGameData } from '../../models/flashcard.model';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-match-exercise',
  standalone: false,
  templateUrl: './match-exercise.component.html',
  styleUrls: ['./match-exercise.component.scss'],
})
export class MatchExerciseComponent implements OnInit {
  @Input() exerciseId!: string; // Ejemplo: 'personal-presentation-memory'.
  
  public flashcards: Flashcard[] = [];
  public allAvailableOptions: string[] = []; // Opciones cargadas del servicio
  public currentCardIndex: number = 0;
  public currentCard!: Flashcard;
  public options: FlashcardOption[] = []; // Opciones para la tarjeta actual
  public isLoading: boolean = true;
  public gameFinished: boolean = false;
  public feedbackMessage: string = '';
  public totalCorrect: number = 0;
  public totalQuestions: number = 0;

  constructor(
    private dataLoaderService: DataLoaderService, // El servicio renombrado
    private userProgressService: UserProgressService
  ) {}

  ngOnInit(): void {
    this.loadFlashcards();
  }

  // Paso 1: Carga las flashcards (requestFlashcards)
  
  private loadFlashcards(): void {
    this.isLoading = true;
    this.dataLoaderService.getFlashcards(this.exerciseId)
      .pipe(first()) // Nos aseguramos de desuscribir después del primer valor
      .subscribe({
        next: (data: FlashcardGameData) => {
          this.flashcards = data.cards;
          this.allAvailableOptions = data.allOptions;
          this.totalQuestions = this.flashcards.length;

          if (this.flashcards.length > 0) {
            this.currentCard = this.flashcards[this.currentCardIndex];
            this.generateOptions();
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading flashcards:', err);
          this.isLoading = false;
        }
      });
  }

  /**
   * Genera las opciones de respuesta para la tarjeta actual
   */
  private generateOptions(): void {
    const correctValue = this.currentCard.correctAnswer;
    
    // Filtra las incorrectas y toma 3 al azar
    const incorrectOptions = this.allAvailableOptions
      .filter(opt => opt !== correctValue)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3); 

    this.options = [
      { value: correctValue, isCorrect: true },
      ...incorrectOptions.map(val => ({ value: val, isCorrect: false }))
    ].sort(() => 0.5 - Math.random()); // Mezcla todas las opciones
  }

  /**
   * Paso 2: El alumno selecciona una respuesta (sendAnswer)
   * @param selectedOption El objeto de la opción seleccionada.
   */
  public selectAnswer(selectedOption: FlashcardOption): void {
    if (this.gameFinished || this.feedbackMessage) return; // Evita doble click

    const isCorrect = selectedOption.isCorrect;
    
    if (isCorrect) {
      this.totalCorrect++;
    }

    // Notificar al backend de la respusta y obtener feedback
    this.userProgressService.sendAnswer(
      this.exerciseId, 
      this.currentCard.id, 
      selectedOption.value, 
      isCorrect
    ).pipe(first()).subscribe({
      next: (response) => {
        // Muestra feedback (showFeedback)
        this.feedbackMessage = isCorrect ? '¡Correcto! 🎉' : 'Incorrecto. La respuesta era: ' + this.currentCard.correctAnswer;
        
        // Siguiente paso del ciclo
        setTimeout(() => {
          this.nextFlashcard(); 
        }, 2000); 
      },
      error: (err) => console.error('Error al enviar respuesta:', err)
    });
  }
  
  /**
   * Paso 3: Pasa a la siguiente tarjeta (loop / nextFlashcard())
   */
  private nextFlashcard(): void {
    this.feedbackMessage = ''; 
    this.currentCardIndex++;
    
    if (this.currentCardIndex < this.flashcards.length) {
      this.currentCard = this.flashcards[this.currentCardIndex];
      this.generateOptions();
    } else {
      this.finishGame();
    }
  }

  /**
   * Paso 4: Finalizar el juego (finishGame)
   */
  private finishGame(): void {
    this.gameFinished = true;

    this.userProgressService.finishGame(this.exerciseId, {
      totalCorrect: this.totalCorrect,
      totalQuestions: this.totalQuestions
    }).pipe(first()).subscribe({
      next: (summary) => {
        // Mostrar resumen final (showFinalSummary).
        this.feedbackMessage = `Juego Terminado. Tu grado es ${summary.grade.toFixed(0)}%.`;
      },
      error: (err) => console.error('Error al finalizar el juego:', err)
    });
  }
}