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
import {ActionItem} from '../../../domain/action-item';
import {ActionItemService} from '../../services/action.service';
import * as moment from 'moment';
import {Themes} from '../../../domain/Theme';

const ASSIGNEE_PARSE_SYMBOL = '@';
const ASSIGNEE_PARSE_REGEX = /(\@[a-zA-Z0-9]+\b)/g;

@Component({
  selector: 'rq-actions-header',
  templateUrl: './actions-header.component.html',
  styleUrls: ['./actions-header.component.scss']
})
export class ActionsHeaderComponent {

  constructor(private actionItemService: ActionItemService) {
  }

  @Input() teamId: string;
  @Input() thoughtCount: number;
  @Input() theme: Themes = Themes.Light;

  @Output() sortChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  maxInputLength = 255;
  maxAssigneeLength = 50;

  public addActionItem(newMessage: string): void {
    if (newMessage && newMessage.length) {
      const todaysDate = moment().format();
      const assignees = this.parseAssignees(newMessage);
      const updatedMessage = this.removeAssigneesFromMessage(newMessage, assignees);

      if (updatedMessage && updatedMessage.length) {
        const actionItem: ActionItem = {
          id: null,
          teamId: this.teamId,
          task: updatedMessage,
          completed: false,
          assignee: assignees ? assignees.join(', ').substring(0, this.maxAssigneeLength) : null,
          dateCreated: todaysDate
        };

        this.actionItemService.addActionItem(actionItem);
      }
    }
  }

  public onSortChanged(sortState: boolean): void {
    this.sortChanged.emit(sortState);
  }

  private parseAssignees(newMessage: string): string[] {
    const matches = newMessage.match(ASSIGNEE_PARSE_REGEX);
    if (matches) {
      return matches.map(assignee => assignee.replace(ASSIGNEE_PARSE_SYMBOL, ''));
    }
    return null;
  }

  private removeAssigneesFromMessage(newMessage: string, assignees: string[]): string {
    if (assignees) {
      return newMessage
        .replace(ASSIGNEE_PARSE_REGEX, '')
        .replace(/\s+/g, ' ') // kill extra whitespaces in middle of message
        .trim();
    }
    return newMessage;
  }
}
