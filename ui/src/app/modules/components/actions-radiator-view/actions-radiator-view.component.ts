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

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DataService } from '../../data.service';
import { ActionItem } from '../../domain/action-item';
import { Themes } from '../../domain/Theme';
import { ActionItemService } from '../../teams/services/action.service';

const ESC_KEY = 27;

@Component({
  selector: 'rq-actions-radiator-view',
  templateUrl: './actions-radiator-view.component.html',
  styleUrls: ['./actions-radiator-view.component.scss'],
  host: {
    '[style.display]': 'visible ? "flex": "none"',
  },
})
export class ActionsRadiatorViewComponent implements OnInit, OnDestroy {
  @Input() visible = true;
  @Input() theme;
  @Input() teamId: string;

  @Output() visibilityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  actionItems: Array<ActionItem>;

  timeOutInterval = 1000 * 75;
  scrollInterval = 1000 * 25;
  pageIsAutoScrolling = false;
  scrollingIntervalId: any = null;

  constructor(private actionItemService: ActionItemService, private dataService: DataService) {}

  ngOnInit(): void {
    this.teamId = this.dataService.team.id;
    this.theme = this.dataService.theme;

    this.dataService.themeChanged.subscribe((theme) => (this.theme = theme));

    this.actionItemService.fetchActionItems(this.teamId).subscribe((actionItems) => {
      this.actionItems = actionItems.filter((action) => !action.completed);
    });
  }

  ngOnDestroy(): void {
    this.toggleAutoScroll();
    this.scrollToTopOfPage();
    this.resetScroll();
  }

  get darkThemeIsEnabled(): boolean {
    return this.theme === Themes.Dark;
  }

  private getRootPage() {
    return document.querySelector('rq-sub-app') || document.querySelector('react-header-component-wrapper');
  }

  private scrollToTopOfPage() {
    const rootPage = this.getRootPage();
    rootPage.animate({ scrollTop: 0 }, this.scrollInterval);
  }

  private scrollToBottomOfPage() {
    const rootPage = this.getRootPage();
    if (rootPage[0]) {
      rootPage.animate({ scrollTop: rootPage[0].scrollHeight }, this.scrollInterval);
    }
  }

  public autoScrollPage() {
    this.scrollToTopWithoutAnimation();
    this.scrollToBottomOfPage();
    this.scrollToTopOfPage();

    this.scrollingIntervalId = window.setInterval(() => {
      this.scrollToBottomOfPage();
      this.scrollToTopOfPage();
    }, this.timeOutInterval);
  }

  public hide(): void {
    this.visible = false;
    this.visibilityChanged.emit(this.visible);
    document.onkeydown = null;
  }

  public show(): void {
    this.visible = true;
    document.onkeydown = (event) => {
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
        const rootPage = this.getRootPage();
        rootPage.getAnimations().forEach((animation) => animation.cancel());
        window.clearInterval(this.scrollingIntervalId);
        this.scrollingIntervalId = null;
      }
    }
  }

  public resetScroll(): void {
    this.pageIsAutoScrolling = false;

    const rootPage = this.getRootPage();
    rootPage.getAnimations().forEach((animation) => animation.cancel());

    window.clearInterval(this.scrollingIntervalId);

    this.scrollingIntervalId = null;
  }

  private scrollToTopWithoutAnimation() {
    const rootPage = this.getRootPage();
    rootPage.animate({ scrollTop: 0 }, 0);
  }
}
