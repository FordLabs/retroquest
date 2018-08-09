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

import {TeamPageComponent} from './team.page';
import {Observable, Subject} from 'rxjs/index';
import {Column} from '../../domain/column';
import {emptyThought, Thought} from '../../domain/thought';
import {TeamService} from '../../services/team.service';
import {ThoughtService} from '../../services/thought.service';
import {ColumnService} from '../../services/column.service';
import {ActionItemService} from '../../services/action.service';
import {WebsocketService} from '../../services/websocket.service';
import {ActionItem, emptyActionItem} from '../../domain/action-item';

describe('TeamPageComponent', () => {

  let mockActiveRoute;
  let mockTeamService: TeamService;
  let mockThoughtService: ThoughtService;
  let mockActionItemService: ActionItemService;
  let mockColumnService: ColumnService;
  let mockWebsocketService: WebsocketService;

  let thoughtsTopic: Subject<any>;
  let actionItemTopic: Subject<any>;
  let columnTitleTopic: Subject<any>;

  let component;

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
    thoughtsTopic = new Subject<any>();
    actionItemTopic = new Subject<any>();
    columnTitleTopic = new Subject<any>();

    mockActiveRoute = {params: new Subject()};
    mockTeamService = jasmine.createSpyObj({fetchTeamName: new Observable()});
    mockThoughtService = jasmine.createSpyObj({fetchThoughts: new Observable()});
    mockThoughtService.resetThoughtsObserver = jasmine.createSpyObj({subscribe: null});

    mockActionItemService = jasmine.createSpyObj({fetchActionItems: new Observable()});
    mockColumnService = jasmine.createSpyObj({
      fetchColumns: new Observable(),
      updateColumn: new Observable()
    });
    mockWebsocketService = jasmine.createSpyObj({
      openWebsocket: new Subject(),
      closeWebsocket: null,
      getWebsocketState: WebSocket.CLOSED,

      thoughtsTopic: thoughtsTopic,
      actionItemTopic: actionItemTopic,
      columnTitleTopic: columnTitleTopic
    });

    component = new TeamPageComponent(
      mockActiveRoute,
      mockTeamService,
      mockThoughtService,
      mockColumnService,
      mockActionItemService,
      mockWebsocketService);

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

  describe('getActionItemColumnCount', () => {
    it('should return count of non-discussed action items', () => {
      const completedActionItem = emptyActionItem();
      completedActionItem.completed = true;

      const testThoughts: Array<ActionItem> = [
        completedActionItem,
        emptyActionItem(),
        emptyActionItem()
      ];

      component.actionItems = testThoughts;

      const actualCount = component.getActionItemColumnCount();

      expect(actualCount).toEqual(2);
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

  describe('ngOnInit', () => {

    const mockWindow = {
      setInterval: (fn) => fn()
    };

    beforeEach(() => {
      component.globalWindowRef = mockWindow;
    });

    it('should call open websocket', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});

      expect(mockWebsocketService.openWebsocket).toHaveBeenCalled();
    });

    it('should call not open the websocket if it is already opened', () => {
      mockWebsocketService.getWebsocketState = () => WebSocket.OPEN;
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});

      expect(mockWebsocketService.openWebsocket).not.toHaveBeenCalled();
    });

    it('should call thoughtsTopic', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(mockWebsocketService.thoughtsTopic).toHaveBeenCalled();
    });

    it('should call actionItemTopic', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(mockWebsocketService.actionItemTopic).toHaveBeenCalled();
    });

    it('should add thoughts when a message is received', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(component.thoughtsArray.length).toEqual(0);

      thoughtsTopic.next({bodyJson: {type: 'put', payload: {id: 1, columnTitle: {id: 1}}, body: ''}});
      expect(component.thoughtsArray.length).toEqual(1);
    });

    it('should delete thoughts when delete message is received', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(component.thoughtsArray.length).toEqual(0);

      thoughtsTopic.next({bodyJson: {type: 'post', payload: {id: 1, columnTitle: {id: 1}}, body: ''}});
      expect(component.thoughtsArray.length).toEqual(1);

      thoughtsTopic.next({bodyJson: {type: 'delete', payload: 1}});
      expect(component.thoughtsArray.length).toEqual(0);
    });

    it('should delete all thoughts when delete message is received with -1', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(component.thoughtsArray.length).toEqual(0);

      thoughtsTopic.next({bodyJson: {type: 'post', payload: {id: 1, columnTitle: {id: 1}}, body: ''}});
      thoughtsTopic.next({bodyJson: {type: 'post', payload: {id: 2, columnTitle: {id: 2}}, body: ''}});
      expect(component.thoughtsArray.length).toEqual(2);

      thoughtsTopic.next({bodyJson: {type: 'delete', payload: -1}});
      expect(component.thoughtsArray.length).toEqual(0);
    });

    it('should delete action items when delete message is recieved', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(component.actionItems.length).toEqual(0);
      actionItemTopic.next({
        bodyJson: {
          type: 'post',
          payload: {'id': 1, 'task': 'hi', 'completed': false, 'teamId': 'test', 'assignee': ''}
        }
      });

      expect(component.actionItems.length).toEqual(1);

      actionItemTopic.next({bodyJson: {type: 'delete', payload: 1}});
      expect(component.actionItems.length).toEqual(0);

    });

    it('should add action items when a message is received', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(component.actionItems.length).toEqual(0);

      actionItemTopic.next({
        bodyJson: {
          type: 'post',
          payload: {'id': 1, 'task': 'hi', 'completed': false, 'teamId': 'test', 'assignee': ''}
        }
      });

      expect(component.actionItems.length).toEqual(1);
    });

    it('should update action items when a message is received', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(component.actionItems.length).toEqual(0);

      actionItemTopic.next({
        bodyJson: {
          type: 'post',
          payload: {'id': 1, 'task': 'hi', 'completed': false, 'teamId': 'test', 'assignee': ''}
        }
      });

      expect(component.actionItems.length).toEqual(1);

      const updatedActionItem = {'id': 1, 'task': 'hi phil', 'completed': false, 'teamId': 'test', 'assignee': ''};
      actionItemTopic.next({bodyJson: {type: 'put', payload: updatedActionItem}});

      expect(component.actionItems.length).toEqual(1);
      expect(component.actionItems[0]).toEqual(updatedActionItem);

    });

    it('should subscribe to the resetThoughts event on the thoughts service', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});

      expect(mockThoughtService.resetThoughtsObserver.subscribe).toHaveBeenCalled();
    });
  });

  describe('resetThoughts', () => {
    it('should clear the thoughts map', () => {
      component.thoughtsArray = [emptyThought()];
      component.resetThoughts();
      expect(component.thoughtsArray.length).toEqual(0);
    });
  });

  describe('onEndRetro', () => {
    it('should delete all thoughts', () => {
      component.thoughtService = jasmine.createSpyObj({
        deleteAllThoughts: null
      });
      component.onEndRetro();
      expect(component.thoughtService.deleteAllThoughts).toHaveBeenCalled();
    });
  });
});
