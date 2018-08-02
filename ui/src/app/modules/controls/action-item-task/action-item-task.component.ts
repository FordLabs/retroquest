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
import {ActionItem, emptyActionItem} from '../../teams/domain/action-item';

@Component({
  selector: 'rq-action-item-task',
  templateUrl: './action-item-task.component.html',
  styleUrls: ['./action-item-task.component.scss'],
  host: {
    '[class.edit-mode]': 'taskEditModeEnabled'
  }
})
export class ActionItemTaskComponent {

  @Input() actionItem = emptyActionItem();

  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<ActionItem> = new EventEmitter<ActionItem>();
  @Output() messageClicked: EventEmitter<ActionItem> = new EventEmitter<ActionItem>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() assigneeUpdated: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('content_value') editableTextArea: ElementRef;

  taskEditModeEnabled = false;

  constructor() {
  }

  public toggleEditMode(): void {
    if (this.taskEditModeEnabled) {
      this.messageChanged.emit(this.actionItem.task);
    } else {
      this.focusInput();
    }
    this.taskEditModeEnabled = !this.taskEditModeEnabled;
  }

  public emitDeleteItem(): void {
    this.deleted.emit(this.actionItem);
  }

  public emitTaskContentClicked(): void {
    if (!this.taskEditModeEnabled) {
      this.messageClicked.emit(this.actionItem);
    }
  }

  public toggleTaskComplete(): void {
    this.actionItem.completed = !this.actionItem.completed;
    this.completed.emit(this.actionItem.completed);
  }

  private focusInput(): void {
    setTimeout(() => {
      this.editableTextArea.nativeElement.focus();
      this.selectAllText();
    }, 0);
  }

  public forceBlur() {
    setTimeout(() => {
      this.editableTextArea.nativeElement.blur();
    }, 0);
  }

  public emitAssigneeUpdated(value: string) {
    this.assigneeUpdated.emit(value);
  }

  public emitRemoveAssignee(actionItem: ActionItem) {
    actionItem.assignee = null;
    this.assigneeUpdated.emit(actionItem.assignee);
  }

  private selectAllText(): void {
    document.execCommand('selectAll', false, null);
  }
}

