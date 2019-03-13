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

import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {ActionItem, emptyActionItem} from '../../../domain/action-item';
import {ActionItemService} from '../../services/action.service';
import {ActionItemDialogComponent} from '../../../controls/action-item-dialog/action-item-dialog.component';
import {fadeInOutAnimation} from '../../../animations/add-delete-animation';
import {Themes} from '../../../domain/Theme';
import * as moment from 'moment';
import {ColumnResponse} from '../../../domain/column-response';
import {WebsocketResponse} from '../../../domain/websocket-response';
import {Thought} from '../../../domain/thought';

@Component({
  selector: 'rq-actions-column',
  templateUrl: './actions-column.component.html',
  styleUrls: ['./actions-column.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ActionsColumnComponent implements OnInit {

  constructor(private actionItemService: ActionItemService) {
  }

  @Input() actionItemAggregation: ColumnResponse;
  @Input() theme: Themes = Themes.Light;
  @Input() teamId: string;
  @Input() actionItemChanged: EventEmitter<WebsocketResponse> = new EventEmitter();

  sorted = false;
  actionItems = [];

  @ViewChild('actionItemDialog') actionItemDialog: ActionItemDialogComponent;

  selectedActionItem: ActionItem = emptyActionItem();
  dialogIsVisible = false;

  ngOnInit(): void {
    this.actionItems.push(...this.actionItemAggregation.items.active);
    this.actionItems.push(...this.actionItemAggregation.items.completed);

    this.actionItemChanged.subscribe(
      response => {

        const actionItem = (response.payload as ActionItem);

        if (response.type === 'delete') {
          this.deleteActionItem(actionItem);
        } else {
          this.updateActionItems(actionItem);
        }
      }
    );
  }


  private deleteActionItem(actionItem: ActionItem) {
    this.actionItems = this.actionItems.filter((item) => item.id !== actionItem.id);
  }

  private updateActionItems(actionItem: ActionItem) {
    const actionItemIndex = this.actionItems.findIndex((item) => item.id === actionItem.id);
    if (actionItemIndex === -1) {
      actionItem.state = 'active';
      this.actionItems.push(actionItem);
    } else {
      Object.assign(this.actionItems[actionItemIndex], actionItem);
    }
  }

  public onCompleted(state: boolean, actionItem: ActionItem) {
    actionItem.completed = state;
    this.actionItemService.updateActionItem(actionItem);
  }

  public onDeleted(actionItem: ActionItem) {
    this.actionItemService.deleteActionItem(actionItem);
  }

  public onMessageChanged(message: string, actionItem: ActionItem): void {
    actionItem.task = message;
    this.actionItemService.updateActionItem(actionItem);
  }

  public onAssigneeUpdated(assignee: string, actionItem: ActionItem): void {
    actionItem.assignee = assignee;
    this.actionItemService.updateActionItem(actionItem);
  }

  public displayPopup(actionItem: ActionItem): void {
    this.selectedActionItem = actionItem;
    this.actionItemDialog.show();
  }

  sortChanged(sorted: boolean) {
    this.sorted = sorted;
  }

  get getActionItems(): Array<ActionItem> {
    if (this.sorted) {
      return this.actionItems.slice().sort((a, b) => moment
        .utc(this.checkForNullDate(b.dateCreated))
        .diff(moment.utc(this.checkForNullDate(a.dateCreated))));
    }

    return this.actionItems;
  }

  private checkForNullDate(dateCreated: string): string {
    if (!dateCreated) {
      const earliestDatePlaceholder = '1999-01-01';
      return earliestDatePlaceholder;
    }
    return dateCreated;
  }

}
