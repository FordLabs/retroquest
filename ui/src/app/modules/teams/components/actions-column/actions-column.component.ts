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

  public onCompleted(state: boolean, index: number) {
    const actionItem = this.actionItems[index];
    actionItem.completed = state;
    this.actionItemService.updateActionItem(actionItem);
  }

  public onDeleted(index: number) {
    if (confirm('Are you sure you want to delete this action item?')) {
      this.actionItemService.deleteActionItem(this.actionItems[index]);
    }
  }

  public onMessageChanged(message: string, index: number): void {
    this.actionItems[index].task = message;
    this.actionItemService.updateActionItem(this.actionItems[index]);
  }

  public onAssigneeUpdated(assignee: string, index: number): void {
    this.actionItems[index].assignee = assignee;
    this.actionItemService.updateActionItem(this.actionItems[index]);
  }
}
