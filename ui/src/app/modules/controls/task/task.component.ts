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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {emptyTask, Task} from '../../teams/domain/task';

@Component({
  selector: 'rq-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  host: {
    '[class.edit-mode]': 'taskEditModeEnabled',
    '[class.happy]': 'type === \'happy\'',
    '[class.confused]': 'type === \'confused\'',
    '[class.sad]': 'type === \'sad\'',
    '[class.action]': 'type === \'action\''
  }
})
export class TaskComponent {

  @Input() type = '';
  @Input() task = emptyTask();

  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() messageClicked: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() starCountIncreased: EventEmitter<number> = new EventEmitter<number>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('content_value') editableTextArea: ElementRef;

  starCountMax = 99;
  taskEditModeEnabled = false;

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

  public editContentArea(): void {

  }

  public emitTaskContentClicked(): void {
    this.messageClicked.emit(this.task);
  }

  public toggleTaskComplete(): void {
    this.task.completed = !this.task.completed;
    this.completed.emit(this.task.completed);
  }

  private focusInput(): void {
    setTimeout(() => {
      this.editableTextArea.nativeElement.focus();
    }, 0);
  }

  public forceBlur() {
    setTimeout(() => {
      this.editableTextArea.nativeElement.blur();
    }, 0);
  }
}

