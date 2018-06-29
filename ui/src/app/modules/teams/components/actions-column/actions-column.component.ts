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

import {Component, Input} from '@angular/core';
import {ActionItem} from '../../domain/action-item';
import {ActionItemService} from '../../services/action.service';

@Component({
  selector: 'rq-actions-column',
  templateUrl: './actions-column.component.html',
  styleUrls: ['./actions-column.component.scss']
})
export class ActionsColumnComponent {

  constructor (private actionItemService: ActionItemService) {
  }

  @Input() actionItems: Array<ActionItem>;
  currentActionItemId: number = null;
  currentActionItemTask: string = null;

  private updateCurrentActionItem (): void {
    if (this.currentActionItemId !== null) {
      const currentActionItem = this.actionItems.filter((actionItem) => actionItem.id === this.currentActionItemId)[0];
      currentActionItem.task = this.currentActionItemTask;
      this.actionItemService.updateActionItem(currentActionItem);
    }
  }

  setCurrentActionItem (actionItem?: ActionItem): void {
    this.updateCurrentActionItem();
    if (!actionItem || actionItem.id === this.currentActionItemId) {
      this.currentActionItemId = null;
      this.currentActionItemTask = null;
    } else {
      this.currentActionItemId = actionItem.id;
      this.currentActionItemTask = actionItem.task;
    }
  }

  deleteActionItem (actionItem: ActionItem): void {
    if (confirm('Are you sure you want to delete this action item?')) {
      this.actionItemService.deleteActionItem(actionItem);
    }
  }

  completeActionItem (actionItem: ActionItem): void {
    actionItem.completed = !actionItem.completed;
    this.actionItemService.updateActionItem(actionItem);
  }

  updateAssignee (actionItem: ActionItem, newAssignee: string = null): void {
    actionItem.assignee = newAssignee;
    this.actionItemService.updateActionItem(actionItem);
    actionItem.expanded = false;
  }
}
