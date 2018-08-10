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

import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ThoughtService} from '../../teams/services/thought.service';

@Component({
  selector: 'rq-end-retro-dialog',
  templateUrl: './end-retro-dialog.component.html',
  styleUrls: ['./end-retro-dialog.component.scss'],
  host: {
    '(click)': 'hide()',
    '[style.display]': 'visible ? "flex": "none"'
  }
})
export class EndRetroDialogComponent {

  constructor() {
  }

  @Input() visible = true;

  @Output() submitted: EventEmitter<void> = new EventEmitter<void>();

  public hide(): void {
    this.visible = false;
  }

  public show(): void {
    this.visible = true;
  }

  public submit(): void {
    this.submitted.emit();
    this.hide();
  }
}
