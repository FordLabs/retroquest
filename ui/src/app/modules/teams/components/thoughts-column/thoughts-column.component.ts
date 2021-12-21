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

import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { emptyThought, Thought } from '../../../domain/thought';
import { Column } from '../../../domain/column';
import { ThoughtService } from '../../services/thought.service';
import { TaskDialogComponent } from '../../../components/task-dialog/task-dialog.component';
import { fadeInOutAnimation } from '../../../animations/add-delete-animation';
import { Themes } from '../../../domain/Theme';
import {
  ColumnResponse,
  deleteColumnResponse,
  emptyColumnResponse,
} from '../../../domain/column-response';
import { WebsocketResponse } from '../../../domain/websocket-response';
import { CdkDragSortEvent } from '@angular/cdk/drag-drop';

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

  @Input() thoughtChanged: EventEmitter<WebsocketResponse> = new EventEmitter();
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
      this.thoughtAggregation.items.active.splice(
        0,
        this.thoughtAggregation.items.active.length
      );
      this.thoughtAggregation.items.completed.splice(
        0,
        this.thoughtAggregation.items.completed.length
      );
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

  processThoughtChange(response: WebsocketResponse): void {
    function retrieveThoughtFromPayload(message: WebsocketResponse): Thought {
      if (message.type === 'delete') {
        return {
          id: message.payload,
        } as Thought;
      } else {
        return message.payload as Thought;
      }
    }

    function thoughtIsInThisColumn(
      thoughtTopic: string,
      thoughtAggregationTopic: string
    ) {
      return thoughtTopic === thoughtAggregationTopic;
    }

    function thoughtWasMovedFromThisColumn(
      thoughtTopic: string,
      thoughtTopicPreviousColumn: string,
      thoughtAggregationTopic: string
    ) {
      return (
        thoughtTopic !== thoughtAggregationTopic &&
        thoughtTopicPreviousColumn === thoughtAggregationTopic
      );
    }

    const thought = retrieveThoughtFromPayload(response);

    if (response.type === 'delete') {
      this.deleteThought(thought);
    } else if (
      thoughtIsInThisColumn(thought.topic, this.thoughtAggregation.topic)
    ) {
      this.updateThought(thought);
    } else if (
      thoughtWasMovedFromThisColumn(
        thought.topic,
        thought.columnTitle.topic,
        this.thoughtAggregation.topic
      )
    ) {
      this.deleteThought(thought);
    }
  }

  get activeThoughtsCount(): number {
    return this.thoughtAggregation.items.active.length;
  }

  get totalThoughtCount(): number {
    return (
      this.thoughtAggregation.items.active.length +
      this.thoughtAggregation.items.completed.length
    );
  }

  get activeThoughts(): Array<Thought> {
    let thoughts = [];

    if (this.thoughtsAreSorted) {
      thoughts = this.thoughtAggregation.items.active
        .slice()
        .sort((a: Thought, b: Thought) => b.hearts - a.hearts);
    } else {
      thoughts = this.thoughtAggregation.items.active;
    }

    return thoughts;
  }

  get completedThoughts(): Array<Thought> {
    let thoughts = [];

    if (this.archived && this.thoughtsAreSorted) {
      thoughts = this.thoughtAggregation.items.completed
        .slice()
        .sort((a: Thought, b: Thought) => b.hearts - a.hearts);
    } else {
      thoughts = this.thoughtAggregation.items.completed;
    }

    return thoughts;
  }

  sortChanged(sorted: boolean) {
    this.thoughtsAreSorted = sorted;
  }

  onThoughtDrop(event: CdkDragSortEvent) {
    const thoughtId = event.item.data;
    const newTopic = event.container.data; // expected to equal this.thoughtAggregation.topic
    this.thoughtService.moveThought(this.teamId, thoughtId, newTopic);
  }

  updateThought(updatedThought: Thought) {
    const completedIndex = this.thoughtAggregation.items.completed.findIndex(
      (item: Thought) => item.id === updatedThought.id
    );
    const activeIndex = this.thoughtAggregation.items.active.findIndex(
      (item: Thought) => item.id === updatedThought.id
    );

    function indexWasFound(index: number): boolean {
      return index !== -1;
    }

    function ensureInColumn(thought: Thought, column: Array<object>) {
      const index = column.findIndex(
        (item: Thought) => item.id === updatedThought.id
      );

      if (indexWasFound(index)) {
        Object.assign(column[index], thought);
      } else {
        thought.state = 'active';
        column.push(thought);
      }
    }

    function ensureNotInColumn(thought: Thought, column: Array<object>) {
      const index = column.findIndex(
        (item: Thought) => item.id === updatedThought.id
      );

      if (indexWasFound(index)) {
        thought.state = 'active';
        column.splice(index, 1);
      }
    }

    if (updatedThought.discussed) {
      ensureInColumn(updatedThought, this.thoughtAggregation.items.completed);
      ensureNotInColumn(updatedThought, this.thoughtAggregation.items.active);
    } else {
      ensureInColumn(updatedThought, this.thoughtAggregation.items.active);
      ensureNotInColumn(
        updatedThought,
        this.thoughtAggregation.items.completed
      );
    }
  }

  deleteThought(thought: Thought) {
    deleteColumnResponse(thought, this.thoughtAggregation.items);
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
