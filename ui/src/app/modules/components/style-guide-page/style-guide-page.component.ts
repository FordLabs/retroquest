/*
 *  Copyright (c) 2020 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Component } from '@angular/core';
import { Thought } from '../../domain/thought';

@Component({
  selector: 'rq-style-guide-page',
  templateUrl: './style-guide-page.component.html',
  styleUrls: ['./style-guide-page.component.scss'],
})
export class StyleGuidePageComponent {
  happyThoughtTask: Thought = {
    id: 1,
    teamId: 'id',
    topic: 'happy',
    message: 'Who am I, am I a fish?',
    hearts: 3,
    discussed: false,
    columnTitle: null,
  };

  dialogIsVisible = false;

  constructor() {}

  public displayAlert(message: string): void {
    window.alert(message);
  }

  public scrollToId(id: string): void {
    const element = document.querySelector('#' + id);
    if (element) {
      element.scrollIntoView();
    }
  }

  public showDialog(): void {
    this.dialogIsVisible = true;
  }
}
