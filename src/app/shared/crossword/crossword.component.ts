import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// --------------------------------------------------------
// SIMULACIÓN DE ALMACENAMIENTO GLOBAL (HACIENDO DE BACKEND)
// Se mantiene entre instancias del componente.
// --------------------------------------------------------
let actividadAlmacenada: { itemA: string; itemB: string }[] = [];

// Interfaces
interface Elemento {
  id: number;
  texto: string;
}

interface Conexiones {
  idA: number;
  idB: number;
  esCorrecta?: boolean;
}

interface Coordenada {
  x: number;
  y: number;
}


@Component({
  selector: 'app-crossword',
  templateUrl: './crossword.component.html',
  styleUrls: ['./crossword.component.scss'],
  standalone: false,
})
export class CrosswordComponent implements OnInit {

  // --- VARIABLES DE ESTADO ---

  // para alternar entre las vistas de profesor y alumno
  rolUsuario: 'profesor' | 'alumno' = 'profesor';
  esAlumno: boolean = this.rolUsuario === 'alumno';

  // Data del juego (Alumno)
  elementosColumnaA: Elemento[] = [];
  elementosColumnaB: Elemento[] = [];

  // Lógica de conexión (Alumno)
  puntoSeleccionadoId: number | null = null;
  conexionesAlumno: Conexiones[] = [];

  // Almacena las coordenadas para dibujar las flechas
  coordenadasPuntos: { [id: number]: Coordenada } = {};

  // Variables para resultados (Alumno)
  juegoFinalizado: boolean = false;

  // Data de Edición (Profesor)
  paresEdicion: { itemA: string; itemB: string }[] = [{ itemA: '', itemB: '' }];

  // Referencia a la actividad guardada globalmente (simulación de carga de la BD)
  actividadGuardada: { itemA: string; itemB: string }[] = actividadAlmacenada;

  // Mapa de respuestas correctas (simulación de la lógica del Backend)
  private respuestasCorrectas: Map<number, number> = new Map();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Si es alumno, cargamos el juego con la data disponible
    if (this.esAlumno) {
      this.cargarJuego();
    } else {
        // Si es profesor, cargamos los datos guardados para posible edición
        if (this.actividadGuardada.length > 0) {
            // Convertimos la actividad guardada a paresEdicion para que el profesor la vea
            this.paresEdicion = [...this.actividadGuardada];
        }
    }
  }

  // --- LÓGICA DEL PROFESOR (CREACIÓN) ---

  agregarPar(): void {
    this.paresEdicion.push({ itemA: '', itemB: '' });
  }

  // SIMULACIÓN DE POST AL BACKEND
  guardarActividad(): void {
    const paresValidos = this.paresEdicion.filter(p => p.itemA.trim() && p.itemB.trim());

    if (paresValidos.length === 0) {
      alert('Debe ingresar al menos un par válido.');
      return;
    }

    //  PASO CLAVE: Guardar en la variable global
    actividadAlmacenada = paresValidos;
    this.actividadGuardada = actividadAlmacenada;

    alert(' Actividad guardada con éxito.');
  }

  // --- LÓGICA DE CARGA Y CÁLCULO (ALUMNO) ---

  // SIMULACIÓN DE GET DEL BACKEND
  cargarJuego(): void {
    // 1. Obtener la fuente de datos
    const source = actividadAlmacenada.length > 0 ? actividadAlmacenada : [
        // // Pares por defecto (si el profesor aún no ha guardado)
        // { itemA: 'Hola', itemB: 'Hello' },
        // { itemA: 'Yellow', itemB: 'Amarillo' },
    ];

    // 2. Mapear y mezclar los datos
    this.elementosColumnaA = source.map((p, index) => ({ id: 100 + index, texto: p.itemA }));

    // Generar la columna B desordenada
    const textosBMezclados = source.map(p => p.itemB).sort(() => Math.random() - 0.5);
    this.elementosColumnaB = textosBMezclados.map((texto, index) => ({ id: 200 + index, texto: texto }));

    // 3. Crear el mapa de respuestas correctas (SOLUCIÓN)
    this.respuestasCorrectas.clear();
    source.forEach(parOriginal => {
        const idA = this.elementosColumnaA.find(e => e.texto === parOriginal.itemA)?.id;
        const idB = this.elementosColumnaB.find(e => e.texto === parOriginal.itemB)?.id;
        if (idA && idB) {
            this.respuestasCorrectas.set(idA, idB);
        }
    });

    // 4. Reiniciar estado y calcular coordenadas
    this.conexionesAlumno = [];
    this.juegoFinalizado = false;
    this.puntoSeleccionadoId = null;

    setTimeout(() => {
      this.calcularCoordenadasPuntos();
    }, 50);
  }

  calcularCoordenadasPuntos(): void {
    const todosLosElementos = [...this.elementosColumnaA, ...this.elementosColumnaB];
    this.coordenadasPuntos = {};

    todosLosElementos.forEach(elemento => {
      const htmlElement = document.getElementById(`punto-${elemento.id}`);

      if (htmlElement) {
        const rect = htmlElement.getBoundingClientRect();
        this.coordenadasPuntos[elemento.id] = {
          x: rect.left + rect.width, // Ajuste para el borde derecho (Columna A) o izquierdo (Columna B)
          y: rect.top + rect.height / 2
        };
      }
    });
    this.cdr.detectChanges();
  }

  // --- LÓGICA DE INTERACCIÓN Y VALIDACIÓN ---

  manejarClickPunto(idElemento: number, columna: 'A' | 'B'): void {
    if (this.juegoFinalizado) return;

    if (this.puntoSeleccionadoId === null) {
      if (columna === 'A') {
        this.puntoSeleccionadoId = idElemento;
      }
    } else {
      if (columna === 'B') {
        const idA = this.puntoSeleccionadoId;
        const idB = idElemento;

        // Evita reconectar un punto A
        if (!this.conexionesAlumno.find(c => c.idA === idA)) {
            this.conexionesAlumno.push({ idA: idA, idB: idB });
        }
        this.puntoSeleccionadoId = null;
      } else if (columna === 'A') {
         // Permite cambiar el punto A seleccionado
         this.puntoSeleccionadoId = idElemento;
      }
    }
  }

  // SIMULACIÓN DE POST Y RESPUESTA DEL BACKEND
  enviarRespuestas(): void {
    if (this.conexionesAlumno.length !== this.elementosColumnaA.length) {
      alert('¡Faltan conexiones por hacer!');
      return;
    }

    // SIMULACIÓN DE LA VALIDACIÓN DEL BACKEND
    const resultados = this.conexionesAlumno.map(conexion => {
        // Comprobar si la conexión hecha por el alumno es la respuesta correcta.
        const correcta = this.respuestasCorrectas.get(conexion.idA) === conexion.idB;
        return { ...conexion, esCorrecta: correcta };
    });

    this.conexionesAlumno = resultados;
    this.juegoFinalizado = true;
    this.cdr.detectChanges();
  }

  // Función para dibujar flechas
  getCoordenadasFlecha(conexion: Conexiones): any {
    const pA = this.coordenadasPuntos[conexion.idA];
    const pB = this.coordenadasPuntos[conexion.idB];

    if (pA && pB) {
      return { x1: pA.x, y1: pA.y, x2: pB.x, y2: pB.y };
    }
    return null;
  }
}
