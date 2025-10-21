import { Injectable } from '@angular/core';
declare const webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  error = true;

  recognition = new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;
  text = '';
  tempWords: any;

  constructor() {}

  init(): void {
    this.recognition.interimResults = true;
    this.recognition.lang = 'es-ES';

    this.recognition.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      this.tempWords = transcript;
    });
  }

  start(): void {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    this.recognition.addEventListener('end', () => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  /**
   *
   * @param html HTML Element for speech animation
   * @param className Class name that needs to be added for the animation
   * @param time Time animation
   * @description This function simplify to the user the needed for a animation frame when the sound is received
   */
  recognize(html: HTMLElement, className: string, time: number) {
    this.recognition.addEventListener('result', (e: any) => {
      html.classList.add(className);
      setTimeout(() => {
        html.classList.remove(className);
      }, time);
    });
  }
  stop(): void {
    this.text = '';
    this.recognition.stop();
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
  }

  wordConcat(): void {
    this.text = this.text + this.tempWords + ' ';
    this.tempWords = ' ';
  }
}
