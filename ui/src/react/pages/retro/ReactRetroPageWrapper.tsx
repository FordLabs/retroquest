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
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecoilRoot } from 'recoil';

import RetroPage from './RetroPage';

const containerElementName = 'reactRetroPageWrapper';

@Component({
  selector: 'react-retro-page-wrapper',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [
    './RetroPage.scss',
    './retro-sub-header/RetroSubheader.scss',
    '../../components/dialog/Dialog.scss',
    '../../components/modal/Modal.scss',
    '../../components/feedback-dialog/FeedbackDialog.scss',
    '../../components/feedback-stars/FeedbackStars.scss',
    '../../components/column-header/ColumnHeader.scss',
    '../../components/column-item/ColumnItem.scss',
    '../../components/column-item-buttons/ColumnItemButtons.scss',
    '../../components/tooltip/Tooltip.scss',
    '../../components/text-field/TextField.scss',
    '../../components/action-item/ActionItem.scss',
    '../../components/retro-item/RetroItem.scss',
    '../../components/deletion-overlay/DeletionOverlay.scss',
    '../../components/count-separator/CountSeparator.scss',
    '../../components/floating-character-countdown/FloatingCharacterCountdown.scss',
    '../../components/retro-item/upvote-button/UpvoteButton.scss',
    '../../components/action-item/date-created/DateCreated.scss',
    '../../components/action-item/assignee/Assignee.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ReactRetroPageWrapper implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild(containerElementName, { static: false }) containerRef: ElementRef;

  constructor(private angularRoute: ActivatedRoute) {}

  ngOnChanges(): void {
    this.render();
  }

  ngAfterViewInit() {
    this.render();
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render() {
    ReactDOM.render(
      <React.StrictMode>
        <RecoilRoot>
          <RetroPage teamId={this.angularRoute.snapshot.params['teamId'] as string} />
        </RecoilRoot>
      </React.StrictMode>,
      this.containerRef.nativeElement
    );
  }
}
