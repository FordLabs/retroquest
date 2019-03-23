/*
 *  Copyright (c) 2018 Ford Motor Company
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

import {AfterContentChecked, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ActionItem, emptyActionItem} from '../../domain/action-item';
import {ActionItemTaskComponent} from '../action-item-task/action-item-task.component';
import {Themes} from '../../domain/Theme';

const ESC_KEY = 27;

@Component({
  selector: 'rq-action-item-dialog',
  templateUrl: './action-item-dialog.component.html',
  styleUrls: ['./action-item-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"',
    '[class.edit-mode]': 'taskEditModeEnabled',
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class ActionItemDialogComponent implements AfterContentChecked {

  @Input() actionItem: ActionItem = emptyActionItem();
  @Input() visible = true;
  @Input() theme: Themes = Themes.Light;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<ActionItem> = new EventEmitter<ActionItem>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() assignedUpdated: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('action_item_component') actionItemComponent: ActionItemTaskComponent;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  ngAfterContentChecked() {
    if (this.actionItemComponent && this.visible) {
      this.actionItemComponent.initializeTextAreaHeight();
    }
  }

  private hide(): void {
    this.visible = false;
    this.visibilityChanged.emit(this.visible);
    document.onkeydown = null;
    document.body.style.overflow = null;
  }

  public show(): void {
    this.visible = true;
    document.body.style.overflow = 'hidden';
    document.onkeydown = event => {
      if (event.keyCode === ESC_KEY) {
        this.hide();
      }
    };
  }

  public emitDeleted(): void {
    this.deleted.emit(this.actionItem);
    this.hide();
  }

  public emitMessageChanged(message: string) {
    this.messageChanged.emit(message);
  }

  public emitCompleted(state: boolean) {
    this.completed.emit(state);
    this.hide();
  }

  public emitAssigneeUpdated(assignee: string) {
    this.assignedUpdated.emit(assignee);
  }

}

