import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';// para la funcionalidad de arrastrar y soltar
import { ToastController } from '@ionic/angular'; // Import necesario para mostrar mensajes toast

// Interfaces

// Interfaz para las respuestas en la vista del alumno
interface Respuesta {
  id: number;
  texto: string;
  preguntaId: number;
}
// Interfaz para las preguntas en la vista del alumno
interface Pregunta {
  id: number;
  enunciado: string;
  respuestaCorrectaId: number;
  respuestaAsignada: Respuesta | null;
  estado: 'pending' | 'correct' | 'incorrect';
}
// Interfaz para la edición de pares en la vista del profesor
interface ParEdicion {
  id: number;
  enunciado: string;
  respuestaCorrecta: string;
}

@Component({
  selector: 'app-crossword',
  standalone: false,
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.scss'],
})
export class CrosswordComponent implements OnInit {

  rolUsuario: 'profesor' | 'alumno' = 'alumno'; // Cambiar segun la vistaque se quiere ver (para pruebas)

  // Vista profesor
  paresEdicion = signal<ParEdicion[]>([{ id: 1, enunciado: '', respuestaCorrecta: '' }]);
  private nextId = 2;

  // Vista alumno
  preguntas = signal<Pregunta[]>([]);
  respuestasDisponibles = signal<Respuesta[]>([]);

  // Computed properties
  esAlumno = computed(() => this.rolUsuario === 'alumno');

  // Genera dinámicamente los IDs de zonas de arrastre para que el sistema drag & drop
  //  funcione correctamente al agregar o eliminar preguntas en tiempo real.

  dropListIds = computed(() => [
    'lista-respuestas',
    ...this.preguntas().map((_, i) => `destino-pregunta-${i}`)
  ]);

  //  para verificar si el ejercicio está completo
  ejercicioCompletado = computed(() => {
    const preguntas = this.preguntas();
    return preguntas.length > 0 && preguntas.every(p => p.respuestaAsignada !== null);
  });

  constructor(private toastController: ToastController) { // Inyección de ToastController
    effect(() => {
      if (this.rolUsuario === 'alumno') {
        this.verificarEjercicio();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    if (this.rolUsuario === 'alumno') {
      this.cargarEjercicioDesdeBackend();
    }
  }

  // --- MÉTODOS VISTA PROFESOR ---
  agregarPar(): void {
    this.paresEdicion.update(pares => [...pares, { id: this.nextId++, enunciado: '', respuestaCorrecta: '' }]);
  }

  eliminarPar(index: number): void {
    this.paresEdicion.update(pares => {
      const nuevos = [...pares];
      nuevos.splice(index, 1);
      return nuevos;
    });
  }

  async guardarEjercicio(pares: ParEdicion[]): Promise<void> {
    const paresValidos = pares.filter(p => p.enunciado.trim() && p.respuestaCorrecta.trim());

    if (paresValidos.length === 0) {
// Toast de advertencia
      const toast = await this.toastController.create({
        message: 'Debe ingresar al menos un par válido.',
        duration: 3000,
        position: 'top',
        color: 'warning',
        icon: 'alert-circle'
      });
      await toast.present();
      return;
    }

    console.log('ENVIANDO AL BACKEND:', paresValidos);
// Toast de confirmación
    const toast = await this.toastController.create({
      message: ' Guardando actividad.',
      duration: 4000,
      position: 'bottom',
      color: 'success',
       icon: 'checkmark-outline',
    });

    await toast.present();
  }

  // --- MÉTODOS VISTA ALUMNO ---
  // Simulación de carga desde backend
  cargarEjercicioDesdeBackend() {
    const mockData = {
      preguntas: [
        { id: 1, enunciado: 'I like ____ on the beach.', respuestaCorrectaId: 101, respuestaAsignada: null, estado: 'pending' as const },
        { id: 2, enunciado: 'She enjoys ____ fantasy books.', respuestaCorrectaId: 102, respuestaAsignada: null, estado: 'pending' as const },
        { id: 3, enunciado: 'We are ____ for the exam.', respuestaCorrectaId: 103, respuestaAsignada: null, estado: 'pending' as const },
        { id: 4, enunciado: 'The dog is ____ his dinner.', respuestaCorrectaId: 104, respuestaAsignada: null, estado: 'pending' as const },
        { id: 5, enunciado: 'He stopped ____ water after the race.', respuestaCorrectaId: 105, respuestaAsignada: null, estado: 'pending' as const },
      ],
      respuestas: [
        { id: 101, texto: 'RUNNING', preguntaId: 1 },
        { id: 102, texto: 'READING', preguntaId: 2 },
        { id: 103, texto: 'STUDYING', preguntaId: 3 },
        { id: 104, texto: 'EATING', preguntaId: 4 },
        { id: 105, texto: 'DRINKING', preguntaId: 5 },
      ]
    };

    this.preguntas.set(mockData.preguntas);
    this.respuestasDisponibles.set(this.shuffleArray(mockData.respuestas));
  }

// Manejo de arrastrar y soltar
  soltarRespuesta(event: CdkDragDrop<any>) {
    const respuestaArrastrada = event.item.data as Respuesta;

    if (event.previousContainer === event.container) return;

    if (event.container.id.startsWith('destino-pregunta-')) {
      const targetPregunta = event.container.data as Pregunta;

      if (targetPregunta.respuestaAsignada) {
        this.devolverRespuesta(targetPregunta.respuestaAsignada);
      }

      if (event.previousContainer.id === 'lista-respuestas') {
        this.respuestasDisponibles.update(r => r.filter(x => x.id !== respuestaArrastrada.id));
      } else {
        const sourcePregunta = event.previousContainer.data as Pregunta;
        this.preguntas.update(p => p.map(x => x.id === sourcePregunta.id ? { ...x, respuestaAsignada: null } : x));
      }

      this.preguntas.update(p => p.map(x => x.id === targetPregunta.id ? { ...x, respuestaAsignada: respuestaArrastrada } : x));

    } else if (event.container.id === 'lista-respuestas') {
      if (event.previousContainer.id.startsWith('destino-pregunta-')) {
        const sourcePregunta = event.previousContainer.data as Pregunta;
        this.preguntas.update(p => p.map(x => x.id === sourcePregunta.id ? { ...x, respuestaAsignada: null } : x));
        this.respuestasDisponibles.update(r => [...r, respuestaArrastrada]);
      }
    }
  }

  devolverRespuesta(respuesta: Respuesta) {
    if (!this.respuestasDisponibles().some(r => r.id === respuesta.id)) {
      this.respuestasDisponibles.update(r => [...r, respuesta]);
    }
  }

  verificarEjercicio() {
    this.preguntas.update(preguntas =>
      preguntas.map(p => {
        if (!p.respuestaAsignada) return { ...p, estado: 'pending' };
        const isCorrect = p.respuestaAsignada.preguntaId === p.id;
        return { ...p, estado: isCorrect ? 'correct' : 'incorrect' };
      })
    );
  }
//  para mezclar un array de forma aleatoria
  shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  //
  async enviarRespuestasAlBackend(): Promise<void> {
    if (!this.ejercicioCompletado()) {
// Toast de advertencia
      const toast = await this.toastController.create({
        message: '¡Completa todas las preguntas antes de enviar!',
        duration: 2000,
        position: 'top',
        color: 'warning',
        icon: 'alert-circle'
      });
      await toast.present();
      return;
    }

    const respuestasEnviadas = this.preguntas().map(p => ({
      preguntaId: p.id,
      respuestaId: p.respuestaAsignada?.id
    }));

    console.log('ENVIANDO RESPUESTAS AL BACKEND:', respuestasEnviadas);

    // Toast de confirmación
    const toast = await this.toastController.create({
      message: ' ¡Respuestas enviadas al backend! Esperando resultados...',
      duration: 4000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-outline',

    });

    await toast.present();
  }
}
