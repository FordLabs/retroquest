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
 *
 */

import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Column} from '../../teams/domain/column';

@Component({
  selector: 'rq-column-header',
  templateUrl: './column-header.component.html',
  styleUrls: ['./column-header.component.scss'],
  host: {
    '[class.happy]': 'type === \'happy\'',
    '[class.confused]': 'type === \'confused\'',
    '[class.sad]': 'type === \'sad\'',
    '[class.action]': 'type === \'action\''
  }
})
export class ColumnHeaderComponent {

  @Input() title = '';
  @Input() type = '';

  @Input() column: Column;
  @Input() thoughtCount: number;

  @Output() sortedChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() titleChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputField') inputFieldRef: ElementRef;

  readOnlyEnabled = true;
  sorted = false;
  maxTextLength = 16;

  constructor () {
  }

  public emitTitleChangedAndEnableReadonlyMode(): void {
    this.titleChanged.emit(this.title);
    this.readOnlyEnabled = true;
  }

  public toggleSort(): void {
    this.sorted = !this.sorted;
    this.sortedChanged.emit(this.sorted);
  }

  public toggleEdit(): void {
    this.readOnlyEnabled = false;
    this.focusInput();
  }

  private focusInput(): void {
    setTimeout(() => {
      this.inputFieldRef.nativeElement.focus();
    }, 0);
  }

  public blurInput(): void {
    setTimeout(() => {
      this.inputFieldRef.nativeElement.blur();
    }, 0);
  }

}
