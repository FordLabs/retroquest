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

import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {emptyThought, Thought} from '../../../domain/thought';
import {Column} from '../../../domain/column';
import {ThoughtService} from '../../services/thought.service';
import {TaskDialogComponent} from '../../../controls/task-dialog/task-dialog.component';

@Component({
  selector: 'rq-thoughts-column',
  templateUrl: './thoughts-column.component.html',
  styleUrls: ['./thoughts-column.component.scss']
})
export class ThoughtsColumnComponent {
  constructor(private thoughtService: ThoughtService) {
  }

  @Input() column: Column;
  @Input() thoughts: Array<Thought> = [];

  @ViewChild('thoughtDialog') thoughtDialog: TaskDialogComponent;

  selectedThought: Thought = emptyThought();
  currentThoughtId: number = null;
  currentThoughtMessage: string;
  dialogIsVisible = false;
  selectedThoughtIndex = 0;

  private updateCurrentThought(): void {
    if (this.currentThoughtId !== null) {
      const currentThought = this.thoughts.filter((thought) => thought.id === this.currentThoughtId)[0];
      currentThought.message = this.currentThoughtMessage;
      this.thoughtService.updateThought(currentThought);
    }
  }

  setCurrentThought(newThought?: Thought): void {
    this.updateCurrentThought();
    if (!newThought || newThought.id === this.currentThoughtId) {
      this.currentThoughtId = null;
      this.currentThoughtMessage = null;
    } else {
      this.currentThoughtId = newThought.id;
      this.currentThoughtMessage = newThought.message;
    }
  }

  deleteThought(thought: Thought): void {
    if (confirm('Are you sure you want to delete this thought?')) {
      this.thoughtService.deleteThought(thought);
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

  onMessageChanged(message: string, index: number) {
    this.thoughts[index].message = message;
    this.thoughtService.updateThought(this.thoughts[index]);
  }

  onDeleted(thought: Thought) {
    if (confirm('Are you sure you want to delete this thought?')) {
      this.thoughtService.deleteThought(thought);
    }
  }

  starCountChanged(starCount: number, index: number) {
    const thought = this.thoughts[index];
    thought.hearts = starCount;
    this.thoughtService.updateThought(thought);
  }

  onCompleted(completedState: boolean, index: number) {
    const thought = this.thoughts[index];
    thought.discussed = completedState;
    this.thoughtService.updateThought(thought);
  }

  displayPopup(index: number) {
    this.selectedThoughtIndex = index;
    this.selectedThought = this.thoughts[this.selectedThoughtIndex];
    this.thoughtDialog.show();
  }
}
