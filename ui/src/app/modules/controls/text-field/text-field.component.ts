/*
 * Copyright (c) 2018 Ford Motor Company
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

import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'rq-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent {


  @Input() placeholder = '';
  @Input() type = '';
  text = '';

  @Output() newMessageAdded: EventEmitter<string> = new EventEmitter<string>();

  maxCharLength = 255;
  charsAreRunningOutThreshold = 50;

  constructor() {
  }

  public charactersRemaining(): number {
    return this.maxCharLength - this.text.length;
  }

  public textIsEmpty(): boolean {
    return this.text.length === 0;
  }

  public charactersRemainingAreAboutToRunOut(): boolean {
    return this.charactersRemaining() < this.charsAreRunningOutThreshold;
  }

  public emitNewTaskMessage(): void {
    this.newMessageAdded.emit(this.text);
    this.text = '';
  }
}
