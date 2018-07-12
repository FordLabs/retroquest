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
  selector: 'rq-actions-header',
  templateUrl: './actions-header.component.html',
  styleUrls: ['./actions-header.component.scss']
})
export class ActionsHeaderComponent {

  constructor(private actionItemService: ActionItemService) {
  }

  @Input() teamId: string;
  @Input() thoughtCount: number;

  maxInputLength = 255;

  addActionItem(newMessage: string): void {
    if (newMessage && newMessage.length) {
      const actionItem: ActionItem = {
        id: null,
        teamId: this.teamId,
        task: newMessage,
        completed: false,
        assignee: null
      };

      this.actionItemService.addActionItem(actionItem);
    }
  }
}
