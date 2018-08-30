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

import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {emptyThought, Thought} from '../../domain/thought';
import {text} from '../../../../../node_modules/@angular/core/src/render3/instructions';


const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;

@Component({
  selector: 'rq-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  host: {
    '[class.push-order-to-bottom]': 'task.discussed',
    '[class.edit-mode]': 'taskEditModeEnabled',
    '[class.happy]': 'type === \'happy\'',
    '[class.confused]': 'type === \'confused\'',
    '[class.sad]': 'type === \'unhappy\'',
    '[class.action]': 'type === \'action\''
  }
})
export class TaskComponent {

  @Input() type = '';
  @Input() task = emptyThought();

  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<Thought> = new EventEmitter<Thought>();
  @Output() messageClicked: EventEmitter<Thought> = new EventEmitter<Thought>();
  @Output() starCountIncreased: EventEmitter<number> = new EventEmitter<number>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('content_value') editableTextArea: ElementRef;

  starCountMax = 99;
  maxMessageLength = 255;
  taskEditModeEnabled = false;
  _textValueLength = 0;

  constructor() {
  }

  public toggleEditMode(): void {
    if (this.taskEditModeEnabled) {
      this.messageChanged.emit(this.task.message);
    } else {
      this.focusInput();
    }
    this.taskEditModeEnabled = !this.taskEditModeEnabled;
  }

  public addStar(): void {
    if (this.task.hearts < this.starCountMax) {
      this.starCountIncreased.emit(++this.task.hearts);
    }
  }

  public emitDeleteItem(): void {
    this.deleted.emit(this.task);
  }

  public emitTaskContentClicked(): void {
    if (!this.taskEditModeEnabled) {
      this.messageClicked.emit(this.task);
    }
  }

  public toggleTaskComplete(): void {
    this.task.discussed = !this.task.discussed;
    this.completed.emit(this.task.discussed);
  }

  private focusInput(): void {
    setTimeout(() => {
      this.editableTextArea.nativeElement.focus();
      this.selectAllText();
      this._textValueLength = this.task.message.length;
    }, 0);
  }

  private selectAllText(): void {
    document.execCommand('selectAll', false, null);
  }

  public forceBlur() {
    setTimeout(() => {
      this.editableTextArea.nativeElement.blur();
    }, 0);
  }

  public onKeyDown(keyEvent: KeyboardEvent, innerText: string) {
    if (!this.keyEventIsAnAction(keyEvent)) {
      if (innerText.length + keyEvent.key.length > this.maxMessageLength) {
        keyEvent.preventDefault();
      }
    }
  }

  public onKeyUp(textContent: string, innerText: string): void {
    this._textValueLength = Math.min(textContent.length, innerText.length);
  }

  public updateTaskMessage(innerText: string): void {
    this.task.message = innerText;
  }

  private keyEventIsAnAction(keyEvent: KeyboardEvent): boolean {
    return keyEvent.keyCode === BACKSPACE_KEY || keyEvent.keyCode === DELETE_KEY;
  }

  get textValueLength(): number {
    return this._textValueLength;
  }
}

