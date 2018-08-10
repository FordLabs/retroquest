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
import {ActionItem, emptyActionItem} from '../../domain/action-item';
import * as moment from 'moment';

const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;

@Component({
  selector: 'rq-action-item-task',
  templateUrl: './action-item-task.component.html',
  styleUrls: ['./action-item-task.component.scss'],
  host: {
    '[class.push-order-to-bottom]': 'actionItem.completed',
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
  @ViewChild('assignee_text_field') assigneeTextField: ElementRef;

  taskEditModeEnabled = false;
  maxMessageLength = 255;

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

  public getDateCreated(): string {
    if (!this.actionItem.dateCreated) {
      return '—';
    }
    return moment(this.actionItem.dateCreated).format('MMM Do');
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

  public forceBlurOnAssigneeTextField() {
    setTimeout(() => {
      this.assigneeTextField.nativeElement.blur();
    }, 0);
  }

  public emitAssigneeUpdated() {
    this.assigneeUpdated.emit(this.actionItem.assignee);
    this.forceBlurOnAssigneeTextField();
  }

  public emitRemoveAssignee(actionItem: ActionItem) {
    actionItem.assignee = null;
    this.assigneeUpdated.emit(actionItem.assignee);
  }

  private selectAllText(): void {
    document.execCommand('selectAll', false, null);
  }

  public onKeyDown(keyEvent: KeyboardEvent) {
    if ((this.actionItem.task.length >= this.maxMessageLength)
      && !this.keyEventIsAnAction(keyEvent)) {
      keyEvent.preventDefault();
    }
  }

  private keyEventIsAnAction(keyEvent: KeyboardEvent): boolean {
    return keyEvent.keyCode === BACKSPACE_KEY || keyEvent.keyCode === DELETE_KEY;
  }
}

