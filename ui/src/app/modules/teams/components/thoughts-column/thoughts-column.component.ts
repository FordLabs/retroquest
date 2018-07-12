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

import {Component, Input} from '@angular/core';
import {Thought} from '../../domain/thought';
import {Column} from '../../domain/column';
import {ThoughtService} from '../../services/thought.service';

@Component({
  selector: 'rq-thoughts-column',
  templateUrl: './thoughts-column.component.html',
  styleUrls: ['./thoughts-column.component.scss']
})
export class ThoughtsColumnComponent {
  constructor (private thoughtService: ThoughtService) {
  }

  @Input() column: Column;
  @Input() thoughts: Array<Thought> = [];
  currentThoughtId: number = null;
  currentThoughtMessage: string;

  private updateCurrentThought (): void {
    if (this.currentThoughtId !== null) {
      const currentThought = this.thoughts.filter((thought) => thought.id === this.currentThoughtId)[0];
      currentThought.message = this.currentThoughtMessage;
      this.thoughtService.updateThought(currentThought);
    }
  }

  setCurrentThought (newThought?: Thought): void {
    this.updateCurrentThought();
    if (!newThought || newThought.id === this.currentThoughtId) {
      this.currentThoughtId = null;
      this.currentThoughtMessage = null;
    } else {
      this.currentThoughtId = newThought.id;
      this.currentThoughtMessage = newThought.message;
    }
  }

  deleteThought (thought: Thought): void {
    if (confirm('Are you sure you want to delete this thought?')) {
      this.thoughtService.deleteThought(thought);
    }
  }

  discussThought (thought: Thought): void {
    thought.discussed = !thought.discussed;
    this.thoughtService.updateThought(thought);
  }

  heartThought (thought: Thought): void {
    thought.hearts++;
    this.thoughtService.updateThought(thought);
  }
}
