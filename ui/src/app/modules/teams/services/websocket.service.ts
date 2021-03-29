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

import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { LoggerFactory } from '@elderbyte/ts-logger';
import { StompClient } from '@elderbyte/ts-stomp';
import { Observable } from 'rxjs/internal/Observable';
import { Thought } from '../../domain/thought';
import { ActionItem } from '../../domain/action-item';
import { Column } from '../../domain/column';
import { DataService } from '../../data.service';

@Injectable()
export class WebsocketService {
  logger = LoggerFactory.getLogger('WebsocketService');
  stompClient: StompClient;
  websocket;
  intervalId = null;
  websocketIsOpened = false;

  constructor(private dataService: DataService) {}

  static getWsProtocol(location) {
    return location.protocol === 'http:' ? 'ws://' : 'wss://';
  }

  public getWebsocketState(): number {
    if (!this.websocket) {
      return WebSocket.CLOSED;
    }
    return this.websocket.readyState;
  }

  public closeWebsocket() {
    this.stompClient = null;
    this.websocket = null;
    this.intervalId = null;
    this.websocketIsOpened = false;
  }

  public openWebsocket(): Observable<any> {
    if (!this.stompClient) {
      const protocol = WebsocketService.getWsProtocol(location);

      this.stompClient = new StompClient(
        (this.websocket = new WebSocket(
          protocol + location.host + '/websocket/websocket',
          []
        ))
      );
    }
    this.websocketIsOpened = true;
    return new Observable((observer) => {
      const headers = new Map<string, string>();
      headers.set('Authorization', 'Bearer ' + AuthService.getToken());

      this.stompClient.connect({
        headers,
      });

      this.stompClient.onConnect.subscribe(() => {
        observer.next();
      });

      this.stompClient.errors.subscribe((m) => {
        this.stompClient.connect({
          headers,
        });
      });
    });
  }

  public sendHeartbeat() {
    this.stompClient.send(
      `/app/heartbeat/ping/${this.dataService.team.id}`,
      ''
    );
  }

  public heartbeatTopic(): Observable<any> {
    this.checkForOpenSocket();

    return new Observable<any>((observer) => {
      const sub = this.stompClient.subscribe(
        `/topic/heartbeat/pong/${this.dataService.team.id}`
      );
      sub.messages.subscribe((m) => {
        observer.next(m);
      });
    });
  }

  public endRetroTopic(): Observable<any> {
    this.checkForOpenSocket();

    return new Observable<any>((observer) => {
      const sub = this.stompClient.subscribe(
        `/topic/${this.dataService.team.id}/end-retro`
      );
      sub.messages.subscribe((m) => {
        observer.next(m);
      });
    });
  }

  public thoughtsTopic(): Observable<any> {
    this.checkForOpenSocket();

    return new Observable<any>((observer) => {
      const sub = this.stompClient.subscribe(
        `/topic/${this.dataService.team.id}/thoughts`
      );
      sub.messages.subscribe((m) => {
        observer.next(m);
      });
    });
  }

  public createThought(thought: Thought): void {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/${this.dataService.team.id}/thought/create`,
      JSON.stringify(thought)
    );
  }

  public deleteThought(thought: Thought): void {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/v2/${this.dataService.team.id}/thought/delete`,
      JSON.stringify(thought)
    );
  }

  public updateThought(thought: Thought): void {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/${this.dataService.team.id}/thought/${thought.id}/edit`,
      JSON.stringify(thought)
    );
  }

  private checkForOpenSocket(): void {
    if (!this.websocketIsOpened) {
      throw new Error(
        'Attempted to connect to thoughts topic without connecting to the websocket'
      );
    }
  }

  public actionItemTopic(): Observable<any> {
    this.checkForOpenSocket();

    return new Observable<any>((observer) => {
      const sub = this.stompClient.subscribe(
        `/topic/${this.dataService.team.id}/action-items`
      );
      sub.messages.subscribe((m) => {
        observer.next(m);
      });
    });
  }

  public columnTitleTopic(): Observable<any> {
    return new Observable<any>((observer) => {
      const sub = this.stompClient.subscribe(
        `/topic/${this.dataService.team.id}/column-titles`
      );
      sub.messages.subscribe((m) => {
        observer.next(m);
      });
    });
  }

  public createActionItem(actionItem: ActionItem) {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/${this.dataService.team.id}/action-item/create`,
      JSON.stringify(actionItem)
    );
  }

  public updateActionItem(actionItem: ActionItem) {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/${this.dataService.team.id}/action-item/${actionItem.id}/edit`,
      JSON.stringify(actionItem)
    );
  }

  public deleteActionItem(actionItem: ActionItem) {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/${this.dataService.team.id}/action-item/delete`,
      JSON.stringify(actionItem)
    );
  }

  public updateColumnTitle(column: Column) {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/${this.dataService.team.id}/column-title/${column.id}/edit`,
      JSON.stringify(column)
    );
  }

  deleteAllThoughts() {
    this.checkForOpenSocket();
    this.stompClient.send(
      `/app/v2/${this.dataService.team.id}/thought/deleteAll`,
      null
    );
  }

  endRetro() {
    this.checkForOpenSocket();
    this.stompClient.send(`/app/${this.dataService.team.id}/end-retro`, null);
  }
}
