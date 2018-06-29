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
import {ThoughtService} from '../../services/thought.service';

@Component({
  selector: 'rq-thought-modal',
  templateUrl: './thought-modal.component.html',
  styleUrls: ['./thought-modal.component.scss']
})
export class ThoughtModalComponent {
  constructor (private thoughtService: ThoughtService) { }

  @Input() thought: Thought;

  open (thought, title): void {
    this.thought = thought;
    this.thought.columnTitle.title = title;
  }

  discussThought (): void {
    this.thought.discussed = !this.thought.discussed;
    this.thoughtService.updateThought(this.thought);
    this.close();
  }

  close () {
    this.thought = null;
  }
}
