export interface Flashcard {
  id: string; // ID único de la tarjeta
  word: string; // La palabra o frase a mostrar (ej: 'Cat', 'Blue')
  image?: string; // Ruta de la imagen (opcional)
  audio?: string; // Ruta del archivo de audio (opcional)
  correctAnswer: string; // La respuesta correcta para validar (ej: 'Gato')
}

export interface FlashcardOption {
  value: string; // El texto de la opción (ej: 'Perro', 'Gato')
  isCorrect: boolean; // Usado solo en el frontend para feedback
}

export interface FlashcardGameData {
    cards: Flashcard[];
    allOptions: string[]; // Lista de todas las posibles opciones de respuesta
}