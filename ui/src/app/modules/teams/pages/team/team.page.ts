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

import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
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

import * as Hammer from 'hammerjs';
import * as moment from 'moment';
import {ActionsRadiatorViewComponent} from '../../../controls/actions-radiator-view/actions-radiator-view.component';
import {SaveCheckerService} from '../../services/save-checker.service';
import {Themes} from '../../../domain/Theme';
import {BoardService} from '../../services/board.service';
import {ColumnAggregationService} from '../../services/column-aggregation.service';
import {ColumnCombinerResponse} from '../../../domain/column-combiner-response';
import {ColumnResponse} from '../../../domain/column-response';

@Component({
  selector: 'rq-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss']
})
export class TeamPageComponent implements OnInit {

  @ViewChild('radiatorView') radiatorView: ActionsRadiatorViewComponent;

  constructor(private activeRoute: ActivatedRoute,
              private teamsService: TeamService,
              private thoughtService: ThoughtService,
              private columnService: ColumnService,
              private actionItemService: ActionItemService,
              private websocketService: WebsocketService,
              private saveCheckerService: SaveCheckerService,
              private boardService: BoardService,
              private columnAggregationService: ColumnAggregationService
  ) {
  }

  teamId: string;
  teamName: string;
  globalWindowRef: Window = window;

  actionItems: Array<ActionItem> = [];
  thoughtsArray: Array<Thought> = [];
  selectedIndex = 0;
  actionItemsAreSorted = false;
  currentView = 'normalView';

  columnsAggregation: Array<ColumnResponse> = [];
  activeActionItems: Array<ActionItem> = [];
  completedActionItems: Array<ActionItem> = [];
  thoughtsAggregation: Array<ColumnResponse> = [];

  thoughtUpdated: EventEmitter<Thought> = new EventEmitter();
  thoughtResponseChanged: EventEmitter<WebsocketResponse> = new EventEmitter();
  retroEnded: EventEmitter<void> = new EventEmitter();

  _theme: Themes = Themes.Light;

  get theme(): Themes {
    return this._theme;
  }

  set theme(theme: Themes) {
    this._theme = theme;
    if (this._theme === Themes.Dark) {
      document.body.style.backgroundColor = '#2c3e50';
    } else if (this._theme === Themes.Light) {
      document.body.style.backgroundColor = '#ecf0f1';
    }
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  private isMobileView = (): boolean => window.innerWidth <= 610;

  ngOnInit(): void {


    if (this.isMobileView()) {
      this.addTouchListeners();
    }

    this.activeRoute.params.subscribe((params) => {
      this.teamId = params.teamId;


      this.columnAggregationService.getColumns(this.teamId).subscribe(
        (body) => {
          this.columnsAggregation = body.columns;

          const actionItemsAggregation = this.columnsAggregation.filter(col => col.topic === 'action')[0].items;
          this.activeActionItems = (actionItemsAggregation.active as Array<ActionItem>);
          this.completedActionItems = (actionItemsAggregation.completed as Array<ActionItem>);

          this.actionItems = [];
          this.actionItems.push(...this.activeActionItems);
          this.actionItems.push(...this.completedActionItems);

          this.thoughtsAggregation = this.columnsAggregation.filter(col => col.topic !== 'action');
        }
      );

      this.getTeamName();
      this.getColumns();
      this.subscribeToResetThoughts();


      if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
        this.websocketInit();
      }


      this.websocketService.intervalId = this.globalWindowRef.setInterval(() => {
        if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
          this.websocketService.closeWebsocket();
          this.websocketInit();
        } else if (this.websocketService.getWebsocketState() === WebSocket.OPEN) {
          this.websocketService.sendHeartbeat();
        }
      }, 1000 * 1);

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

  get unsortedAndUncompletedActionItems(): Array<ActionItem> {
    return this.actionItems.filter((actionItem) => !actionItem.completed);
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
        this.thoughtResponseChanged.emit(message.bodyJson as WebsocketResponse);
        this.saveCheckerService.updateTimestamp();
      });

      this.websocketService.actionItemTopic().subscribe((message) => {
        const response: WebsocketResponse = message.bodyJson;
        if (response.type === 'delete') {
          this.deleteActionItem(response);
        } else {
          this.updateActionItems(response);
        }

        this.saveCheckerService.updateTimestamp();
      });

      this.websocketService.columnTitleTopic().subscribe((message) => {
        const response: WebsocketResponse = message.bodyJson;

        if (response.type === 'put') {
          this.updateColumns(response);
        }

        this.saveCheckerService.updateTimestamp();
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
      actionItem.state = 'active';
      this.actionItems.push(actionItem);
    } else {
      Object.assign(this.actionItems[actionItemIndex], actionItem);
    }
  }

  private updateColumns(response: WebsocketResponse) {
    // const updatedColumn: Column = response.payload as Column;
    // const modifiedColumnIndex = this.columns.findIndex((item) => item.id === updatedColumn.id);
    // if (modifiedColumnIndex > -1) {
    //   this.columns[modifiedColumnIndex].title = updatedColumn.title;
    // }
  }


  private getColumns(): void {
    // this.columnService.fetchColumns(this.teamId).subscribe(
    //   (columns: Array<Column>) => this.columns = columns
    // );
  }

  private getTeamName(): void {
    this.teamsService.fetchTeamName(this.teamId).subscribe(
      (teamName) => this.teamName = teamName
    );
  }

  public onEndRetro(): void {

    const thoughts = [];

    this.thoughtsAggregation.map((column) => {
      thoughts.push(...column.items.active);
      thoughts.push(...column.items.completed);
    });


    if (thoughts.length > 0) {
      this.boardService.createBoard(this.teamId, thoughts).subscribe();
    }

    this.retroEnded.emit();
  }

  public isSelectedIndex(index: number): boolean {
    return (index === this.selectedIndex);
  }

  public setSelectedIndex(index: number): void {
    this.selectedIndex = index;
  }

  public incrementSelectedIndex(): void {
    if (this.selectedIndex < this.columnsAggregation.length) {
      this.selectedIndex++;
    }
  }

  public decrementSelectedIndex(): void {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
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

  public toggleActionsRadiatorAndNormalView(state: boolean): void {
    if (!state) {
      this.radiatorView.resetScroll();
    }
    this.currentView = (state) ? 'actionsRadiatorView' : 'normalView';
  }

  public actionsRadiatorViewIsSelected(): boolean {
    return this.currentView === 'actionsRadiatorView';
  }

  public normalViewIsSelected(): boolean {
    return this.currentView === 'normalView';
  }

  private addTouchListeners(): void {
    const teamPage = document.getElementById('page');
    const pageGestures = new Hammer(teamPage);

    pageGestures.on('swipeleft', () => {
      this.incrementSelectedIndex();
    });
    pageGestures.on('swiperight', () => {
      this.decrementSelectedIndex();
    });
  }

  getThoughtCount(index: number): number {
    return this.thoughtsAggregation[index].items.completed.length + this.thoughtsAggregation[index].items.active.length;
  }
}
