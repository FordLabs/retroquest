import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rq-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
  @Input() minutes: number = 5;
  @Input() seconds: number = 0;
  time!: number;
  interval!: any;
  border: string = "set";

  startTimer() {
    this.border = "set";
    clearInterval(this.interval);
    this.time = (this.minutes * 60) + this.seconds;
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.border = "out";
        this.pauseTimer();
      } else {
        this.time--;
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time % 60;
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  constructor() { }

  ngOnInit(): void {
  }

}
