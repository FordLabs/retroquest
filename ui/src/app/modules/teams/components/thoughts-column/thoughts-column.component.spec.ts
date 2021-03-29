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

import { ThoughtsColumnComponent } from './thoughts-column.component';
import { Observable } from 'rxjs/index';
import { WebsocketResponse } from '../../../domain/websocket-response';
import { Thought } from '../../../domain/thought';

describe('ThoughtColumnComponent', () => {
  let component: ThoughtsColumnComponent;
  let mockThoughtService;

  let testThought;
  const topic = 'happy';

  beforeEach(() => {
    mockThoughtService = {
      deleteThought: jest.fn().mockReturnValue(new Observable()),
      discussThought: jest.fn().mockReturnValue(new Observable()),
      heartThought: jest.fn().mockReturnValue(new Observable()),
      updateThought: jest.fn().mockReturnValue(new Observable()),
    };

    component = new ThoughtsColumnComponent(mockThoughtService);
    component.thoughtAggregation.topic = topic;

    testThought = createThought(1, 'Test Thought');

    // component.thoughts = [testThought];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('discussThought', () => {
    it('should toggle the discussed flag', () => {
      component.discussThought(testThought);
      expect(testThought.discussed).toBeTruthy();
      component.discussThought(testThought);
      expect(testThought.discussed).toBeFalsy();
    });

    it('should call ThoughtService.discussThought', () => {
      component.discussThought(testThought);
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(
        testThought
      );
    });
  });

  describe('heartThought', () => {
    it('should increment the hearts count', () => {
      component.heartThought(testThought);
      expect(testThought.hearts).toEqual(1);
    });

    it('should call ThoughtService.setCurrentThought', () => {
      component.heartThought(testThought);
      expect(mockThoughtService.updateThought).toHaveBeenCalledWith(
        testThought
      );
    });
  });

  describe('process thought change', () => {
    let deleteThoughtSpy;
    let updateThoughtSpy;
    beforeEach(() => {
      deleteThoughtSpy = jest.spyOn(component, 'deleteThought');
      updateThoughtSpy = jest.spyOn(component, 'updateThought');
    });

    describe('Thought deleted', () => {
      const message: WebsocketResponse = {
        type: 'delete',
        payload: 14,
      };

      beforeEach(() => {
        component.processThoughtChange(message);
      });
      it('Should delete a thought', () => {
        const thoughtWithId = {
          id: 14,
        } as Thought;
        expect(deleteThoughtSpy).toHaveBeenCalledWith(thoughtWithId);
      });
      it('Should not update a thought', () => {
        expect(updateThoughtSpy).not.toHaveBeenCalled();
      });
    });

    describe('Thought updated', () => {
      const message: WebsocketResponse = {
        type: 'put',
        payload: createThought(13, 'Updated thought'),
      };

      beforeEach(() => {
        component.processThoughtChange(message);
      });
      it('Should update a thought', () => {
        expect(updateThoughtSpy).toHaveBeenCalledWith(message.payload);
      });
      it('Should not delete a thought', () => {
        expect(deleteThoughtSpy).not.toHaveBeenCalled();
      });
    });

    describe('Thought from a different column', () => {
      const message: WebsocketResponse = {
        type: 'put',
        payload: createThought(12, 'Thought from different column', 'confused'),
      };

      beforeEach(() => {
        component.processThoughtChange(message);
      });

      it('Should not update a thought', () => {
        expect(updateThoughtSpy).not.toHaveBeenCalled();
      });
      it('Should not delete a thought', () => {
        expect(deleteThoughtSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('deleting a thought', () => {
    const undiscussedThought = createThought(1, 'Undiscussed thought');
    const discussedThought = createThought(
      2,
      'Undiscussed thought',
      'happy',
      true
    );
    const undiscussedThoughtInOtherColumn = createThought(
      3,
      'Thought in other column',
      'confused'
    );
    const discussedThoughtInOtherColumn = createThought(
      4,
      'Thought in other column',
      'confused',
      true
    );

    let active;
    let completed;

    beforeEach(() => {
      active = [undiscussedThought];
      completed = [discussedThought];
      component.thoughtAggregation.items = {
        active,
        completed,
      };
    });

    it('properly deletes undiscussed thoughts', () => {
      component.deleteThought(undiscussedThought);
      expect(component.thoughtAggregation.items.active.length).toEqual(0);
      expect(component.thoughtAggregation.items.completed.length).toEqual(1);
    });

    it('properly deletes discussed thoughts', () => {
      component.deleteThought(discussedThought);
      expect(component.thoughtAggregation.items.active.length).toEqual(1);
      expect(component.thoughtAggregation.items.completed.length).toEqual(0);
    });

    it('ignores undiscussed thoughts from other columns', () => {
      component.deleteThought(undiscussedThoughtInOtherColumn);
      expect(component.thoughtAggregation.items.active.length).toEqual(1);
      expect(component.thoughtAggregation.items.completed.length).toEqual(1);
    });

    it('ignores discussed thoughts from other columns', () => {
      component.deleteThought(discussedThoughtInOtherColumn);
      expect(component.thoughtAggregation.items.active.length).toEqual(1);
      expect(component.thoughtAggregation.items.completed.length).toEqual(1);
    });
  });

  function createThought(
    id: number,
    message: string,
    thoughtTopic: string = 'happy',
    discussed: boolean = false
  ): Thought {
    return {
      id,
      message,
      hearts: 0,
      topic: thoughtTopic,
      discussed,
      teamId: 'test',
      columnTitle: {
        id: 1,
        topic: thoughtTopic,
        title: thoughtTopic,
        teamId: 'test',
      },
      boardId: null,
    } as Thought;
  }
});
