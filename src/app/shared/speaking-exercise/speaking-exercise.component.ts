import { Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-speaking-exercise',
  templateUrl: './speaking-exercise.component.html',
  styleUrls: ['./speaking-exercise.component.scss'],
})
export class SpeakingExerciseComponent implements OnInit {
  /* Propiedad para manejar barra de grabación */
  public progress = 0;

  constructor() {
    /* Barra de grabación */
    setInterval(() => {
      this.progress += 0.01;

      // Al llegar al 100% la barra vuelve al inicio
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);
  }

  ngOnInit() { }

  /* !test */
  speak() {
    console.log("test");
  }
}
