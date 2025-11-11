import { FillInBlanksConfig } from '@/app/models/fill-in-the-blanks';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-completar-texto',
  templateUrl: './completar-texto.component.html',
  styleUrls: ['./completar-texto.component.scss'],
  standalone: false
})
export class CompletarTextoComponent implements OnInit {

  ngOnInit() { }

  configPrueba: FillInBlanksConfig = {
    id: 'cfg1',
    titulo: 'Colores en inglés',
    instrucciones: 'Completa los espacios con la palabra correcta.',
    nivel: 'A2',
    tema: 'colors',
    ejercicios: [
      {
        id: 'e1',
        texto: 'The sky is ___ and the apple is ___.',
        blanks: [
          { id: 'b1', respuestaCorrecta: 'blue' },
          { id: 'b2', respuestaCorrecta: 'red' }
        ]
      },
      {
        id: 'e2',
        texto: 'Choose the right color: The sun is ___',
        blanks: [
          {
            id: 'b3',
            respuestaCorrecta: 'yellow',
            opciones: ['green', 'yellow', 'blue']
          }
        ]
      }
    ]
  };

}
