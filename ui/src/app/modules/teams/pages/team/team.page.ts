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

import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as Hammer from 'hammerjs';

import { ActionsRadiatorViewComponent } from '../../../components/actions-radiator-view/actions-radiator-view.component';
import { DataService } from '../../../data.service';
import { Column } from '../../../domain/column';
import { ColumnResponse } from '../../../domain/column-response';
import { Themes } from '../../../domain/Theme';
import { WebsocketActionItemResponse, WebsocketThoughtResponse } from '../../../domain/websocket-response';
import { ActionItemService } from '../../services/action.service';
import { BoardService } from '../../services/board.service';
import { ColumnAggregationService } from '../../services/column-aggregation.service';
import { SubscriptionService } from '../../services/subscription.service';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'rq-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPageComponent implements OnInit, OnDestroy {
  @ViewChild('radiatorView') radiatorView: ActionsRadiatorViewComponent;

  constructor(
    private dataService: DataService,
    private boardService: BoardService,
    private columnAggregationService: ColumnAggregationService,
    private actionItemService: ActionItemService,
    private subscriptionService: SubscriptionService,
    private teamService: TeamService
  ) {}

  teamId: string;
  teamName: string;
  globalWindowRef: Window = window;

  selectedIndex = 0;
  currentView = 'normalView';

  columnsAggregation: Array<ColumnResponse> = [];

  thoughtChanged: EventEmitter<WebsocketThoughtResponse> = new EventEmitter();
  actionItemChanged: EventEmitter<WebsocketActionItemResponse> = new EventEmitter();
  columnChanged: EventEmitter<Column> = new EventEmitter();
  retroEnded: EventEmitter<void> = new EventEmitter();

  theme: Themes;

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  private isMobileView = (): boolean => window.innerWidth <= 610;

  ngOnInit(): void {
    this.subscriptionService.subscribeToThoughts(this.thoughtChanged);
    this.subscriptionService.subscribeToActionItems(this.actionItemChanged);
    this.subscriptionService.subscribeToColumnTitles(this.columnChanged);
    this.subscriptionService.subscribeToEndRetro(this.retroEnded);

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
  }

  ngOnDestroy(): void {
    this.subscriptionService.closeSubscriptions();
  }

  public onEndRetro(): void {
    this.teamService.endRetro(this.teamId);
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
