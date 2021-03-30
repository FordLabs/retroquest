/*
 *  Copyright (c) 2020 Ford Motor Company
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

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActionItem, emptyActionItem } from '../../../domain/action-item';
import { ActionItemService } from '../../services/action.service';
import { ActionItemDialogComponent } from '../../../controls/action-item-dialog/action-item-dialog.component';
import { fadeInOutAnimation } from '../../../animations/add-delete-animation';
import { Themes } from '../../../domain/Theme';
import moment from 'moment';
import {
  ColumnResponse,
  deleteColumnResponse,
} from '../../../domain/column-response';
import { WebsocketResponse } from '../../../domain/websocket-response';
import { Column } from '../../../domain/column';

@Component({
  selector: 'rq-actions-column',
  templateUrl: './actions-column.component.html',
  styleUrls: ['./actions-column.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ActionsColumnComponent implements OnInit {
  constructor(private actionItemService: ActionItemService) {}

  @Input() actionItemAggregation: ColumnResponse;
  @Input() theme: Themes = Themes.Light;
  @Input() teamId: string;
  @Input()
  actionItemChanged: EventEmitter<WebsocketResponse> = new EventEmitter();
  @Input() retroEnded: EventEmitter<Column> = new EventEmitter();

  sorted = false;

  @ViewChild('actionItemDialog') actionItemDialog: ActionItemDialogComponent;

  selectedActionItem: ActionItem = emptyActionItem();
  dialogIsVisible = false;

  ngOnInit(): void {
    this.retroEnded.subscribe(() => {
      this.actionItemAggregation.items.completed.splice(
        0,
        this.actionItemAggregation.items.completed.length
      );
    });

    this.actionItemChanged.subscribe((response) =>
      this.processActionItemChange(response)
    );
  }

  processActionItemChange(response: WebsocketResponse) {
    function retrieveActionItemFromPayload(message: WebsocketResponse) {
      if (response.type === 'delete') {
        return {
          id: response.payload,
        } as ActionItem;
      } else {
        return response.payload as ActionItem;
      }
    }

    const actionItem = retrieveActionItemFromPayload(response);

    if (response.type === 'delete') {
      this.deleteActionItem(actionItem);
    } else {
      if (!actionItem.archived) {
        this.updateActionItems(actionItem);
      }
    }
  }

  deleteActionItem(actionItem: ActionItem) {
    deleteColumnResponse(actionItem, this.actionItemAggregation.items);
  }

  updateActionItems(actionItem: ActionItem) {
    const completedIndex = this.actionItemAggregation.items.completed.findIndex(
      (item: ActionItem) => item.id === actionItem.id
    );
    const activeIndex = this.actionItemAggregation.items.active.findIndex(
      (item: ActionItem) => item.id === actionItem.id
    );

    if (!this.indexWasFound(completedIndex)) {
      if (this.indexWasFound(activeIndex)) {
        if (actionItem.completed) {
          actionItem.state = 'active';
          this.actionItemAggregation.items.active.splice(activeIndex, 1);
          this.actionItemAggregation.items.completed.push(actionItem);
        } else {
          Object.assign(
            this.actionItemAggregation.items.active[activeIndex],
            actionItem
          );
        }
      } else {
        actionItem.state = 'active';
        this.actionItemAggregation.items.active.push(actionItem);
      }
    } else {
      if (!actionItem.completed) {
        actionItem.state = 'active';
        this.actionItemAggregation.items.completed.splice(completedIndex, 1);
        this.actionItemAggregation.items.active.push(actionItem);
      } else {
        Object.assign(
          this.actionItemAggregation.items.completed[completedIndex],
          actionItem
        );
      }
    }
  }

  private indexWasFound(index: number): boolean {
    return index !== -1;
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

  get activeActionItems(): Array<ActionItem> {
    if (this.sorted) {
      return this.actionItemAggregation.items.active
        .slice()
        .sort((a: ActionItem, b: ActionItem) =>
          moment
            .utc(this.checkForNullDate(b.dateCreated))
            .diff(moment.utc(this.checkForNullDate(a.dateCreated)))
        ) as Array<ActionItem>;
    }

    return this.actionItemAggregation.items.active.slice() as Array<ActionItem>;
  }

  get completedActionItems(): Array<ActionItem> {
    return this.actionItemAggregation.items.completed as Array<ActionItem>;
  }

  get totalActionItemCount(): number {
    return this.actionItemAggregation.items.active.length;
  }

  private checkForNullDate(dateCreated: string): string {
    if (!dateCreated) {
      const earliestDatePlaceholder = '1999-01-01';
      return earliestDatePlaceholder;
    }
    return dateCreated;
  }
}
