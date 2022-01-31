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

import { Observable } from 'rxjs';

import { Thought } from '../../../domain/thought';
import { WebsocketThoughtResponse } from '../../../domain/websocket-response';

import { ThoughtsColumnComponent } from './thoughts-column.component';

describe('ThoughtColumnComponent', () => {
  let component: ThoughtsColumnComponent;
  let mockThoughtService;

  const defaultTopic = 'happy';
  const defaultTeamId = 'teamId';
  const otherTopic = 'otherTopic';

  const undiscussedThought = createThought(1, 'Undiscussed thought');
  const discussedThought = createThought(2, 'discussed thought', defaultTopic, true);
  const undiscussedThoughtInOtherColumn = createThought(3, 'Thought in other column', otherTopic);
  const discussedThoughtInOtherColumn = createThought(4, 'Thought in other column', otherTopic, true);

  beforeEach(() => {
    mockThoughtService = {
      deleteThought: jest.fn().mockReturnValue(new Observable()),
      discussThought: jest.fn().mockReturnValue(new Observable()),
      heartThought: jest.fn().mockReturnValue(new Observable()),
      updateThought: jest.fn().mockReturnValue(new Observable()),
    };

    component = new ThoughtsColumnComponent(mockThoughtService);
    component.thoughtAggregation.topic = defaultTopic;
  });

  describe('process thought change', () => {
    let deleteThoughtSpy;
    let updateThoughtSpy;
    beforeEach(() => {
      deleteThoughtSpy = jest.spyOn(component, 'deleteThought');
      updateThoughtSpy = jest.spyOn(component, 'updateThought');
    });

    describe('Thought deleted', () => {
      const message: WebsocketThoughtResponse = {
        type: 'delete',
        payload: createThought(14, 'Thought to delete'),
      };

      beforeEach(() => {
        component.processThoughtChange(message);
      });
      it('Should delete a thought', () => {
        expect(deleteThoughtSpy).toHaveBeenCalledWith(message.payload);
      });
      it('Should not update a thought', () => {
        expect(updateThoughtSpy).not.toHaveBeenCalled();
      });
    });

    describe('Thought updated', () => {
      const message: WebsocketThoughtResponse = {
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

    describe('Thought from a different column updated', () => {
      const message: WebsocketThoughtResponse = {
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

    describe('Thought moved', () => {
      describe('thought moved away from column', () => {
        const movedThought = createThought(12, 'Moving thought to new column', 'otherTopic');
        movedThought.columnTitle.topic = defaultTopic;

        const message: WebsocketThoughtResponse = {
          type: 'put',
          payload: movedThought,
        };

        beforeEach(() => {
          component.processThoughtChange(message);
        });

        it('Should update (add) thought', () => {
          expect(updateThoughtSpy).not.toHaveBeenCalled();
        });
        it('Should delete a thought', () => {
          expect(deleteThoughtSpy).toHaveBeenCalledWith(movedThought);
        });
      });

      describe('thought moved to column', () => {
        const movedThought = createThought(12, 'Moving thought to this column');
        movedThought.columnTitle.topic = 'otherTopic';

        const message: WebsocketThoughtResponse = {
          type: 'put',
          payload: movedThought,
        };

        beforeEach(() => {
          component.processThoughtChange(message);
        });

        it('Should not update a thought', () => {
          expect(updateThoughtSpy).toHaveBeenCalledWith(movedThought);
        });
        it('Should delete a thought', () => {
          expect(deleteThoughtSpy).not.toHaveBeenCalled();
        });
      });

      describe('thought moved from a different column to yet another different column', () => {
        const movedThought = createThought(12, 'Moving thought to this column', 'alternateTopic1');
        movedThought.columnTitle.topic = 'alternateTopic2';

        const message: WebsocketThoughtResponse = {
          type: 'put',
          payload: movedThought,
        };

        beforeEach(() => {
          component.processThoughtChange(message);
        });

        it('Should not update a thought', () => {
          expect(updateThoughtSpy).not.toHaveBeenCalled();
        });
        it('Should delete a thought', () => {
          expect(deleteThoughtSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('deleting a thought', () => {
    beforeEach(() => {
      component.thoughtAggregation.items = [undiscussedThought, discussedThought];
    });

    it('properly deletes undiscussed thoughts', () => {
      component.deleteThought(undiscussedThought);
      expect(component.thoughtAggregation.items.length).toEqual(1);
      expect(component.thoughtAggregation.items[0]).toEqual(discussedThought);
    });

    it('properly deletes discussed thoughts', () => {
      component.deleteThought(discussedThought);
      expect(component.thoughtAggregation.items.length).toEqual(1);
      expect(component.thoughtAggregation.items).toEqual([undiscussedThought]);
    });

    it('ignores undiscussed thoughts from other columns', () => {
      component.deleteThought(undiscussedThoughtInOtherColumn);
      expect(component.thoughtAggregation.items.length).toEqual(2);
      expect(component.thoughtAggregation.items).toEqual([undiscussedThought, discussedThought]);
    });

    it('ignores discussed thoughts from other columns', () => {
      component.deleteThought(discussedThoughtInOtherColumn);
      expect(component.thoughtAggregation.items.length).toEqual(2);
      expect(component.thoughtAggregation.items).toEqual([undiscussedThought, discussedThought]);
    });
  });

  describe('updating a thought', () => {
    beforeEach(() => {
      component.thoughtAggregation.items = [undiscussedThought, discussedThought];
    });

    it('Properly adds a new thought and change thought state to active', () => {
      expect(component.thoughtAggregation.items.length).toBe(2);
      const newThought = createThought(99, 'New Thought');
      component.updateThought(newThought);

      expect(component.thoughtAggregation.items.length).toBe(3);
      expect(component.thoughtAggregation.items[2].state).toBe('active');
    });

    it('updating a discussed thought that already existed and change thought state to active', () => {
      const newMessage = 'I updated the text';
      const updatedThought = discussedThought;
      updatedThought.message = newMessage;

      component.updateThought(updatedThought);

      expect(component.completedThoughts.length).toBe(1);
      expect(component.completedThoughts[0].message).toBe(newMessage);
      expect(component.completedThoughts[0].state).toBe('active');
    });

    it('updating a NOT discussed thought that already existed and do NOT change thought state to active', () => {
      const newMessage = 'I updated the text';
      const updatedThought = undiscussedThought;
      updatedThought.message = newMessage;

      component.updateThought(updatedThought);

      expect(component.activeThoughts.length).toBe(1);
      expect(component.activeThoughts[0].message).toBe(newMessage);
      expect(component.activeThoughts[0].state).not.toBeDefined();
    });
  });

  function createThought(
    id: number,
    message: string,
    thoughtTopic: string = defaultTopic,
    discussed: boolean = false
  ): Thought {
    return {
      id,
      message,
      hearts: 0,
      topic: thoughtTopic,
      discussed,
      teamId: defaultTeamId,
      columnTitle: {
        id: 1,
        topic: thoughtTopic,
        title: thoughtTopic,
        teamId: defaultTeamId,
      },
      boardId: null,
    } as Thought;
  }
});
