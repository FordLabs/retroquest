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
import {Column} from '../../domain/column';
import {Thought} from '../../domain/thought';
import {ThoughtService} from '../../services/thought.service';
import {ColumnService} from '../../services/column.service';

@Component({
  selector: 'rq-thoughts-header',
  templateUrl: './thoughts-header.component.html',
  styleUrls: ['./thoughts-header.component.scss']
})
export class ThoughtsHeaderComponent implements OnInit {

  constructor (private thoughtService: ThoughtService, private columnService: ColumnService) {
  }

  maxThoughtLength = 255;

  @Input() column: Column;
  @Input() thoughtCount: number;

  @ViewChild('titleInput') titleInput;

  editing = false;
  newTitle: string;
  newThought = '';

  ngOnInit (): void {
    this.newTitle = this.column.title;
  }

  private editTitle () {
    this.column.title = this.newTitle;
    this.columnService.updateColumn(this.column);
  }

  public sortByHearts (): void {
    this.column.sorted = !this.column.sorted;
  }

  public addThought (): void {
    if (this.newThought && this.newThought.length) {
      const thought: Thought = {
        id: null,
        teamId: this.column.teamId,
        topic: this.column.topic,
        message: this.newThought,
        hearts: 0,
        discussed: false,
        columnTitle: this.column
      };

      this.newThought = '';

      this.thoughtService.addThought(thought);
    }
  }

  public getCharactersRemaining(): number {
    return this.maxThoughtLength - this.newThought.length;
  }

  toggleEdit () {
    if (this.editing) {
      this.editTitle();
    } else {
      this.newTitle = this.column.title;
    }
    this.editing = !this.editing;
  }
}
