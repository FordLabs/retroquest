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
import { WebsocketService } from '../../services/websocket.service';
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
import { createMockRxStompService } from '../../../utils/testutils';

describe('TeamPageComponent', () => {
  let component: TeamPageComponent;

  let dataService: DataService;
  let websocketService: WebsocketService;
  let saveCheckerService: SaveCheckerService;
  let boardService: BoardService;
  let columnAggregationService: ColumnAggregationService;
  let teamService: TeamService;

  const fakeTeamId = 'team-id';

  const spiedStompService = createMockRxStompService();

  beforeEach(() => {
    dataService = new DataService();
    columnAggregationService = mock(ColumnAggregationService);
    teamService = mock(TeamService);
    websocketService = mock(WebsocketService);
    boardService = mock(BoardService);
    saveCheckerService = mock(SaveCheckerService);

    component = new TeamPageComponent(
      dataService,
      instance(teamService),
      instance(websocketService),
      null,
      instance(boardService),
      instance(columnAggregationService),
      null,
      spiedStompService
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

    describe('opening the websocket', () => {
      beforeEach(() => {
        when(websocketService.openWebsocket()).thenReturn(of());
        when(websocketService.heartbeatTopic()).thenReturn(of());
        when(websocketService.columnTitleTopic()).thenReturn(of());
        when(websocketService.endRetroTopic()).thenReturn(of());
      });

      it('should open the websocket if the state is closed', () => {
        when(websocketService.getWebsocketState()).thenReturn(WebSocket.CLOSED);

        component.ngOnInit();
        verify(websocketService.openWebsocket()).called();
      });

      it('should not open the websocket if the state is already opened', () => {
        when(websocketService.getWebsocketState()).thenReturn(WebSocket.OPEN);

        component.ngOnInit();
        verify(websocketService.openWebsocket()).never();
      });

      it('should resubscribe to the websocket', () => {
        when(websocketService.getWebsocketState()).thenReturn(WebSocket.OPEN);

        component.ngOnInit();
        verify(websocketService.heartbeatTopic()).called();
        verify(websocketService.columnTitleTopic()).called();
        verify(websocketService.endRetroTopic()).called();
      });

      it('Should subscribe to the Thoughts topic', () => {
        component.ngOnInit();
        expect(spiedStompService.watch).toHaveBeenCalledWith(
          `/topic/${dataService.team.id}/thoughts`
        );
      });

      it('Should subscribe to the action items topic', () => {
        component.ngOnInit();
        expect(spiedStompService.watch).toHaveBeenCalledWith(
          `/topic/${dataService.team.id}/action-items`
        );
      });
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

      verify(websocketService.endRetro()).called();
    });
  });
});
