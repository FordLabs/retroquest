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

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Column} from '../../../domain/column';
import {Thought} from '../../../domain/thought';
import {ActionItem} from '../../../domain/action-item';

import {ThoughtService} from '../../services/thought.service';
import {TeamService} from '../../services/team.service';
import {ColumnService} from '../../services/column.service';

import {ActionsRadiatorViewComponent} from '../../../controls/actions-radiator-view/actions-radiator-view.component';
import {BoardService} from '../../services/board.service';
import {Themes} from '../../../domain/Theme';
import {ColumnResponse} from '../../../domain/column-response';
import {ColumnAggregationService} from '../../services/column-aggregation.service';

@Component({
  selector: 'rq-archived-board',
  templateUrl: './archived-board.page.html',
  styleUrls: ['./archived-board.page.scss']
})
export class ArchivedBoardPageComponent implements OnInit {

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
              private boardService: BoardService,
              private columnAggregationService: ColumnAggregationService) {
  }

  @Input() theme: Themes = Themes.Light;

  teamId: string;
  boardId: number;
  teamName: string;
  globalWindowRef: Window = window;

  columns: Array<Column> = ArchivedBoardPageComponent.defaultColumns;
  columnAggregations: Array<ColumnResponse>;

  actionItems: Array<ActionItem> = [];
  thoughtsArray: Array<Thought> = [];
  selectedIndex = 0;
  currentView = 'normalView';

  @ViewChild('radiatorView') radiatorView: ActionsRadiatorViewComponent;

  ngOnInit(): void {

    this.activeRoute.params.subscribe((params) => {
      this.teamId = params.teamId;
      this.boardId = params.boardId;

      this.columnAggregationService.getColumns(this.teamId).subscribe(
        response => {
          response.columns.map(column => {
            column.items.active = [];
            column.items.completed = [];
          });
          this.columnAggregations = response.columns;
        }
      );

      this.getTeamName();
      this.getThoughts();
    });
  }

  public getColumnThoughtCount(column: Column): number {
    return this.thoughtsArray.filter(
      (thought) => thought.topic === column.topic && !thought.discussed).length;
  }

  public getActionItemColumnCount(): number {
    return this.actionItems.filter((actionItem) => !actionItem.completed).length;
  }

  private getThoughts(): void {
    this.boardService.fetchThoughtsForBoard(this.teamId, this.boardId).subscribe(
      (thoughts: Array<Thought>) => {
        this.thoughtsArray = thoughts;
        this.columnAggregations.map(aggregation => {
          aggregation.items.completed = this.thoughtsArray.filter(thought => thought.topic === aggregation.topic);
        });
      });
  }

  private getTeamName(): void {
    this.teamsService.fetchTeamName(this.teamId).subscribe(
      (teamName) => this.teamName = teamName
    );
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

  public actionsRadiatorViewIsSelected(): boolean {
    return this.currentView === 'actionsRadiatorView';
  }
}
