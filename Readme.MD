# 📱 Aplicación Móvil Educativa – Material Didáctico en Inglés

Esta aplicación permite crear, gestionar y realizar **actividades interactivas** para la enseñanza del inglés en nivel inicial y primario.
Los materiales se generan a partir de **plantillas configurables**, que pueden adaptarse a distintos temas (Colores, Presentación Personal, Familia, Números, Deportes, Lugares, etc.).

---

## 🧮 Cantidad de Ejercicios Configurables

La aplicación contempla actualmente **18 ejercicios didácticos**, agrupados en **9 tipos base reutilizables**.
Cada tipo corresponde a un **componente Angular** configurable desde datos externos (JSON, base de datos, etc.).

| Nº | Tipo de Ejercicio Base | Ejemplos de Uso | Habilidades |
|----|--------------------------|-----------------|--------------|
| 1 | **Match / Emparejar** | Color Word Match, Read and Match, Memory Game | Reading |
| 2 | **Sequencing / Ordenar** | Color Story Sequencing | Reading |
| 3 | **Labeling / Etiquetar** | Color Labeling | Reading |
| 4 | **Listening + Response** | Color Song, Color Commands, Listening to Introductions | Listening |
| 5 | **Speaking / Oral Practice** | Describe and Guess, Interview | Speaking |
| 6 | **Bingo / Juego Interactivo** | Color Bingo | Speaking |
| 7 | **Word Puzzle / Crossword** | Word Puzzle, Crossword | Writing |
| 8 | **Fill in the Blanks / Completar** | Color Sentences, Fill in the Blanks | Writing |
| 9 | **Draw and Write / Libre** | Draw and Write | Writing |

➡️ **Total de ejercicios configurables:** 18
➡️ **Componentes principales reutilizables:** 9

---

## 🧩 Estructura de Componentes

src/app/
│
├── components/
│   ├── match-exercise/
│   ├── sequence-exercise/
│   ├── labeling-exercise/
│   ├── listening-exercise/
│   ├── speaking-exercise/
│   ├── bingo/
│   ├── word-game/
│   ├── fill-in-the-blanks/
│   └── draw-write/
│
├── pages/
│   ├── colors/
│   └── personal-presentation/
│
├── services/
│   ├── audio.service.ts         ← para reproducir audios
│   ├── data-loader.service.ts   ← para cargar materiales desde BD o JSON
│   ├── user-progress.service.ts ← guardar resultados
│
└── models/
    ├── exercise.model.ts
    ├── question.model.ts
    └── user.model.ts


---

## 🧱 Arquitectura Recomendada

- **Framework:** Angular
- **Lenguaje:** TypeScript
- **Diseño:** Componentes reutilizables y dinámicos
- **Datos:** Configurables mediante JSON o base de datos
- **Escalabilidad:** Permite agregar nuevos temas reutilizando los mismos componentes
- **Responsividad:** Interfaz adaptada a dispositivos móviles

---

## 🚀 Ejemplos de Temas Actuales

### 🎨 Tema: *Colors*
- Color Word Match
- Color Story Sequencing
- Color Labeling
- Color Song
- Color Commands
- Describe and Guess
- Color Bingo
- Word Puzzle / Crossword
- Color Sentences

### 🙋 Tema: *Personal Presentation*
- Read and Match
- Simple Introduction Texts
- Memory Game
- Listening to Introductions
- Follow the Instructions
- Interview
- Fill in the Blanks
- Draw and Write

---

## 📊 Resumen General

| Categoría | Ejercicios | Componentes Usados |
|------------|-------------|--------------------|
| Reading | 6 | Match, Sequencing, Labeling |
| Listening | 4 | Listening + Response |
| Speaking | 3 | Speaking, Bingo |
| Writing | 5 | Word Game, Fill-in, Draw & Write |
| **TOTAL** | **18 ejercicios** | **9 componentes reutilizables** |

---

## ⚙️ Próximas Extensiones
- Agregar nuevos temas: *La familia*, *Los números*, *Lugares*, *Deportes*, etc.
- Incorporar sistema de niveles o progreso.
- Integración con autenticación y almacenamiento en la nube.
- Modo “creador de materiales” para docentes.

---

📘 *Desarrollado con Angular para promover el aprendizaje interactivo del idioma inglés.*
