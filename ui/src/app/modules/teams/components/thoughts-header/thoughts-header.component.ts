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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Column} from '../../../domain/column';
import {Thought} from '../../../domain/thought';
import {ThoughtService} from '../../services/thought.service';
import {ColumnService} from '../../services/column.service';
import {Themes} from '../../../domain/Theme';
import {ColumnResponse} from '../../../domain/column-response';

@Component({
  selector: 'rq-thoughts-header',
  templateUrl: './thoughts-header.component.html',
  styleUrls: ['./thoughts-header.component.scss']
})
export class ThoughtsHeaderComponent implements OnInit {

  constructor(private thoughtService: ThoughtService, private columnService: ColumnService) {
  }

  @Input() thoughtAggregation: ColumnResponse;
  @Input() thoughtCount: number;
  @Input() teamId: string;
  @Input() theme: Themes = Themes.Light;
  @Input() hideNewThought = false;

  @Output() sortChanged: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('titleInput') titleInput;

  column: Column;

  ngOnInit(): void {
    this.column = {
      sorted: false,
      id: this.thoughtAggregation.id,
      topic: this.thoughtAggregation.topic,
      title: this.thoughtAggregation.title,
      teamId: this.teamId,
    };
  }

  public editTitle(newTitle: string) {
    this.column.title = newTitle;
    this.columnService.updateColumn(this.column);
  }

  public sortByHearts(sorted: boolean): void {
    this.sortChanged.emit(sorted);
  }

  public addThought(newMessage: string): void {
    if (newMessage && newMessage.length) {
      const thought: Thought = {
        id: -1,
        teamId: this.column.teamId,
        topic: this.column.topic,
        message: newMessage,
        hearts: 0,
        discussed: false,
        columnTitle: this.column
      };

      this.thoughtService.addThought(thought);
    }
  }

}
