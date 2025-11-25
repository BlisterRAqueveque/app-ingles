

export interface FillInBlanksConfig {
    id: string;
    titulo?: string;
    instrucciones?: string;
    nivel: string; // Nivel educativo (B1, B2, ...)
    tema: string; // 'colors', 'family', 'numbers', etc.
    ejercicios: FillInBlanksEjercicio[];
    // ? Opciones que se pueden habilitar o no.
    reintentar?: boolean;
    tiempoLimite?: number;
}

export interface FillInBlanksEjercicio {
    id: string;
    texto: string; // Puede ser un texto u oraciones
    blanks: Blank[]; // Lista de espacios vacios
}

export interface Blank {
    id: string;
    posicion?: number; // Posición del blank en el texto
    respuestaCorrecta: string;
    opciones?: string[] | null; // Por si hay opciones para cada espacio
    respuestaUsuario?: RespuestaUsuario[] | null
}

export interface RespuestaUsuario {
    ejercicio: FillInBlanksEjercicio[];
    blankId: string;
    respuestas: string[];
    esCorrecto?: boolean;
    puntaje: number;
    duracion?: number; // Tiempo empleado
    // usuario: User[]
}

// Para textos largos
export interface SegmentoTexto {
    tipo: 'texto' | 'blank';
    contenido?: string; // El texto
    blank?: Blank; // Referencia al blank
    respuestaUsuario?: RespuestaUsuario[] | null; // Lo que el usuario escribe en el blank
}