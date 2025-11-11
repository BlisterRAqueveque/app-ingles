import { FillInBlanksConfig, SegmentoTexto } from '@/app/models/fill-in-the-blanks';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-fill-in-the-blanks',
  templateUrl: './fill-in-the-blanks.component.html',
  styleUrls: ['./fill-in-the-blanks.component.scss'],
})
export class FillInTheBlanksComponent implements OnInit {
  @Input() config!: FillInBlanksConfig;
  segmentosPorEjercicio: SegmentoTexto[][] = [];

  ngOnInit(): void {
    // Dividimos el texto en segmentos (si es un texto muy largo)
    this.segmentosPorEjercicio = this.config.ejercicios.map(ej => {
      const partes = ej.texto.split('___');
      const segmentos: SegmentoTexto[] = [];

      partes.forEach((parte, i) => {
        segmentos.push({ tipo: 'texto', contenido: parte });
        if (i < ej.blanks.length) {
          segmentos.push({ tipo: 'blank', blank: ej.blanks[i] });
        }
      });

      return segmentos;
    });
  }

}
