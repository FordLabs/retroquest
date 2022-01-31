/*
 * Copyright (c) 2022 Ford Motor Company
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

import { CdkDragSortEvent } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';

import { fadeInOutAnimation } from '../../../animations/add-delete-animation';
import { TaskDialogComponent } from '../../../components/task-dialog/task-dialog.component';
import { Column } from '../../../domain/column';
import { ColumnResponse, emptyColumnResponse, removeItemFromColumn } from '../../../domain/column-response';
import { Themes } from '../../../domain/Theme';
import { emptyThought, Thought } from '../../../domain/thought';
import { WebsocketThoughtResponse } from '../../../domain/websocket-response';
import { ThoughtService } from '../../services/thought.service';

@Component({
  selector: 'rq-thoughts-column',
  templateUrl: './thoughts-column.component.html',
  styleUrls: ['./thoughts-column.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ThoughtsColumnComponent implements OnInit {
  constructor(private thoughtService: ThoughtService) {}

  @Input() thoughtAggregation: ColumnResponse = emptyColumnResponse();
  @Input() readOnly = false;
  @Input() archived = false;
  @Input() teamId: string;
  @Input() hideNewThought = false;

  @Input() thoughtChanged: EventEmitter<WebsocketThoughtResponse> = new EventEmitter();
  @Input() columnChanged: EventEmitter<Column> = new EventEmitter();

  @Input() theme: Themes = Themes.Light;
  @Input() retroEnded: EventEmitter<Column> = new EventEmitter();

  @ViewChild(TaskDialogComponent) thoughtDialog: TaskDialogComponent;

  selectedThought: Thought = emptyThought();
  dialogIsVisible = false;
  thoughtsAreSorted = false;

  isMobileView = (): boolean => window.innerWidth <= 610;

  ngOnInit(): void {
    this.retroEnded.subscribe(() => {
      this.thoughtAggregation.items.splice(0, this.thoughtAggregation.items.length);
    });

    this.thoughtChanged.subscribe((response) => {
      this.processThoughtChange(response);
    });

    this.columnChanged.subscribe((column) => {
      if (this.thoughtAggregation.topic === column.topic) {
        this.thoughtAggregation.title = column.title;
      }
    });
  }

  processThoughtChange(response: WebsocketThoughtResponse): void {
    function thoughtWasMovedFromThisColumn(
      thoughtTopic: string,
      thoughtTopicPreviousColumn: string,
      thoughtAggregationTopic: string
    ) {
      return thoughtTopic !== thoughtAggregationTopic && thoughtTopicPreviousColumn === thoughtAggregationTopic;
    }

    const thought = response.payload;

    if (response.type === 'delete') {
      this.deleteThought(thought);
    } else if (thought.topic === this.thoughtAggregation.topic) {
      this.updateThought(thought);
    } else if (thoughtWasMovedFromThisColumn(thought.topic, thought.columnTitle.topic, this.thoughtAggregation.topic)) {
      this.deleteThought(thought);
    }
  }

  get activeThoughtsCount(): number {
    return (this.thoughtAggregation.items || []).filter((item: Thought) => !item.discussed).length;
  }

  get totalThoughtCount(): number {
    return this.thoughtAggregation.items.length;
  }

  get activeThoughts(): Array<Thought> {
    let thoughts = [];

    if (this.thoughtsAreSorted) {
      thoughts = this.thoughtAggregation.items
        .filter((item: Thought) => !item.discussed)
        .slice()
        .sort((a: Thought, b: Thought) => b.hearts - a.hearts);
    } else {
      thoughts = this.thoughtAggregation.items.filter((item: Thought) => !item.discussed);
    }

    return thoughts;
  }

  get completedThoughts(): Array<Thought> {
    let thoughts = [];

    if (this.archived && this.thoughtsAreSorted) {
      thoughts = this.thoughtAggregation.items
        .filter((item: Thought) => item.discussed)
        .slice()
        .sort((a: Thought, b: Thought) => b.hearts - a.hearts);
    } else {
      thoughts = this.thoughtAggregation.items.filter((item: Thought) => item.discussed);
    }

    return thoughts;
  }

  sortChanged(sorted: boolean) {
    this.thoughtsAreSorted = sorted;
  }

  onThoughtDrop(event: CdkDragSortEvent) {
    const thoughtId = event.item.data;
    const newTopic = event.container.data; // expected to equal this.thoughtAggregation.topic
    this.thoughtService.moveThought(thoughtId, newTopic);
  }

  updateThought(updatedThought: Thought) {
    const itemIndex = this.thoughtAggregation.items.findIndex((item: Thought) => item.id === updatedThought.id);
    const updateActionItem = itemIndex !== -1;

    if (updateActionItem) {
      if (updatedThought.discussed) {
        updatedThought.state = 'active';
      }
      Object.assign(this.thoughtAggregation.items[itemIndex], updatedThought);
    } else {
      updatedThought.state = 'active';
      this.thoughtAggregation.items.push(updatedThought);
    }
  }

  deleteThought(thought: Thought) {
    removeItemFromColumn(thought, this.thoughtAggregation.items);
  }

  onMessageChanged(message: string, thought: Thought) {
    this.thoughtService.updateMessage(thought, message);
  }

  onDeleted(thought: Thought) {
    this.thoughtService.deleteThought(thought);
  }

  starCountChanged(starCount: number, thought: Thought) {
    this.thoughtService.heartThought(thought);
  }

  onCompleted(completedState: boolean, thought: Thought) {
    this.thoughtService.updateDiscussionStatus(thought, completedState);
  }

  displayPopup(thought: Thought) {
    this.selectedThought = thought;
    this.thoughtDialog.show();
  }
}
