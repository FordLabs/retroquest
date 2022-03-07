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

import { TeamState } from '../../state/TeamState';

import ArchivesPage from './ArchivesPage';

const containerElementName = 'archivesPageWrapper';

@Component({
  selector: 'archives-page-wrapper',
  template: `<span #${containerElementName}></span>`,
  styleUrls: [
    './ArchivesPage.scss',
    './thought-archives/ArchivedBoardsList.scss',
    './thought-archives/ArchivedBoardTile.scss',
    './thought-archives/ArchivedBoardColumn.scss',
    './thought-archives/ArchivedBoard.scss',
    './archives-subheader/ArchivesSubheader.scss',
    './action-item-archives/ActionItemArchives.scss',
    '../../components/column-header/ColumnHeader.scss',
    '../../components/count-separator/CountSeparator.scss',
    '../../components/upvote-count/UpvoteCount.scss',
    '../../components/action-item/date-created/DateCreated.scss',
    '../../components/not-found-section/NotFoundSection.scss',
    '../../components/action-item/assignee/Assignee.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ArchivesPageWrapper implements OnChanges, OnDestroy, AfterViewInit {
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
        <RecoilRoot
          initializeState={({ set }) => {
            set(TeamState, { name: '', id: this.angularRoute.parent.snapshot.params['teamId'] as string });
          }}
        >
          <ArchivesPage />
        </RecoilRoot>
      </React.StrictMode>,
      this.containerRef.nativeElement
    );
  }
}
