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
import {emptyThought, Thought} from '../../domain/thought';

const ESC_KEY = 27;

@Component({
  selector: 'rq-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"',
    '[class.edit-mode]': 'taskEditModeEnabled'
  }
})
export class TaskDialogComponent {

  @Input() type = '';
  @Input() task: Thought = emptyThought();
  @Input() visible = true;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<Thought> = new EventEmitter<Thought>();
  @Output() starCountIncreased: EventEmitter<number> = new EventEmitter<number>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

  public hide(): void {
    this.visible = false;
    this.visibilityChanged.emit(this.visible);
    document.onkeydown = null;
  }

  public show(): void {
    this.visible = true;
    document.onkeydown = event => {
      if (event.keyCode === ESC_KEY) {
        this.hide();
      }
    };
  }

  public emitDeleted(): void {
    this.deleted.emit(this.task);
    this.hide();
  }

  public emitMessageChanged(message: string) {
    this.messageChanged.emit(message);
  }

  public emitStarCountIncreased(count: number) {
    this.starCountIncreased.emit(count);
  }

  public emitCompleted(state: boolean) {
    this.completed.emit(state);
    this.hide();
  }
}

