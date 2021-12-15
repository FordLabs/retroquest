import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'rq-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
  @Input() minutes = 5;
  @Input() seconds = 0;
  time!: number;
  interval!: any;
  border = "set";
  running = false;

  startTimer() {
    if(this.minutes === undefined){
      this.minutes = 0;
    }

    if(this.seconds === undefined){
      this.seconds = 0;
    }

    this.border = "set";
    this.running = true;
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
    this.running = false;
  }

  clearTimer(){
    clearInterval(this.interval);
    this.running = false;
    this.minutes = 0;
    this.seconds = 0;
  }

  minClick(){
    this.minutes = undefined;
  }

  secClick(){
    this.seconds = undefined;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
