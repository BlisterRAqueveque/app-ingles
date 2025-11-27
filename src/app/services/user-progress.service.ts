import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProgressService {

  constructor() { }

  /**
   * Simula el envío de una respuesta al Backend para validación y progreso.
   * Corresponde a (sendAnswer(option) -> validateAnswer/updateProgress)
   */
  sendAnswer(
    exerciseId: string, 
    cardId: string, 
    selectedOption: string, 
    isCorrect: boolean
  ): Observable<{ score: number, correctCount: number }> {
    // En un entorno real, aquí harías un POST a /api/answer
    console.log(`[Backend Log] Respuesta para Tarjeta ${cardId} - Correcta: ${isCorrect}`);
    
    // Simula la respuesta del backend con el progreso
    return of({ score: isCorrect ? 1 : 0, correctCount: isCorrect ? 1 : 0 }).pipe(
      delay(200) 
    );
  }

  /**
   * Simula la notificación de fin del juego y actualización de resultados finales.
   * Corresponde a (finishGame(in POST game/finish) -> updateFinalStats)
   */
  finishGame(exerciseId: string, stats: { totalCorrect: number, totalQuestions: number }): Observable<any> {
    // En un entorno real, aquí harías un POST a /api/game/finish
    console.log(`[Backend Log] Juego Terminado: ${stats.totalCorrect}/${stats.totalQuestions} aciertos.`);

    // Devuelve un resumen de desempeño
    return of({ 
      message: 'Resultados guardados', 
      grade: (stats.totalCorrect / stats.totalQuestions) * 100 
    }).pipe(
      delay(300)
    );
  }
}