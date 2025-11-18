import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FlashcardGameData } from '../models/flashcard.model';

@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {

  // Datos simulados para el ejercicio de Presentación Personal
  private mockFlashcardData: FlashcardGameData = {
    cards: [
      { id: '1', word: 'Hello', correctAnswer: 'Hola' },
      { id: '2', word: 'My name is...', correctAnswer: 'Mi nombre es...' },
      { id: '3', word: 'How are you?', correctAnswer: '¿Cómo estás?' },
      { id: '4', word: 'Nice to meet you', correctAnswer: 'Encantado de conocerte' },
    ],
    allOptions: [
      'Hola', 
      'Adiós', 
      'Mi nombre es...', 
      'Tu nombre es...', 
      '¿Qué hora es?', 
      '¿Cómo estás?', 
      'Encantado de conocerte',
      'Te veo luego'
    ]
  };

  constructor() { }

  /** * Simula la carga de datos del ejercicio desde el Backend.
   * Corresponde a (requestFlashcards(in GET Flashcards))
   */
  getFlashcards(exerciseId: string): Observable<FlashcardGameData> {
    // Aca s usar 'exerciseId' para cargar datos específicos
    // Para el ejemplo, devolvemos siempre los datos simulados.
    return of(this.mockFlashcardData).pipe(
      delay(500) // Simula un pequeño retraso de red
    );
  }
}