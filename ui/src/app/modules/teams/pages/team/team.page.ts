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
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { TeamService } from '../../services/team.service';
import { WebsocketResponse } from '../../../domain/websocket-response';

import * as Hammer from 'hammerjs';
import { ActionsRadiatorViewComponent } from '../../../controls/actions-radiator-view/actions-radiator-view.component';
import { SaveCheckerService } from '../../services/save-checker.service';
import { Themes } from '../../../domain/Theme';
import { BoardService } from '../../services/board.service';
import { ColumnAggregationService } from '../../services/column-aggregation.service';
import { ColumnResponse } from '../../../domain/column-response';
import { Column } from '../../../domain/column';
import { DataService } from '../../../data.service';
import { ActionItemService } from '../../services/action.service';
import { ActionItem } from '../../../domain/action-item';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rq-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPageComponent implements OnInit, OnDestroy {
  @ViewChild('radiatorView') radiatorView: ActionsRadiatorViewComponent;

  constructor(
    private dataService: DataService,
    private teamsService: TeamService,
    private websocketService: WebsocketService,
    private saveCheckerService: SaveCheckerService,
    private boardService: BoardService,
    private columnAggregationService: ColumnAggregationService,
    private actionItemService: ActionItemService,
    private rxStompService: RxStompService
  ) {}

  teamId: string;
  teamName: string;
  globalWindowRef: Window = window;

  selectedIndex = 0;
  currentView = 'normalView';

  columnsAggregation: Array<ColumnResponse> = [];

  thoughtSubscription: Subscription;
  actionItemSubscription: Subscription;
  columnTitleSubscription: Subscription;

  thoughtChanged: EventEmitter<WebsocketResponse> = new EventEmitter();
  actionItemChanged: EventEmitter<WebsocketResponse> = new EventEmitter();
  columnChanged: EventEmitter<Column> = new EventEmitter();

  retroEnded: EventEmitter<void> = new EventEmitter();

  theme: Themes;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  private isMobileView = (): boolean => window.innerWidth <= 610;

  ngOnInit(): void {
    this.teamId = this.dataService.team.id;
    this.teamName = this.dataService.team.name;
    this.theme = this.dataService.theme;

    this.dataService.themeChanged.subscribe((theme) => (this.theme = theme));

    if (this.isMobileView()) {
      this.addTouchListeners();
    }

    this.columnAggregationService.getColumns(this.teamId).subscribe((body) => {
      this.columnsAggregation = body.columns;
    });

    if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
      this.websocketInit();
    } else if (this.websocketService.getWebsocketState() === WebSocket.OPEN) {
      this.subscribeToWebsocket();
    }

    this.websocketService.intervalId = this.globalWindowRef.setInterval(() => {
      if (this.websocketService.getWebsocketState() === WebSocket.CLOSED) {
        this.websocketService.closeWebsocket();
        this.websocketInit();
      } else if (this.websocketService.getWebsocketState() === WebSocket.OPEN) {
        this.websocketService.sendHeartbeat();
      }
    }, 1000 * 60);

    this.thoughtSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/thoughts`)
      .subscribe((message) => {
        console.log(message);
        this.thoughtChanged.emit(JSON.parse(message.body) as WebsocketResponse);
        this.saveCheckerService.updateTimestamp();
      });

    this.actionItemSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/action-items`)
      .subscribe((message) => {
        this.actionItemChanged.emit(
          JSON.parse(message.body) as WebsocketResponse
        );
        this.saveCheckerService.updateTimestamp();
      });

    this.columnTitleSubscription = this.rxStompService
      .watch(`/topic/${this.dataService.team.id}/column-titles`)
      .subscribe((message) => {
        this.columnChanged.emit(
          (JSON.parse(message.body) as WebsocketResponse).payload as Column
        );
        this.saveCheckerService.updateTimestamp();
      });
  }

  ngOnDestroy(): void {
    this.thoughtSubscription.unsubscribe();
    this.actionItemSubscription.unsubscribe();
  }

  private subscribeToWebsocket() {
    this.websocketService.heartbeatTopic().subscribe();

    this.websocketService.endRetroTopic().subscribe(() => {
      this.retroEnded.emit();
    });
  }

  private websocketInit() {
    this.websocketService.openWebsocket().subscribe(() => {
      this.subscribeToWebsocket();
    });
  }

  public onEndRetro(): void {
    const thoughts = [];
    const archivedActionItems: Array<ActionItem> = [];

    this.columnsAggregation.forEach((column) => {
      if (column.topic !== 'action') {
        thoughts.push(...column.items.active);
        thoughts.push(...column.items.completed);
      } else {
        archivedActionItems.push(
          ...(column.items.completed as Array<ActionItem>)
        );
        archivedActionItems.forEach((actionItem: ActionItem) => {
          actionItem.archived = true;
        });
      }
    });

    if (thoughts.length > 0 || archivedActionItems.length > 0) {
      if (thoughts.length > 0) {
        this.boardService.createBoard(this.teamId, thoughts).subscribe();
      }
      if (archivedActionItems.length > 0) {
        this.actionItemService.archiveActionItems(archivedActionItems);
      }
      this.websocketService.endRetro();
    }
  }

  public isSelectedIndex(index: number): boolean {
    return index === this.selectedIndex;
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

  public toggleActionsRadiatorAndNormalView(state: boolean): void {
    if (!state) {
      this.radiatorView.resetScroll();
    }
    this.currentView = state ? 'actionsRadiatorView' : 'normalView';
  }

  public get actionsRadiatorViewIsSelected(): boolean {
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
}
