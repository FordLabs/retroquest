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

import {Column} from '../../../domain/column';
import {Thought} from '../../../domain/thought';
import {ActionItem} from '../../../domain/action-item';
import {WebsocketService} from '../../services/websocket.service';

import {ThoughtService} from '../../services/thought.service';
import {TeamService} from '../../services/team.service';
import {ActionItemService} from '../../services/action.service';
import {ColumnService} from '../../services/column.service';
import {WebsocketResponse} from '../../../domain/websocket-response';

import * as moment from 'moment';

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
  globalWindowRef: Window = window;

  columns: Array<Column> = TeamPageComponent.defaultColumns;
  actionItems: Array<ActionItem> = [];
  thoughtsArray: Array<Thought> = [];
  selectedIndex = 0;
  actionItemsAreSorted = false;
  currentView = 'normalView';

  ngOnInit(): void {

    this.activeRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.getTeamName();
      this.getColumns();
      this.getThoughts();
      this.subscribeToActionItems();
      this.subscribeToResetThoughts();

      if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
        this.websocketInit();
      }

      this.globalWindowRef.setInterval(() => {
        if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
          this.websocketService.closeWebsocket();
          this.websocketInit();
        } else if (this.websocketService.getWebsocketState() === WebSocket.OPEN) {
          this.websocketService.sendHeartbeat();
        }
      }, 1000 * 60);
    });
  }

  public getColumnThoughtCount(column: Column): number {
    return this.thoughtsArray.filter(
      (thought) => thought.topic === column.topic && !thought.discussed).length;
  }

  public getActionItemColumnCount(): number {
    return this.actionItems.filter((actionItem) => !actionItem.completed).length;
  }

  public getThoughtsInColumn(column: Column): Array<Thought> {
    let thoughtsInColumn = this.thoughtsArray.filter((thought) => thought.topic === column.topic);
    if (!thoughtsInColumn) {
      return [];
    }

    if (column.sorted) {
      thoughtsInColumn = thoughtsInColumn.slice().sort((a, b) => b.hearts - a.hearts);
    }

    return thoughtsInColumn;
  }

  public resetThoughts(): void {
    this.thoughtsArray.splice(0, this.thoughtsArray.length);
  }

  private subscribeToResetThoughts() {
    this.thoughtService.resetThoughtsObserver.subscribe(() => this.resetThoughts());
  }

  private websocketInit() {
    this.websocketService.openWebsocket(this.teamId).subscribe(() => {

      this.websocketService.heartbeatTopic().subscribe(message => {
      });

      this.websocketService.thoughtsTopic().subscribe((message) => {

        const response: WebsocketResponse = message.bodyJson;

        if (response.type === 'delete') {
          this.deleteThought(response);
        } else {
          this.updateThoughts(response);
        }
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

        if (response.type === 'put') {
          this.updateColumns(response);
        }
      });
    });
  }

  private deleteThought(response: WebsocketResponse) {
    const thoughtId = response.payload as number;
    if (thoughtId === -1) {
      this.resetThoughts();
    } else {
      this.thoughtsArray = this.thoughtsArray.filter((item) => item.id !== thoughtId);
    }
  }

  private updateThoughts(response: WebsocketResponse) {
    const thought: Thought = response.payload as Thought;
    const thoughtIndex = this.thoughtsArray.findIndex((item) => item.id === thought.id);
    if (thoughtIndex === -1) {
      thought.state = 'active';
      this.thoughtsArray.push(thought);
    } else {
      Object.assign(this.thoughtsArray[thoughtIndex], thought);
    }
  }

  private deleteActionItem(response: WebsocketResponse) {
    const actionItemId = response.payload as number;
    this.actionItems = this.actionItems.filter((item) => item.id !== actionItemId);
  }

  private updateActionItems(response: WebsocketResponse) {
    const actionItem: ActionItem = response.payload as ActionItem;
    const actionItemIndex = this.actionItems.findIndex((item) => item.id === actionItem.id);
    if (actionItemIndex === -1) {
      actionItem.state = 'active';
      this.actionItems.push(actionItem);
    } else {
      Object.assign(this.actionItems[actionItemIndex], actionItem);
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
      (thoughts: Array<Thought>) => this.thoughtsArray = thoughts);
  }

  private getColumns(): void {
    this.columnService.fetchColumns(this.teamId).subscribe(
      (columns: Array<Column>) => this.columns = columns
    );
  }

  private getTeamName(): void {
    this.teamsService.fetchTeamName(this.teamId).subscribe(
      (teamName) => this.teamName = teamName
    );
  }

  private subscribeToActionItems(): void {
    this.actionItemService.fetchActionItems(this.teamId).subscribe(
      (actionItems: Array<ActionItem>) => this.actionItems = actionItems
    );
  }

  public onEndRetro(): void {
    this.thoughtService.deleteAllThoughts();
  }

  public isSelectedIndex(index: number): boolean {
    return (index === this.selectedIndex);
  }

  public setSelectedIndex(index: number): void {
    this.selectedIndex = index;
  }

  public actionItemsIndexIsSelected(): boolean {
    return (this.selectedIndex === 3);
  }

  public onActionItemsSortChanged(sortState: boolean): void {
    this.actionItemsAreSorted = sortState;
  }

  public getActionItems(): Array<ActionItem> {
    if (this.actionItemsAreSorted) {
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

  public toggleActionsRadiatorAndNormalView(): void {
    if (this.currentView === 'actionsRadiatorView') {
      this.currentView = 'normalView';
    } else {
      this.currentView = 'actionsRadiatorView';
    }
  }

  public actionsRadiatorViewIsSelected(): boolean {
    return this.currentView === 'actionsRadiatorView';
  }

  public normalViewIsSelected(): boolean {
    return this.currentView === 'normalView';
  }
}
