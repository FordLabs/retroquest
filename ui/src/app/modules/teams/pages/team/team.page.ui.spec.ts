/*
 * Copyright (c) 2021 Ford Motor Company
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

import { render, RenderResult } from '@testing-library/angular';
import { TeamPageComponent } from './team.page';
import {
  createMockHttpClient,
  createMockRxStompService,
  createMockTeamService,
} from '../../../utils/testutils';
import { TeamsModule } from '../../teams.module';
import { TeamService } from '../../services/team.service';
import { DataService } from '../../../data.service';
import { SaveCheckerService } from '../../services/save-checker.service';
import { BoardService } from '../../services/board.service';
import { of } from 'rxjs/internal/observable/of';
import { Board } from '../../../domain/board';
import { ColumnAggregationService } from '../../services/column-aggregation.service';
import { ActionItemService } from '../../services/action.service';
import { HttpClient } from '@angular/common/http';
import { RxStompService } from '@stomp/ng2-stompjs';

describe('Setting up Team Board', () => {
  let mockTeamService;
  let dataService: DataService;
  let boardService: BoardService;
  let columnAggregationService: ColumnAggregationService;
  let actionItemService: ActionItemService;

  const teamId = 'have-fun';
  const teamName = 'Have Fun';

  async function createComponent(): Promise<RenderResult<TeamPageComponent>> {
    return render(TeamPageComponent, {
      imports: [TeamsModule],
      excludeComponentDeclaration: true,
      providers: [
        {
          provide: DataService,
          useValue: dataService,
        },
        {
          provide: TeamService,
          useValue: mockTeamService,
        },
        {
          provide: SaveCheckerService,
          useValue: new SaveCheckerService(),
        },
        {
          provide: BoardService,
          useValue: new SaveCheckerService(),
        },
        {
          provide: ColumnAggregationService,
          useValue: columnAggregationService,
        },
        {
          provide: ActionItemService,
          useValue: actionItemService,
        },
        {
          provide: HttpClient,
          useValue: createMockHttpClient(),
        },
        {
          provide: RxStompService,
          useValue: createMockRxStompService(),
        },
      ],
    });
  }

  beforeEach(async () => {
    dataService = new DataService();
    dataService.team.id = teamId;
    dataService.team.name = teamName;

    mockTeamService = createMockTeamService();

    boardService = {
      createBoard: jest.fn().mockReturnValue(of(new Board())),
    } as unknown as BoardService;

    actionItemService = {
      archiveActionItems: jest.fn(),
    } as unknown as ActionItemService;
  });

  describe('Normal Scenario - 3 thought columns, 1 Action Item column', () => {
    const columns = [
      {
        id: 11,
        items: {
          active: [
            {
              id: 1000,
              message: 'Comment 1',
              hearts: 2,
              topic: 'happy',
              discussed: false,
              teamId,
              columnTitle: {
                id: 11,
                topic: 'happy',
                title: 'Happy',
                teamId,
              },
              boardId: null,
            },
          ],
          completed: [
            {
              id: 1001,
              message: 'Comment 2',
              hearts: 5,
              topic: 'happy',
              discussed: true,
              teamId,
              columnTitle: {
                id: 11,
                topic: 'happy',
                title: 'Happy',
                teamId,
              },
              boardId: null,
            },
          ],
        },
        title: 'Happy',
        topic: 'Happy',
      },
      {
        id: 12,
        items: {
          active: [],
          completed: [],
        },
        title: 'Confused',
        topic: 'confused',
      },
      {
        id: 13,
        items: {
          active: [],
          completed: [],
        },
        title: 'Sad',
        topic: 'unhappy',
      },
      {
        id: 14,
        items: {
          active: [],
          completed: [],
        },
        title: 'Action Items',
        topic: 'action',
      },
    ];

    let component: RenderResult<TeamPageComponent>;

    beforeEach(async () => {
      columnAggregationService = {
        getColumns: jest.fn().mockReturnValue(of({ columns })),
      } as unknown as ColumnAggregationService;

      component = await createComponent();

      document.body.appendChild(component.container);
    });

    describe('Happy Column', () => {
      let happy;

      beforeEach(() => {
        happy = component.getByText('Happy');
      });

      it('Creates a column with title Happy', () => {
        expect(happy).toBeVisible();
      });

      describe('Comment 1', () => {
        let textArea;
        let rqTask;
        let starCount;
        let checkbox;

        beforeEach(() => {
          textArea = component.getByDisplayValue('Comment 1');
          rqTask = textArea.parentElement.parentElement;
          starCount = rqTask.querySelector('div.star-count');
          checkbox = rqTask.querySelector('div.checkbox');
        });

        it('Has a comment named Comment 1', () => {
          expect(textArea).toBeVisible();
        });

        it('Comment 1 has 2 stars', () => {
          expect(starCount.innerHTML.trim()).toEqual('2');
        });

        it('Comment is not checked', () => {
          expect(checkbox).toBeVisible();
        });
      });

      describe('Comment 2', () => {
        let textArea;
        let rqTask;
        let starCount;
        let checkbox;

        beforeEach(() => {
          textArea = component.getByDisplayValue('Comment 2');
          rqTask = textArea.parentElement.parentElement;
          starCount = rqTask.querySelector('div.star-count');
          checkbox = rqTask.querySelector('div.checkbox.completed-task');
        });

        it('Has a comment named Comment 2', () => {
          expect(textArea).toBeVisible();
        });

        it('Comment 1 has 2 stars', () => {
          expect(starCount.innerHTML.trim()).toEqual('5');
        });

        it('Comment is not checked', () => {
          expect(checkbox).toBeVisible();
        });
      });
    });

    it('Creates a column with title Confused', () => {
      expect(component.getByText('Confused')).toBeVisible();
    });

    it('Creates a column with title Happy', () => {
      expect(component.getByText('Sad')).toBeVisible();
    });

    it('Creates a column with title Action Item', () => {
      expect(component.getByText('Action Items')).toBeVisible();
    });
  });
});
