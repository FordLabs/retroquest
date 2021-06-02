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

import { TeamPageComponent } from './team.page';
import { BoardService } from '../../services/board.service';
import { ColumnAggregationService } from '../../services/column-aggregation.service';
import { of } from 'rxjs';
import { ColumnCombinerResponse } from '../../../domain/column-combiner-response';
import { TeamService } from '../../services/team.service';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { emptyThought } from '../../../domain/thought';
import { emptyColumnResponse } from '../../../domain/column-response';
import { DataService } from '../../../data.service';
import { SaveCheckerService } from '../../services/save-checker.service';
import {
  createMockRxStompService,
  createMockSubscription,
} from '../../../utils/testutils';
import { EndRetroService } from '../../services/end-retro.service';
import { SubscriptionService } from '../../services/subscription.service';
import { RxStompService } from '@stomp/ng2-stompjs';

describe('TeamPageComponent', () => {
  let component: TeamPageComponent;

  let dataService: DataService;
  let saveCheckerService: SaveCheckerService;
  let boardService: BoardService;
  let columnAggregationService: ColumnAggregationService;
  let teamService: TeamService;
  let endRetroService: EndRetroService;
  let subscriptionService: SubscriptionService;

  const fakeTeamId = 'team-id';

  beforeEach(() => {
    dataService = new DataService();
    columnAggregationService = mock(ColumnAggregationService);
    teamService = mock(TeamService);
    boardService = mock(BoardService);
    saveCheckerService = mock(SaveCheckerService);
    endRetroService = mock(EndRetroService);
    subscriptionService = new SubscriptionService(
      dataService,
      saveCheckerService,
      createMockRxStompService()
    );

    component = new TeamPageComponent(
      dataService,
      instance(boardService),
      instance(columnAggregationService),
      null,
      instance(endRetroService),
      subscriptionService
    );
  });

  describe('ngOnInit', () => {
    const expectedColumns: ColumnCombinerResponse = {
      columns: [
        {
          id: 1,
          items: { active: [], completed: [] },
          title: 'Happy',
          topic: 'happy',
        },
      ],
    };
    const expectedTeamName = 'team-name';

    beforeEach(() => {
      dataService.team.name = expectedTeamName;
      dataService.team.id = fakeTeamId;
      when(columnAggregationService.getColumns(fakeTeamId)).thenReturn(
        of(expectedColumns)
      );
      when(teamService.fetchTeamName(fakeTeamId)).thenReturn(
        of(expectedTeamName)
      );
    });

    it('should set the team id', () => {
      component.ngOnInit();
      expect(component.teamId).toEqual(fakeTeamId);
    });

    it('should set the columns aggregation', () => {
      component.ngOnInit();
      expect(component.columnsAggregation).toEqual(expectedColumns.columns);
    });

    it('should set the team name', () => {
      component.ngOnInit();
      expect(component.teamName).toEqual(expectedTeamName);
    });

    describe('Subscriptions', () => {
      it('Should subscribe to the Thoughts topic', () => {
        const spy = jest.spyOn(subscriptionService, 'subscribeToThoughts');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledWith(component.thoughtChanged);
      });

      it('Should subscribe to the action items topic', () => {
        const spy = jest.spyOn(subscriptionService, 'subscribeToActionItems');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledWith(component.actionItemChanged);
      });

      it('Should subscribe to the column title topic', () => {
        const spy = jest.spyOn(subscriptionService, 'subscribeToColumnTitles');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledWith(component.columnChanged);
      });

      it('Should subscribe to the end retro topic', () => {
        const spy = jest.spyOn(subscriptionService, 'subscribeToEndRetro');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledWith(component.retroEnded);
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('should close subscriptions', () => {
      const spy = jest.spyOn(subscriptionService, 'closeSubscriptions');
      component.ngOnDestroy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onEndRetro', () => {
    const expectedThoughts = [emptyThought(), emptyThought()];

    beforeEach(() => {
      component.teamId = fakeTeamId;

      expectedThoughts[0].discussed = false;
      expectedThoughts[0].id = 0;

      expectedThoughts[1].discussed = true;
      expectedThoughts[1].id = 1;

      when(boardService.createBoard(anything(), anything())).thenReturn(
        of(null)
      );
    });

    it('should create a board if there are thoughts to archive', () => {
      component.columnsAggregation = [emptyColumnResponse()];
      component.columnsAggregation[0].items.active = [expectedThoughts[0]];
      component.columnsAggregation[0].items.completed = [expectedThoughts[1]];

      component.onEndRetro();
      verify(boardService.createBoard(anything(), anything())).called();
    });

    it('should not create a board if there are no thoughts to archive', () => {
      component.columnsAggregation = [emptyColumnResponse()];

      component.onEndRetro();
      verify(boardService.createBoard(anything(), anything())).never();
    });

    it('should emit the end retro event to the websocket', () => {
      component.columnsAggregation = [emptyColumnResponse()];
      component.columnsAggregation[0].items.active = [expectedThoughts[0]];

      component.onEndRetro();

      verify(endRetroService.endRetro()).called();
    });
  });
});
