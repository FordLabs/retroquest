/*
 * Copyright (c) 2021 Ford Motor Company
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

import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RxStompService } from '@stomp/ng2-stompjs';
import { DataService } from '../../data.service';
import {
  WebsocketActionItemResponse,
  WebsocketColumnResponse,
  WebsocketThoughtResponse
} from '../../domain/websocket-response';
import { SaveCheckerService } from './save-checker.service';
import { Column } from '../../domain/column';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService implements OnDestroy {
  thoughtSubscription: Subscription;
  actionItemSubscription: Subscription;
  columnTitleSubscription: Subscription;
  endRetroSubscription: Subscription;

  constructor(
    private dataService: DataService,
    private saveCheckerService: SaveCheckerService,
    private rxStompService: RxStompService
  ) {
    this.ensureRxStompClientHeadersContainAuthorization();
  }

  ngOnDestroy(): void {
    this.closeSubscriptions();
  }

  closeSubscriptions() {
    this.thoughtSubscription?.unsubscribe();
    this.actionItemSubscription?.unsubscribe();
    this.columnTitleSubscription?.unsubscribe();
    this.endRetroSubscription?.unsubscribe();
  }

  subscribeToThoughts(eventEmitter: EventEmitter<WebsocketThoughtResponse>) {
    this.thoughtSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/thoughts`)
      .subscribe((message) => {
        eventEmitter.emit(JSON.parse(message.body) as WebsocketThoughtResponse);
        this.saveCheckerService.updateTimestamp();
      });
  }

  subscribeToActionItems(eventEmitter: EventEmitter<WebsocketActionItemResponse>) {
    this.actionItemSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/action-items`)
      .subscribe((message) => {
        eventEmitter.emit(JSON.parse(message.body) as WebsocketActionItemResponse);
        this.saveCheckerService.updateTimestamp();
      });
  }

  subscribeToColumnTitles(eventEmitter: EventEmitter<Column>) {
    this.columnTitleSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/column-titles`)
      .subscribe((message) => {
        eventEmitter.emit(
          (JSON.parse(message.body) as WebsocketColumnResponse).payload as Column
        );
        this.saveCheckerService.updateTimestamp();
      });
  }

  subscribeToEndRetro(eventEmitter: EventEmitter<void>) {
    this.endRetroSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/end-retro`)
      .subscribe((message) => {
        eventEmitter.emit();
      });
  }

  /*
   * Protects against a race condition
   * - RxStompConfig is set before login and is not mutable
   * - Cookie is not set until after login so, token is not being set to websocket
   *
   * The error this was producing was a websocket connection could not be made without refreshing the browser
   */
  private ensureRxStompClientHeadersContainAuthorization() {
    const headersSetCorrectly =
      this.rxStompService.stompClient.connectHeaders['Authorization'] ===
      AuthService.getToken();

    if (!headersSetCorrectly) {
      this.rxStompService.stompClient.connectHeaders = {
        Authorization: `Bearer ${AuthService.getToken()}`,
      };
      this.rxStompService.stompClient.forceDisconnect();
    }
  }
}
