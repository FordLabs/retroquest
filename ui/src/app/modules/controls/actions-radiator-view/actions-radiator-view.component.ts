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

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionItem} from '../../domain/action-item';
import * as $ from 'jquery';

const ESC_KEY = 27;

@Component({
  selector: 'rq-actions-radiator-view',
  templateUrl: './actions-radiator-view.component.html',
  styleUrls: ['./actions-radiator-view.component.scss'],
  host: {
    '[style.display]': 'visible ? "flex": "none"'
  }
})
export class ActionsRadiatorViewComponent {

  @Input() visible = false;
  timeOutInterval = 1000 * 75;
  scrollInterval = 1000 * 25;
  pageIsAutoScrolling = false;
  scrollingIntervalId: any = null;

  @Input() actionItems: Array<ActionItem>;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  private scrollToTopOfPage() {
    const rootPage = $('html');
    rootPage.animate(
      {scrollTop: 0},
      this.scrollInterval
    );
  }

  private scrollToBottomOfPage() {
    const rootPage = $('html');
    rootPage.animate(
      {scrollTop: rootPage[0].scrollHeight},
      this.scrollInterval
    );
  }

  public autoScrollPage() {
    this.scrollToTopWithoutAnimation();
    this.scrollToBottomOfPage();
    this.scrollToTopOfPage();

    this.scrollingIntervalId = window.setInterval(() => {
        this.scrollToBottomOfPage();
        this.scrollToTopOfPage();
      }, this.timeOutInterval
    );
  }


  public hide(): void {
    this.visible = false;
    this.visibilityChanged.emit(this.visible);
    document.onkeydown = null;
  }

  public show(): void {
    this.visible = true;
    document.onkeydown = event => {
      if (event.keyCode === ESC_KEY) {
        this.hide();
      }
    };
  }

  public toggleAutoScroll(): void {
    this.pageIsAutoScrolling = !this.pageIsAutoScrolling;
    if (this.pageIsAutoScrolling) {
      this.autoScrollPage();
    } else {
      if (this.scrollingIntervalId) {
        const rootPage = $('html');
        rootPage.stop(true);
        window.clearInterval(this.scrollingIntervalId);
        this.scrollingIntervalId = null;
      }
    }
  }

  public resetScroll(): void {
    this.pageIsAutoScrolling = false;

    const rootPage = $('html');
    rootPage.stop(true);

    window.clearInterval(this.scrollingIntervalId);

    this.scrollingIntervalId = null;
  }

  private scrollToTopWithoutAnimation() {
    const rootPage = $('html');
    rootPage.animate(
      {scrollTop: 0},
      0
    );
  }
}

