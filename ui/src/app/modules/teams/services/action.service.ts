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

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';

import {ActionItem} from '../../domain/action-item';
import {WebsocketService} from './websocket.service';
import {Action} from 'rxjs/internal/scheduler/Action';

@Injectable()
export class ActionItemService {

  constructor(private http: HttpClient, private webSocketService: WebsocketService) {
  }

  fetchActionItems(teamId): Observable<Array<ActionItem>> {
    return this.http.get<Array<ActionItem>>(`/api/team/${teamId}/action-items`);
  }

  fetchArchivedActionItems(teamId): Observable<Array<ActionItem>> {
    return this.http.get<Array<ActionItem>>(`/api/team/${teamId}/action-items/archived`);
  }

  addActionItem(actionItem: ActionItem): void {
    this.webSocketService.createActionItem(actionItem);
  }

  deleteActionItem(actionItem: ActionItem): void {
    this.webSocketService.deleteActionItem(actionItem);
  }

  updateActionItem(actionItem: ActionItem): void {
    this.webSocketService.updateActionItem(actionItem);
  }

  archiveActionItems(archivedActionItems: Array<ActionItem>) {
    archivedActionItems.map(actionItem => {
      this.webSocketService.updateActionItem(actionItem);
    });
  }
}
