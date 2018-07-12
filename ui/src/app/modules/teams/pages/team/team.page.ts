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

import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Column} from '../../domain/column';
import {Thought} from '../../domain/thought';
import {ActionItem} from '../../domain/action-item';
import {WebsocketService} from '../../services/websocket.service';

import {ThoughtService} from '../../services/thought.service';
import {TeamService} from '../../services/team.service';
import {ActionItemService} from '../../services/action.service';
import {ColumnService} from '../../services/column.service';
import {WebsocketResponse} from '../../domain/websocket-response';

@Component({
  selector: 'rq-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss']
})
export class TeamPageComponent implements OnInit {

  static defaultColumns: Array<Column> = [
    {
      id: 0,
      teamId: 'defaults',
      topic: 'happy',
      title: '',
      sorted: false
    },
    {
      id: 0,
      teamId: 'defaults',
      topic: 'confused',
      title: '',
      sorted: false
    },
    {
      id: 0,
      teamId: 'defaults',
      topic: 'unhappy',
      title: '',
      sorted: false
    }
  ];

  constructor(private activeRoute: ActivatedRoute,
              private teamsService: TeamService,
              private thoughtService: ThoughtService,
              private columnService: ColumnService,
              private actionItemService: ActionItemService,
              private websocketService: WebsocketService) {
  }

  teamId: string;
  teamName: string;
  columns: Array<Column> = TeamPageComponent.defaultColumns;
  thoughts: Map<number, Thought> = new Map<number, Thought>();
  indexedThoughts: Map<number, Array<Thought>> = new Map<number, Array<Thought>>();
  actionItems: Array<ActionItem> = [];
  globalWindowRef: Window = window;

  ngOnInit(): void {

    this.activeRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.getTeamName();
      this.getColumns();
      this.getThoughts();
      this.getActionItems();
      this.subscribeToResetThoughts();

      this.globalWindowRef.setInterval(() => {
        if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
          this.websocketService.closeWebsocket();
          this.websocketInit();
        }
      }, 500);
    });
  }

  public getColumnThoughtCount(column: Column): number {
    const columnId = column.id;

    if (this.indexedThoughts.has(columnId)) {
      const columnThoughts = this.indexedThoughts.get(columnId);
      if (columnThoughts) {
        return columnThoughts.filter((thought) => !thought.discussed).length;
      }
    }

    return 0;
  }

  public getActionItemColumnCount(): number {
    return this.actionItems.filter( (actionItem) => !actionItem.completed).length;
  }

  public getThoughtsInColumn(column: Column): Array<Thought> {
    let thoughts = this.indexedThoughts.get(column.id);
    if ( !thoughts ) {
      thoughts = [];
    }

    if (column.sorted) {
      thoughts = thoughts.slice().sort((a, b) => b.hearts - a.hearts);
    }

    return thoughts;
  }

  public resetThoughts(): void {
    this.thoughts.clear();
    this.indexThoughts();
  }

  private indexThoughts(): void {
    this.indexedThoughts = new Map<number, Array<Thought>>();

    this.thoughts.forEach((thought) => {
      const columnId = thought.columnTitle.id;

      if (!this.indexedThoughts.has(columnId)) {
        this.indexedThoughts.set(columnId, []);
      }

      this.indexedThoughts.get(columnId).push(thought);
    });
  }

  private subscribeToResetThoughts() {
    this.thoughtService.resetThoughtsObserver.subscribe(
      () => this.resetThoughts()
    );
  }

  private websocketInit() {
    this.websocketService.openWebsocket(this.teamId).subscribe(() => {

      this.websocketService.thoughtsTopic().subscribe((message) => {

        const response: WebsocketResponse = message.bodyJson;

        if (response.type === 'delete') {
          const thoughtId = response.payload as number;
          if ( thoughtId > -1 ) {
            this.thoughts.delete(thoughtId);
          } else {
            this.thoughts.clear();
          }
        } else {
          const thought: Thought = response.payload as Thought;
          this.thoughts.set(thought.id, thought);
        }
        this.indexThoughts();
      });

      this.websocketService.actionItemTopic().subscribe((message) => {
        const response: WebsocketResponse = message.bodyJson;
        if (response.type === 'delete') {
          this.deleteActionItem(response);
        } else {
          this.updateActionItems(response);
        }
      });

      this.websocketService.columnTitleTopic().subscribe((message) => {
        const response: WebsocketResponse = message.bodyJson;

        if ( response.type === 'put') {
          this.updateColumns(response);
        }
      });
    });
  }

  private deleteActionItem(response: WebsocketResponse) {
    const actionItemId = response.payload as number;
    this.actionItems = this.actionItems.filter((item) => item.id !== actionItemId);
  }

  private updateActionItems(response: WebsocketResponse) {
    const actionItem: ActionItem = response.payload as ActionItem;
    const actionItemIndex = this.actionItems.findIndex((item) => item.id === actionItem.id);
    if (actionItemIndex === -1) {
      this.actionItems.push(actionItem);
    } else {
      this.actionItems[actionItemIndex] = actionItem;
    }
  }

  private updateColumns(response: WebsocketResponse) {
    const updatedColumn: Column = response.payload as Column;
    const modifiedColumnIndex = this.columns.findIndex((item) => item.id === updatedColumn.id);
    if (modifiedColumnIndex > -1) {
      this.columns[modifiedColumnIndex].title = updatedColumn.title;
    }
  }

  private getThoughts(): void {
    this.thoughtService.fetchThoughts(this.teamId).subscribe(
      (thoughts: Array<Thought>) => {
        this.thoughts = new Map<number, Thought>();

        thoughts.forEach((thought) => {
          this.thoughts.set(thought.id, thought);
        });

        this.indexThoughts();
      }
    );
  }

  private getColumns(): void {
    this.columnService.fetchColumns(this.teamId).subscribe(
      (columns: Array<Column>) => {
        this.columns = columns;
      }
    );
  }

  private getTeamName(): void {
    this.teamsService.fetchTeamName(this.teamId).subscribe(
      (teamName) => {
        this.teamName = teamName;
      }
    );
  }

  private getActionItems(): void {
    this.actionItemService.fetchActionItems(this.teamId).subscribe(
      (actionItems: Array<ActionItem>) => {
        this.actionItems = actionItems;
      }
    );
  }
}
