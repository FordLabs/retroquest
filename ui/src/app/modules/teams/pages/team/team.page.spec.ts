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
import {Column} from '../../../domain/column';
import {emptyThought, Thought} from '../../../domain/thought';
import {TeamService} from '../../services/team.service';
import {ThoughtService} from '../../services/thought.service';
import {ColumnService} from '../../services/column.service';
import {ActionItemService} from '../../services/action.service';
import {WebsocketService} from '../../services/websocket.service';
import {ActionItem, emptyActionItem} from '../../../domain/action-item';
import * as moment from 'moment';
import {SaveCheckerService} from "../../services/save-checker.service";

describe('TeamPageComponent', () => {

  let mockActiveRoute;
  let mockTeamService: TeamService;
  let mockThoughtService: ThoughtService;
  let mockActionItemService: ActionItemService;
  let mockColumnService: ColumnService;
  let mockWebsocketService: WebsocketService;
  let mockSaveCheckerService: SaveCheckerService;

  let heartbeatTopic: Subject<any>;
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
    heartbeatTopic = new Subject<any>();
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

      heartbeatTopic: heartbeatTopic,
      thoughtsTopic: thoughtsTopic,
      actionItemTopic: actionItemTopic,
      columnTitleTopic: columnTitleTopic,

      sendHeartbeat: null,
    });

    mockSaveCheckerService = jasmine.createSpyObj({
      updateTimestamp: null
    });

    component = new TeamPageComponent(
      mockActiveRoute,
      mockTeamService,
      mockThoughtService,
      mockColumnService,
      mockActionItemService,
      mockWebsocketService,
      mockSaveCheckerService
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

    it('should send a heartbeat with a open connected', () => {
      mockWebsocketService.getWebsocketState = () => WebSocket.OPEN;
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});

      expect(mockWebsocketService.sendHeartbeat).toHaveBeenCalled();
    });

    it('should not open the websocket if it is already opened', () => {
      mockWebsocketService.getWebsocketState = () => WebSocket.OPEN;
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});

      expect(mockWebsocketService.openWebsocket).not.toHaveBeenCalled();
    });

    it('should call heartbeatTopic', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      expect(mockWebsocketService.heartbeatTopic).toHaveBeenCalled();
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

    it('should update the save checker timestamp when any thought message is recieved successfully', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      thoughtsTopic.next({bodyJson: {type: 'put', payload: {id: 1, columnTitle: {id: 1}}, body: ''}});
      expect(mockSaveCheckerService.updateTimestamp).toHaveBeenCalled();
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

    it('should update the save checker timestamp when any thought message is recieved successfully', () => {
      component.ngOnInit();
      mockActiveRoute.params.next({teamId: 1});
      (mockWebsocketService.openWebsocket('team1') as Subject<any>).next({bodyJson: {}});

      actionItemTopic.next({
        bodyJson: {
          type: 'post',
          payload: {}
        }
      });

      expect(mockSaveCheckerService.updateTimestamp).toHaveBeenCalled();
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

      const updatedActionItem = {
        'id': 1,
        'task': 'hi phil',
        'completed': false,
        'teamId': 'test',
        'assignee': '',
        state: 'active'
      };
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

  describe('actionItemsIndexIsSelected', () => {

    it('should return true if the selected index is 3', () => {
      const fakeIndex = 3;
      component.setSelectedIndex(fakeIndex);
      expect(component.actionItemsIndexIsSelected()).toBeTruthy();
    });

    it('should return false if the selected index is not 3', () => {
      const fakeIndex = 2;
      component.setSelectedIndex(fakeIndex);
      expect(component.actionItemsIndexIsSelected()).toBeFalsy();
    });
  });

  describe('getActionItems', () => {

    const nullDateActionItem = emptyActionItem();
    const earliestActionItem = emptyActionItem();
    const middleActionItem = emptyActionItem();
    const latestActionItem = emptyActionItem();

    beforeEach(() => {
      nullDateActionItem.id = 4;
      nullDateActionItem.dateCreated = null;

      earliestActionItem.id = 1;
      earliestActionItem.dateCreated = moment().format();

      middleActionItem.id = 2;
      middleActionItem.dateCreated = moment().subtract(1, 'd').format();

      latestActionItem.id = 3;
      latestActionItem.dateCreated = moment().subtract(2, 'd').format();

      component.actionItems = [
        latestActionItem,
        earliestActionItem,
        middleActionItem
      ];
    });

    it('should default to returning an unsorted list', () => {
      const actionItems = component.getActionItems();
      expect(actionItems[0].id).toEqual(3);
      expect(actionItems[1].id).toEqual(1);
      expect(actionItems[2].id).toEqual(2);
    });

    it('should return a decending sorted list of action items', () => {
      component.actionItemsAreSorted = true;
      const actionItems = component.getActionItems();
      expect(actionItems[0].id).toEqual(1);
      expect(actionItems[1].id).toEqual(2);
      expect(actionItems[2].id).toEqual(3);
    });

    it('should return a unsort a previously sorted list of action items', () => {
      component.actionItemsAreSorted = true;
      component.getActionItems();

      component.actionItemsAreSorted = false;
      const actionItems = component.getActionItems();
      expect(actionItems[0].id).toEqual(3);
      expect(actionItems[1].id).toEqual(1);
      expect(actionItems[2].id).toEqual(2);
    });

    it('should return a decending sorted list of action items with null dates at the bottom', () => {
      component.actionItems = [
        latestActionItem,
        earliestActionItem,
        nullDateActionItem,
        middleActionItem
      ];

      component.actionItemsAreSorted = true;
      const actionItems = component.getActionItems();
      expect(actionItems[0].id).toEqual(1);
      expect(actionItems[1].id).toEqual(2);
      expect(actionItems[2].id).toEqual(3);
      expect(actionItems[3].id).toEqual(nullDateActionItem.id);
    });

  });

  describe('onActionItemsSortChanged', () => {

    it('should set the sort flag on action items to true', () => {
      component.onActionItemsSortChanged(true);
      expect(component.actionItemsAreSorted).toBeTruthy();
    });

    it('should set the sort flag on action items to false', () => {
      component.onActionItemsSortChanged(true);
      component.onActionItemsSortChanged(false);
      expect(component.actionItemsAreSorted).toBeFalsy();
    });
  });

  describe('unsortedAndUncompletedActionItems', () => {

    beforeEach(() => {
      component.actionItems = [emptyActionItem(), emptyActionItem(), emptyActionItem()];
      component.actionItems[1].completed = true;
    });

    it('should return the list of action items that are unsorted and not completed', () => {
      expect(component.unsortedAndUncompletedActionItems.length).toEqual(2);
    });
  });
});
