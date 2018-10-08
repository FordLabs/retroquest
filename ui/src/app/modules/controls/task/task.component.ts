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

import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {emptyThought, Thought} from '../../domain/thought';
import {emojify} from '../../utils/EmojiGenerator';


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
    '[class.action]': 'type === \'action\'',
    '[class.delete-mode]': 'deleteWasToggled',
    '[class.dialog-overlay-border]': 'enableOverlayBorder'
  }
})
export class TaskComponent implements AfterViewInit {

  @Input() type = '';
  @Input() task = emptyThought();
  @Input() enableOverlayBorder = false;

  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<Thought> = new EventEmitter<Thought>();
  @Output() messageClicked: EventEmitter<Thought> = new EventEmitter<Thought>();
  @Output() starCountIncreased: EventEmitter<number> = new EventEmitter<number>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('content_message') contentMessage: ElementRef;
  @ViewChild('content_value') editableTextArea: ElementRef;

  starCountMax = 99;
  maxMessageLength = 255;
  taskEditModeEnabled = false;
  _textValueLength = 0;
  deleteWasToggled = false;

  constructor() {
  }

  ngAfterViewInit() {
    this.initializeTextAreaHeight();
  }

  public onDeleteConfirmationBlur(): void {
    this.toggleDeleteConfirmation();
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
    this.toggleDeleteConfirmation();
    if (!this.deleteWasToggled) {
      this.deleted.emit(this.task);
    }
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

  public initializeTextAreaHeight(): void {
    this.editableTextArea.nativeElement.style.height = this.contentMessage.nativeElement.scrollHeight + 'px';
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

  public setMessageLength(textContent: string): void {
    this._textValueLength = textContent.length;
  }

  public updateTaskMessage(event, value: string): void {
    event.preventDefault();
    this.task.message = value;
  }

  get textValueLength(): number {
    return this._textValueLength;
  }

  public toggleDeleteConfirmation(): void {
    this.deleteWasToggled = !this.deleteWasToggled;
  }

  public emojifyText(text: string): string {
    return emojify(text);
  }
}

