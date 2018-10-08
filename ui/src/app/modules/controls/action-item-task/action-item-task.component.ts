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

import {AfterViewChecked, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ActionItem, emptyActionItem} from '../../domain/action-item';
import * as moment from 'moment';
import {emojify} from '../../utils/EmojiGenerator';

@Component({
  selector: 'rq-action-item-task',
  templateUrl: './action-item-task.component.html',
  styleUrls: ['./action-item-task.component.scss'],
  host: {
    '[class.push-order-to-bottom]': 'actionItem.completed',
    '[class.edit-mode]': 'taskEditModeEnabled',
    '[class.dialog-overlay-border]': 'enableOverlayBorder'
  }
})
export class ActionItemTaskComponent implements AfterViewChecked {

  @Input() actionItem = emptyActionItem();
  @Input() readOnly = false;
  @Input() enableOverlayBorder = false;

  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<ActionItem> = new EventEmitter<ActionItem>();
  @Output() messageClicked: EventEmitter<ActionItem> = new EventEmitter<ActionItem>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() assigneeUpdated: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('content_value') editableTextArea: ElementRef;
  @ViewChild('assignee_text_field') assigneeTextField: ElementRef;

  taskEditModeEnabled = false;
  maxMessageLength = 255;
  _textValueLength = 0;
  deleteWasToggled = false;

  constructor() {
  }

  ngAfterViewChecked() {
    this.initializeTextAreaHeight();
  }

  public onDeleteConfirmationBlur(): void {
    this.toggleDeleteConfirmation();
  }

  public toggleEditMode(): void {
    if (this.taskEditModeEnabled) {
      this.messageChanged.emit(this.actionItem.task);
    } else {
      this.focusInput();
    }
    this.taskEditModeEnabled = !this.taskEditModeEnabled;
  }

  public editModeOff(): void {
    this.messageChanged.emit(this.actionItem.task);
    this.taskEditModeEnabled = false;
  }

  public emitDeleteItem(): void {
    this.toggleDeleteConfirmation();
    if (!this.deleteWasToggled) {
      this.deleted.emit(this.actionItem);
    }
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

  public initializeTextAreaHeight(): void {
    this.editableTextArea.nativeElement.style.height = this.editableTextArea.nativeElement.scrollHeight + 'px';
  }

  private focusInput(): void {
    setTimeout(() => {
      this.editableTextArea.nativeElement.focus();
      this.selectAllText();
      this._textValueLength = this.actionItem.task.length;
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

  public setMessageLength(textContent: string): void {
    this._textValueLength = textContent.length;
  }

  public updateActionItemMessage(event, innerText: string): void {
    event.preventDefault();
    this.actionItem.task = innerText;
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

