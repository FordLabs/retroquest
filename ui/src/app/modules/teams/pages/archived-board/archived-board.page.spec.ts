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

import {Observable, Subject} from 'rxjs/index';
import {Column} from '../../../domain/column';
import {emptyThought, Thought} from '../../../domain/thought';
import {TeamService} from '../../services/team.service';
import {ThoughtService} from '../../services/thought.service';
import {ColumnService} from '../../services/column.service';
import {SaveCheckerService} from '../../services/save-checker.service';
import {BoardService} from '../../services/board.service';
import {ArchivedBoardPageComponent} from './archived-board.page';

describe('ArchivedBoardPageComponent', () => {

  let mockActiveRoute;
  let mockTeamService: TeamService;
  let mockThoughtService: ThoughtService;
  let mockColumnService: ColumnService;
  let mockSaveCheckerService: SaveCheckerService;
  let mockBoardService: BoardService;

  let heartbeatTopic: Subject<any>;
  let thoughtsTopic: Subject<any>;
  let actionItemTopic: Subject<any>;
  let columnTitleTopic: Subject<any>;

  let createBoardSubject: Subject<any>;

  let component: ArchivedBoardPageComponent;

  const testColumn: Column = {
    id: 1,
    topic: 'happy',
    title: 'title',
    teamId: 'team-id',
    sorted: false
  };

  const fakeThoughtWithTestTopic = () => {
    const thought: Thought = emptyThought();
    thought.topic = testColumn.topic;
    return thought;
  };

  beforeEach((() => {
    heartbeatTopic = new Subject<any>();
    thoughtsTopic = new Subject<any>();
    actionItemTopic = new Subject<any>();
    columnTitleTopic = new Subject<any>();

    createBoardSubject = new Subject();

    mockActiveRoute = {params: new Subject()};
    mockTeamService = jasmine.createSpyObj({fetchTeamName: new Observable()});
    mockThoughtService = jasmine.createSpyObj({fetchThoughts: new Observable()});
    mockThoughtService.resetThoughtsObserver = jasmine.createSpyObj({subscribe: null});

    mockColumnService = jasmine.createSpyObj({
      fetchColumns: new Observable(),
      updateColumn: new Observable()
    });

    mockSaveCheckerService = jasmine.createSpyObj({
      updateTimestamp: null
    });

    mockBoardService = jasmine.createSpyObj({
      createBoard: createBoardSubject
    });

    component = new ArchivedBoardPageComponent(
      mockActiveRoute,
      mockTeamService,
      mockThoughtService,
      mockColumnService,
      mockBoardService
    );

    component.columns = [];
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getColumnThoughtCount', () => {
    it('should return count of non-discussed thoughts', () => {
      const discussedThought = emptyThought();
      discussedThought.discussed = true;
      discussedThought.topic = testColumn.topic;

      component.thoughtsArray = [
        discussedThought,
        fakeThoughtWithTestTopic(),
        fakeThoughtWithTestTopic()
      ];

      component.columns.push(testColumn);

      const thoughtCount = component.getColumnThoughtCount(testColumn);

      expect(thoughtCount).toEqual(2);
    });
  });

  describe('getThoughtsInColumn', () => {

    it('should return an empty list of no thoughts are in the list', () => {
      const actualThoughts = component.getThoughtsInColumn(testColumn);
      expect(actualThoughts.length).toBe(0);
    });

    it('should return thoughts for given column', () => {

      const testThoughts: Array<Thought> = [
        fakeThoughtWithTestTopic(),
        fakeThoughtWithTestTopic(),
        fakeThoughtWithTestTopic()
      ];

      component.columns.push(testColumn);
      component.thoughtsArray = testThoughts;

      const thoughts = component.getThoughtsInColumn(testColumn);
      expect(thoughts).toEqual(testThoughts);
    });

    it('should return sorted thoughts if the given column is sorted', () => {

      testColumn.sorted = true;

      const thought1 = fakeThoughtWithTestTopic();
      const thought2 = fakeThoughtWithTestTopic();
      const thought3 = fakeThoughtWithTestTopic();

      thought1.hearts = 0;
      thought2.hearts = 3;
      thought3.hearts = 2;

      const testThoughts: Array<Thought> = [
        thought1,
        thought2,
        thought3
      ];

      component.columns.push(testColumn);
      component.thoughtsArray = testThoughts;

      const thoughts = component.getThoughtsInColumn(testColumn);

      expect(thoughts[0].hearts).toEqual(3);
      expect(thoughts[1].hearts).toEqual(2);
      expect(thoughts[2].hearts).toEqual(0);
    });

    it('should return unsorted thoughts if the given column is unsorted', () => {

      testColumn.sorted = false;

      const thought1 = fakeThoughtWithTestTopic();
      const thought2 = fakeThoughtWithTestTopic();
      const thought3 = fakeThoughtWithTestTopic();

      thought1.hearts = 0;
      thought2.hearts = 3;
      thought3.hearts = 2;

      const testThoughts: Array<Thought> = [
        thought1,
        thought2,
        thought3
      ];

      component.columns.push(testColumn);
      component.thoughtsArray = testThoughts;

      const thoughts = component.getThoughtsInColumn(testColumn);

      expect(thoughts[0].hearts).toEqual(0);
      expect(thoughts[1].hearts).toEqual(3);
      expect(thoughts[2].hearts).toEqual(2);
    });
  });

  describe('isSelectedIndex', () => {
    it('should have a default selected index of 0', () => {
      const result = component.isSelectedIndex(0);
      expect(result).toBeTruthy();
    });

    it('should return false when the index passed in is not the selected index', () => {
      const fakeIndex = 1;
      component.selectedIndex = 0;
      const result = component.isSelectedIndex(fakeIndex);
      expect(result).toBeFalsy();
    });

    it('should return true when the index passed in is the selected index', () => {
      const fakeIndex = 0;
      component.selectedIndex = 0;
      const result = component.isSelectedIndex(fakeIndex);
      expect(result).toBeTruthy();
    });
  });

  describe('setSelectedIndex', () => {
    it('should set the selected index to the index passed in', () => {
      const fakeIndex = 2;
      component.setSelectedIndex(fakeIndex);
      expect(component.selectedIndex).toEqual(fakeIndex);
    });
  });
});
