import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

interface Respuesta {
  id: number;
  texto: string;
  preguntaId: number;
}

interface Pregunta {
  id: number;
  enunciado: string;
  respuestaCorrectaId: number;
  respuestaAsignada: Respuesta | null;
  estado: 'pending' | 'correct' | 'incorrect';
}

@Component({
  selector: 'app-crossword',
  standalone: false,
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.scss'],
})
export class CrosswordComponent implements OnInit {

  // 🚫 NO guardamos preguntas/respuestas localmente
  // Solo usamos señales para renderizar lo que viene del backend

  rolUsuario: 'profesor' | 'alumno' = 'profesor'; // Viene del backend tras login

  // Estas señales se llenan desde el backend
  preguntas = signal<Pregunta[]>([]);
  respuestasDisponibles = signal<Respuesta[]>([]);

  // IDs de drop lists conectadas
  dropListIds = computed(() => [
    'lista-respuestas',
    ...this.preguntas().map((_, i) => `destino-pregunta-${i}`)
  ]);

  // Estado del juego
  crucigramaCompletado = computed(() => {
    const preguntas = this.preguntas();
    return preguntas.length > 0 && preguntas.every(p => p.respuestaAsignada !== null);
  });

  constructor() {
    // Verifica el crucigrama cuando cambian las preguntas (solo si es alumno)
    effect(() => {
      if (this.rolUsuario === 'alumno') {
        this.verificarCrucigrama();
      }
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    // Si es alumno, carga el crucigrama desde el backend
    if (this.rolUsuario === 'alumno') {
      this.cargarCrucigramaDesdeBackend();
    }
  }

  // --- VISTA PROFESOR ---
  // Solo envía datos al backend. No guarda localmente.
  guardarCrucigrama(pares: { enunciado: string; respuestaCorrecta: string }[]) {
    // ✅ ENVÍA AL BACKEND
    // this.crucigramaService.guardar(pares).subscribe({
    //   next: () => alert('Crucigrama guardado'),
    //   error: () => alert('Error al guardar')
    // });
    console.log('ENVIANDO AL BACKEND:', pares);
    alert('Datos enviados al backend. Ahora puedes probar como alumno.');
  }

  // --- VISTA ALUMNO ---
  cargarCrucigramaDesdeBackend() {
    // ✅ RECIBE DESDE EL BACKEND
    // this.crucigramaService.obtener().subscribe(data => {
    //   this.preguntas.set(data.preguntas);
    //   this.respuestasDisponibles.set(this.shuffleArray(data.respuestas));
    // });

    // Simulación para pruebas (solo hasta que el backend esté listo)
    const mockData = {
      preguntas: [
        { id: 1, enunciado: 'I like ____ on the beach.', respuestaCorrectaId: 101, respuestaAsignada: null, estado: 'pending' },
        { id: 2, enunciado: 'She enjoys ____ fantasy books.', respuestaCorrectaId: 102, respuestaAsignada: null, estado: 'pending' },
        { id: 3, enunciado: 'We are ____ for the exam.', respuestaCorrectaId: 103, respuestaAsignada: null, estado: 'pending' },
        { id: 4, enunciado: 'The dog is ____ his dinner.', respuestaCorrectaId: 104, respuestaAsignada: null, estado: 'pending' },
        { id: 5, enunciado: 'He stopped ____ water after the race.', respuestaCorrectaId: 105, respuestaAsignada: null, estado: 'pending' },
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

  // Maneja el drop
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

  verificarCrucigrama() {
    this.preguntas.update(preguntas =>
      preguntas.map(p => {
        if (!p.respuestaAsignada) return { ...p, estado: 'pending' };
        const isCorrect = p.respuestaAsignada.preguntaId === p.id;
        return { ...p, estado: isCorrect ? 'correct' : 'incorrect' };
      })
    );
  }

  shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  // Enviar respuestas del alumno al backend
  enviarRespuestasAlBackend() {
    if (!this.crucigramaCompletado()) {
      alert('¡Completa todas las preguntas antes de enviar!');
      return;
    }

    const respuestasEnviadas = this.preguntas().map(p => ({
      preguntaId: p.id,
      respuestaId: p.respuestaAsignada?.id
    }));

    // ✅ ENVÍA AL BACKEND
    // this.crucigramaService.enviarRespuestas(respuestasEnviadas).subscribe({
    //   next: (resultado) => {
    //     this.preguntas.set(resultado.preguntas); // El backend devuelve el estado corregido
    //   },
    //   error: () => alert('Error al enviar')
    // });

    console.log('ENVIANDO RESPUESTAS AL BACKEND:', respuestasEnviadas);
    alert('Respuestas enviadas al backend. Esperando resultado...');
  }
}


// ------------------ACTIVIDAD UNIR CON FLECHAS version vieja con coordenadas

// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// // --------------------------------------------------------
// // SIMULACIÓN DE ALMACENAMIENTO GLOBAL (HACIENDO DE BACKEND)
// // Se mantiene entre instancias del componente.
// // --------------------------------------------------------
// let actividadAlmacenada: { itemA: string; itemB: string }[] = [];

// // Interfaces
// interface Elemento {
//   id: number;
//   texto: string;
// }

// interface Conexiones {
//   idA: number;
//   idB: number;
//   esCorrecta?: boolean;
// }

// interface Coordenada {
//   x: number;
//   y: number;
// }


// @Component({
//   selector: 'app-crossword',
//   templateUrl: './crossword.component.html',
//   styleUrls: ['./crossword.component.scss'],
//   standalone: false,
// })
// export class CrosswordComponent implements OnInit {

//   // --- VARIABLES DE ESTADO ---

//   // para alternar entre las vistas de profesor y alumno
//   rolUsuario: 'profesor' | 'alumno' = 'profesor';
//   esAlumno: boolean = this.rolUsuario === 'alumno';

//   // Data del juego (Alumno)
//   elementosColumnaA: Elemento[] = [];
//   elementosColumnaB: Elemento[] = [];

//   // Lógica de conexión (Alumno)
//   puntoSeleccionadoId: number | null = null;
//   conexionesAlumno: Conexiones[] = [];

//   // Almacena las coordenadas para dibujar las flechas
//   coordenadasPuntos: { [id: number]: Coordenada } = {};

//   // Variables para resultados (Alumno)
//   juegoFinalizado: boolean = false;

//   // Data de Edición (Profesor)
//   paresEdicion: { itemA: string; itemB: string }[] = [{ itemA: '', itemB: '' }];

//   // Referencia a la actividad guardada globalmente (simulación de carga de la BD)
//   actividadGuardada: { itemA: string; itemB: string }[] = actividadAlmacenada;

//   // Mapa de respuestas correctas (simulación de la lógica del Backend)
//   private respuestasCorrectas: Map<number, number> = new Map();

//   constructor(private cdr: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     // Si es alumno, cargamos el juego con la data disponible
//     if (this.esAlumno) {
//       this.cargarJuego();
//     } else {
//         // Si es profesor, cargamos los datos guardados para posible edición
//         if (this.actividadGuardada.length > 0) {
//             // Convertimos la actividad guardada a paresEdicion para que el profesor la vea
//             this.paresEdicion = [...this.actividadGuardada];
//         }
//     }
//   }

//   // --- LÓGICA DEL PROFESOR (CREACIÓN) ---

//   agregarPar(): void {
//     this.paresEdicion.push({ itemA: '', itemB: '' });
//   }

//   // SIMULACIÓN DE POST AL BACKEND
//   guardarActividad(): void {
//     const paresValidos = this.paresEdicion.filter(p => p.itemA.trim() && p.itemB.trim());

//     if (paresValidos.length === 0) {
//       alert('Debe ingresar al menos un par válido.');
//       return;
//     }

//     //  PASO CLAVE: Guardar en la variable global
//     actividadAlmacenada = paresValidos;
//     this.actividadGuardada = actividadAlmacenada;

//     alert(' Actividad guardada con éxito.');
//   }

//   // --- LÓGICA DE CARGA Y CÁLCULO (ALUMNO) ---

//   // SIMULACIÓN DE GET DEL BACKEND
//   cargarJuego(): void {
//     // 1. Obtener la fuente de datos
//     const source = actividadAlmacenada.length > 0 ? actividadAlmacenada : [
//         // // Pares por defecto (si el profesor aún no ha guardado)
//         // { itemA: 'Hola', itemB: 'Hello' },
//         // { itemA: 'Yellow', itemB: 'Amarillo' },
//     ];

//     // 2. Mapear y mezclar los datos
//     this.elementosColumnaA = source.map((p, index) => ({ id: 100 + index, texto: p.itemA }));

//     // Generar la columna B desordenada
//     const textosBMezclados = source.map(p => p.itemB).sort(() => Math.random() - 0.5);
//     this.elementosColumnaB = textosBMezclados.map((texto, index) => ({ id: 200 + index, texto: texto }));

//     // 3. Crear el mapa de respuestas correctas (SOLUCIÓN)
//     this.respuestasCorrectas.clear();
//     source.forEach(parOriginal => {
//         const idA = this.elementosColumnaA.find(e => e.texto === parOriginal.itemA)?.id;
//         const idB = this.elementosColumnaB.find(e => e.texto === parOriginal.itemB)?.id;
//         if (idA && idB) {
//             this.respuestasCorrectas.set(idA, idB);
//         }
//     });

//     // 4. Reiniciar estado y calcular coordenadas
//     this.conexionesAlumno = [];
//     this.juegoFinalizado = false;
//     this.puntoSeleccionadoId = null;

//     setTimeout(() => {
//       this.calcularCoordenadasPuntos();
//     }, 50);
//   }

//   calcularCoordenadasPuntos(): void {
//     const todosLosElementos = [...this.elementosColumnaA, ...this.elementosColumnaB];
//     this.coordenadasPuntos = {};

//     todosLosElementos.forEach(elemento => {
//       const htmlElement = document.getElementById(`punto-${elemento.id}`);

//       if (htmlElement) {
//         const rect = htmlElement.getBoundingClientRect();
//         this.coordenadasPuntos[elemento.id] = {
//           x: rect.left + rect.width, // Ajuste para el borde derecho (Columna A) o izquierdo (Columna B)
//           y: rect.top + rect.height / 2
//         };
//       }
//     });
//     this.cdr.detectChanges();
//   }

//   // --- LÓGICA DE INTERACCIÓN Y VALIDACIÓN ---

//   manejarClickPunto(idElemento: number, columna: 'A' | 'B'): void {
//     if (this.juegoFinalizado) return;

//     if (this.puntoSeleccionadoId === null) {
//       if (columna === 'A') {
//         this.puntoSeleccionadoId = idElemento;
//       }
//     } else {
//       if (columna === 'B') {
//         const idA = this.puntoSeleccionadoId;
//         const idB = idElemento;

//         // Evita reconectar un punto A
//         if (!this.conexionesAlumno.find(c => c.idA === idA)) {
//             this.conexionesAlumno.push({ idA: idA, idB: idB });
//         }
//         this.puntoSeleccionadoId = null;
//       } else if (columna === 'A') {
//          // Permite cambiar el punto A seleccionado
//          this.puntoSeleccionadoId = idElemento;
//       }
//     }
//   }

//   // SIMULACIÓN DE POST Y RESPUESTA DEL BACKEND
//   enviarRespuestas(): void {
//     if (this.conexionesAlumno.length !== this.elementosColumnaA.length) {
//       alert('¡Faltan conexiones por hacer!');
//       return;
//     }

//     // SIMULACIÓN DE LA VALIDACIÓN DEL BACKEND
//     const resultados = this.conexionesAlumno.map(conexion => {
//         // Comprobar si la conexión hecha por el alumno es la respuesta correcta.
//         const correcta = this.respuestasCorrectas.get(conexion.idA) === conexion.idB;
//         return { ...conexion, esCorrecta: correcta };
//     });

//     this.conexionesAlumno = resultados;
//     this.juegoFinalizado = true;
//     this.cdr.detectChanges();
//   }

//   // Función para dibujar flechas
//   getCoordenadasFlecha(conexion: Conexiones): any {
//     const pA = this.coordenadasPuntos[conexion.idA];
//     const pB = this.coordenadasPuntos[conexion.idB];

//     if (pA && pB) {
//       return { x1: pA.x, y1: pA.y, x2: pB.x, y2: pB.y };
//     }
//     return null;
//   }
// }
