 /*
 * Copyright (c) 2021 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnInit } from '@angular/core';
import { Themes } from '../../domain/Theme';

@Component({
  selector: 'rq-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
  @Input() theme: Themes = Themes.Light;
  @Input() minutes = 5;
  @Input() seconds = 0;
  time!: number;
  interval!: any;
  border = "set";
  running = false;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  startTimer() {
    if(this.minutes === undefined || this.minutes < 0){
      this.minutes = 0;
    }
    if(this.minutes > 99){
      this.minutes = 99;
    }

    if(this.seconds === undefined || this.seconds < 0){
      this.seconds = 0;
    }
    if(this.seconds > 99){
      this.seconds = 99;
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
