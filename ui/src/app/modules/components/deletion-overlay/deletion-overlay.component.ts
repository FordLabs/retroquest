/*
 *  Copyright (c) 2020 Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Themes } from '../../domain/Theme';

@Component({
  selector: 'rq-deletion-overlay',
  templateUrl: './deletion-overlay.component.html',
  styleUrls: ['./deletion-overlay.component.scss'],
  host: {
    '[class.dark-theme]': 'darkThemeIsEnabled',
  },
})
export class DeletionOverlayComponent implements OnInit {
  @Input() heading = '';
  @Input() theme: Themes = Themes.Light;

  @Output() acceptButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() declineButtonClicked: EventEmitter<void> = new EventEmitter<void>();
  // eslint-disable-next-line
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('hiddenDeleteInput') hiddenDeleteInput: ElementRef;

  public ngOnInit(): void {
    setTimeout(() => {
      this.hiddenDeleteInput.nativeElement.focus();
    }, 0);
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  emitAcceptButtonClicked() {
    this.acceptButtonClicked.emit();
  }

  emitDeclineButtonClicked() {
    this.declineButtonClicked.emit();
  }

  emitBlur() {
    this.blur.emit();
  }
}
