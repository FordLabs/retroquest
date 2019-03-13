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

import {Component, EventEmitter, Input, OnInit, ViewChild} from '@angular/core';
import {emptyThought, Thought} from '../../../domain/thought';
import {Column} from '../../../domain/column';
import {ThoughtService} from '../../services/thought.service';
import {TaskDialogComponent} from '../../../controls/task-dialog/task-dialog.component';
import {fadeInOutAnimation} from '../../../animations/add-delete-animation';
import {Themes} from '../../../domain/Theme';
import {ColumnResponse} from '../../../domain/column-response';
import {WebsocketResponse} from '../../../domain/websocket-response';

@Component({
  selector: 'rq-thoughts-column',
  templateUrl: './thoughts-column.component.html',
  styleUrls: ['./thoughts-column.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ThoughtsColumnComponent implements OnInit {
  constructor(private thoughtService: ThoughtService) {
  }

  @Input() thoughtAggregation: ColumnResponse;
  @Input() thoughts: Array<Thought> = [];
  @Input() readOnly = false;
  @Input() archived = false;
  @Input() teamId: string;

  @Input() thoughtChanged: EventEmitter<WebsocketResponse> = new EventEmitter();
  @Input() columnChanged: EventEmitter<string> = new EventEmitter();

  @Input() theme: Themes = Themes.Light;
  @Input() retroEnded: EventEmitter<Column> = new EventEmitter();

  @ViewChild('thoughtDialog') thoughtDialog: TaskDialogComponent;

  column: Column;
  selectedThought: Thought = emptyThought();
  dialogIsVisible = false;
  thoughtsAreSorted = false;
  _allThoughts = [];

  get thoughtCount(): number {
    return this._allThoughts.length;
  }

  ngOnInit(): void {
    this.column = {
      id: this.thoughtAggregation.id,
      sorted: false,
      topic: this.thoughtAggregation.topic,
      title: this.thoughtAggregation.title,
      teamId: this.teamId
    };

    this._allThoughts.push(...this.thoughtAggregation.items.active);
    this._allThoughts.push(...this.thoughtAggregation.items.completed);

    this.retroEnded.subscribe(() => {
      this._allThoughts = [];
    });

    this.thoughtChanged.subscribe(
      response => {

        const thought = (response.payload as Thought);

        if (thought.topic === this.column.topic) {

          if (response.type === 'delete') {
            this.deleteThought(thought);
          } else {
            this.updateThought(thought);
          }
        }
      }
    );

    this.columnChanged.subscribe(column => {
      if (this.column.topic === column.topic) {
        this.column = column;
      }
    });
  }

  get totalThoughtCount(): number {
    return this.thoughtAggregation.items.active.length + this.thoughtAggregation.items.completed.length;
  }

  get activeThoughts(): Array<Thought> {
    let thoughts = [];

    if (this.thoughtsAreSorted) {
      thoughts = this.thoughtAggregation.items.active.slice().sort((a, b) => b.hearts - a.hearts);

    } else {
      thoughts = this.thoughtAggregation.items.active;
    }

    return thoughts;
  }

  sortChanged(sorted: boolean) {
    this.thoughtsAreSorted = sorted;
  }

  updateThought(thought: Thought) {
    const completedIndex = this.thoughtAggregation.items.completed.findIndex((item) => item.id === thought.id);
    const activeIndex = this.thoughtAggregation.items.active.findIndex((item) => item.id === thought.id);

    if (!this.indexWasFound(completedIndex)) {
      if (this.indexWasFound(activeIndex)) {
        if (thought.discussed) {
          this.thoughtAggregation.items.active.splice(activeIndex, 1);
          thought.state = 'active';
          this.thoughtAggregation.items.completed.push(thought);
        } else {
          Object.assign(this.thoughtAggregation.items.active[completedIndex], thought);
        }
      } else {
        thought.state = 'active';
        this.thoughtAggregation.items.active.push(thought);
      }
    } else {
      if (!thought.discussed) {
        this.thoughtAggregation.items.completed.splice(completedIndex, 1);
        thought.state = 'active';
        this.thoughtAggregation.items.active.push(thought);
      } else {
        Object.assign(this.thoughtAggregation.items.completed[completedIndex], thought);
      }
    }

  }

  private indexWasFound(index: number): boolean {
    return index !== -1;
  }

  deleteThought(thought: Thought) {

    if (thought.id === -1) {
      if (thought.discussed) {
        this.thoughtAggregation.items.completed.splice(0, this.thoughtAggregation.items.completed.length);
      } else {
        this.thoughtAggregation.items.active.splice(0, this.thoughtAggregation.items.active.length);
      }

    } else {
      if (thought.discussed) {
        this.thoughtAggregation.items.completed.splice(this.thoughtAggregation.items.completed.findIndex(item => item.id === thought.id), 1);
      } else {
        this.thoughtAggregation.items.active.splice(this.thoughtAggregation.items.active.findIndex(item => item.id === thought.id), 1);
      }
    }
  }

  discussThought(thought: Thought): void {
    thought.discussed = !thought.discussed;
    this.thoughtService.updateThought(thought);
  }

  heartThought(thought: Thought): void {
    thought.hearts++;
    this.thoughtService.updateThought(thought);
  }

  onMessageChanged(message: string, thought: Thought) {
    thought.message = message;
    this.thoughtService.updateThought(thought);
  }

  onDeleted(thought: Thought) {
    this.thoughtService.deleteThought(thought);
  }

  starCountChanged(starCount: number, thought: Thought) {
    thought.hearts = starCount;
    this.thoughtService.updateThought(thought);
  }

  onCompleted(completedState: boolean, thought: Thought) {
    thought.discussed = completedState;
    this.thoughtService.updateThought(thought);
  }

  displayPopup(thought: Thought) {
    this.selectedThought = thought;
    this.thoughtDialog.show();
  }

}
