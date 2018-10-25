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

import {Component, Input, ViewChild} from '@angular/core';
import {emptyThought, Thought} from '../../../domain/thought';
import {Column} from '../../../domain/column';
import {ThoughtService} from '../../services/thought.service';
import {TaskDialogComponent} from '../../../controls/task-dialog/task-dialog.component';
import {fadeInOutAnimation} from '../../../animations/add-delete-animation';
import {Themes} from '../../../domain/Theme';

@Component({
  selector: 'rq-thoughts-column',
  templateUrl: './thoughts-column.component.html',
  styleUrls: ['./thoughts-column.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ThoughtsColumnComponent {
  constructor(private thoughtService: ThoughtService) {
  }

  @Input() column: Column;
  @Input() thoughts: Array<Thought> = [];
  @Input() readOnly = false;

  @Input() theme: Themes = Themes.Light;

  @ViewChild('thoughtDialog') thoughtDialog: TaskDialogComponent;

  selectedThought: Thought = emptyThought();
  dialogIsVisible = false;

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
