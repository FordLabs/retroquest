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
import {emptyThought, Thought} from '../../domain/thought';
import {TaskComponent} from '../task/task.component';
import {Themes} from '../../domain/Theme';
import {ActionItem, emptyActionItem} from '../../domain/action-item';
import {ActionItemService} from '../../teams/services/action.service';
import * as moment from 'moment';
import {ActionItemTaskComponent} from '../action-item-task/action-item-task.component';

const ESC_KEY = 27;

@Component({
  selector: 'rq-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"',
    '[class.edit-mode]': 'taskEditModeEnabled',
    '[class.dark-theme]': 'darkThemeIsEnabled'
  }
})
export class TaskDialogComponent implements AfterContentChecked {

  @Input() type = '';
  @Input() task: Thought = emptyThought();
  @Input() visible = true;
  @Input() theme: Themes = Themes.Light;
  @Input() teamId: string;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() messageChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleted: EventEmitter<Thought> = new EventEmitter<Thought>();
  @Output() starCountIncreased: EventEmitter<number> = new EventEmitter<number>();
  @Output() completed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('task_component') taskComponent: TaskComponent;
  @ViewChild(ActionItemTaskComponent) actionItemTaskComponent: ActionItemTaskComponent;

  assignedActionItem: ActionItem = emptyActionItem();
  actionItemIsVisible = false;

  constructor(private actionItemService: ActionItemService) {
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  ngAfterContentChecked() {
    if (this.taskComponent && this.visible) {
      this.taskComponent.initializeTextAreaHeight();
    }
  }

  public hide(): void {
    if (!this.actionItemIsVisible) {
      this.visible = false;
      this.visibilityChanged.emit(this.visible);
      document.onkeydown = null;
      document.body.style.overflow = null;
    }
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

  public createLinking() {
    if (this.assignedActionItem.task.length > 0) {
      this.assignedActionItem.dateCreated = moment().format();
      this.actionItemService.addActionItem(this.assignedActionItem);
      this.assignedActionItem = emptyActionItem();
      this.actionItemIsVisible = false;
      this.emitCompleted(true);
      this.hide();
    } else {
      this.triggerAnimation();
    }
  }

  private triggerAnimation() {
    this.assignedActionItem.state = undefined;
    setTimeout(() => {
      this.assignedActionItem.state = 'active';
      this.actionItemTaskComponent.focusInput();
    }, 0);
  }

  public toggleActionItem() {
    this.actionItemIsVisible = !this.actionItemIsVisible;
    if (!this.actionItemIsVisible) {
      this.assignedActionItem = emptyActionItem();
    }
  }

}

