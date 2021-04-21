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
import 'jest';
import { emptyThought, Thought } from '../../../domain/thought';
import { ItemSorter } from '../../../domain/column/item-sorter';
import { ColumnResponse, findThought } from '../../../domain/column-response';

describe('ThoughtColumnComponent', () => {
  let component: ThoughtsColumnComponent;
  let mockThoughtService;

  let testThought;

  beforeEach(() => {
    mockThoughtService = {
      deleteThought: jest.fn().mockReturnValue(new Observable()),
      discussThought: jest.fn().mockReturnValue(new Observable()),
      heartThought: jest.fn().mockReturnValue(new Observable()),
      updateThought: jest.fn().mockReturnValue(new Observable()),
    };

    component = new ThoughtsColumnComponent(mockThoughtService);
    component.thoughtAggregation.topic = 'topic-of-this-column';

    testThought = {
      id: 0,
      teamId: 'team-id',
      topic: null,
      message: null,
      hearts: 0,
      discussed: false,
      columnTitle: null,
    };
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

  describe('updating the thoughts inside the component', () => {
    function copyItems(
      thoughtAggregation: ColumnResponse
    ): ColumnResponse['items'] {
      return {
        active: thoughtAggregation.items.active.slice(),
        completed: thoughtAggregation.items.completed.slice(),
      };
    }
    function newEmptyComponent(): ThoughtsColumnComponent {
      const singleUseComponent = new ThoughtsColumnComponent(
        mockThoughtService
      );
      singleUseComponent.thoughtAggregation.topic = 'topic-of-this-column';
      return singleUseComponent;
    }
    it('does nothing when the thought is not in this column, and was not before', () => {
      const unrelatedThought: Thought = { ...emptyThought(), id: 42 };
      const subject = newEmptyComponent();
      const itemsBefore = copyItems(subject.thoughtAggregation);

      subject.respondToThought('put', unrelatedThought);

      expect(subject.thoughtAggregation.items).toEqual(itemsBefore);
    });

    it('does nothing when the thought has not changed', () => {
      const randomThought: Thought = {
        ...emptyThought(),
        id: 42,
        discussed: true,
        topic: 'topic-of-this-column',
        message: 'bananas',
      };
      const subject = newEmptyComponent();
      subject.thoughtAggregation.items.completed.push(randomThought);
      const itemsBefore = copyItems(subject.thoughtAggregation);
      subject.respondToThought('put', randomThought);

      expect(subject.thoughtAggregation.items).toEqual(itemsBefore);
    });
    describe('deleting a thought', () => {
      it('does nothing when the thought is not in this column, and was not before', () => {
        const unrelatedThought: Thought = { ...emptyThought(), id: 42 };
        const subject = newEmptyComponent();
        subject.thoughtAggregation.items.active.push({
          ...emptyThought(),
          id: 64,
        }); // put something in random in there
        const itemsBefore = copyItems(subject.thoughtAggregation);

        subject.respondToThought('delete', unrelatedThought);

        expect(subject.thoughtAggregation.items).toEqual(itemsBefore);
      });
      it('removes the thought from this column when it is no longer in this topic', () => {
        const randomThoughtInThisTopic = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
        };
        const subject = newEmptyComponent();
        subject.thoughtAggregation.items.active.push(randomThoughtInThisTopic);

        const randomThoughtThatMovedToAnotherTopic = {
          ...randomThoughtInThisTopic,
          topic: 'something-else',
        };

        subject.respondToThought('put', randomThoughtThatMovedToAnotherTopic);

        expect(
          findThought(
            subject.thoughtAggregation,
            randomThoughtThatMovedToAnotherTopic.id
          )
        ).toBeUndefined();
      });
      // note: there is some behavior in the deleteThought method for when thoughtId is -1. Not tested here.
      // also in the deleteThought method: a thought marked discussed and then deleted, will be missed if those messages arrive in the wrong order.
      it('removes an active thought that was deleted', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const subject = newEmptyComponent();
        subject.thoughtAggregation.items.active.push(randomThought); // now we have the thought

        subject.respondToThought('delete', randomThought);

        expect(
          findThought(subject.thoughtAggregation, randomThought.id)
        ).toBeUndefined();
      });
      it('removes a completed thought that was deleted', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          discussed: true,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const subject = newEmptyComponent();
        subject.thoughtAggregation.items.completed.push(randomThought); // now we have the thought

        subject.respondToThought('delete', randomThought);

        expect(
          findThought(subject.thoughtAggregation, randomThought.id)
        ).toBeUndefined();
      });
    });
    it('adds an active thought that was not here before', () => {
      const randomThought: Thought = {
        ...emptyThought(),
        id: 42,
        topic: 'topic-of-this-column',
        message: 'bananas',
      };
      const subject = newEmptyComponent();
      const itemsBefore = copyItems(subject.thoughtAggregation); // without the thought
      itemsBefore.active.push(randomThought); // we are going to have the thought

      subject.respondToThought('put', randomThought);

      expect(subject.thoughtAggregation.items).toEqual(itemsBefore); // now it should be gone
    });
    describe('updating thought discussedness', () => {
      it('moves a discussed thought from active to completed', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const randomThoughtAfterItWasDiscussed = {
          ...randomThought,
          discussed: true,
        };
        const subject = newEmptyComponent();
        const itemsBefore = copyItems(subject.thoughtAggregation); // without the thought
        itemsBefore.completed.push(randomThoughtAfterItWasDiscussed); // we are going to have the thought completed

        subject.thoughtAggregation.items.active.push(randomThought); // now we have the thought, undiscussed

        subject.respondToThought('put', randomThoughtAfterItWasDiscussed);

        expect(subject.thoughtAggregation.items).toEqual(itemsBefore); // now it should be moved
      });
      it('moves a not-discussed thought from completed to active', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const randomThoughtAfterItWasDiscussed = {
          ...randomThought,
          discussed: true,
        };
        const subject = newEmptyComponent();
        const itemsBefore = copyItems(subject.thoughtAggregation); // without the thought
        itemsBefore.active.push(randomThought); // we are going to have the thought undiscussed

        subject.thoughtAggregation.items.completed.push(
          randomThoughtAfterItWasDiscussed
        ); // now we have the thought, discussed

        subject.respondToThought('put', randomThought);

        expect(subject.thoughtAggregation.items).toEqual(itemsBefore); // now it should be moved
      });
    });
    describe('setting the thought state to active', () => {
      // I don't know why it sets it to active, but never to anything else.
      // 'active' has something to do with an animation, but I don't understand it.
      // Testing it here so that I don't unintentionally change it.
      it('sets a formerly-discussed thought state to active', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const randomThoughtAfterItWasDiscussed = {
          ...randomThought,
          discussed: true,
        };
        const subject = newEmptyComponent();
        const itemsBefore = copyItems(subject.thoughtAggregation); // without the thought
        itemsBefore.active.push(randomThought); // we are going to have the thought undiscussed

        subject.thoughtAggregation.items.completed.push(
          randomThoughtAfterItWasDiscussed
        ); // now we have the thought, discussed

        subject.respondToThought('put', randomThought);
        const myThought = findThought(
          subject.thoughtAggregation,
          randomThought.id
        );

        expect(myThought.state).toEqual('active');
      });
      it('sets a newly-discussed thought state to active', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const randomThoughtAfterItWasDiscussed = {
          ...randomThought,
          discussed: true,
        };
        const subject = newEmptyComponent();

        subject.thoughtAggregation.items.active.push(randomThought); // now we have the thought, undiscussed

        subject.respondToThought('put', randomThoughtAfterItWasDiscussed);
        const myThought = findThought(
          subject.thoughtAggregation,
          randomThought.id
        );

        expect(myThought.state).toEqual('active'); // now it should be moved
      });
      it('sets a new-to-this-topic thought state to active', () => {
        const randomThought: Thought = {
          ...emptyThought(),
          id: 42,
          topic: 'topic-of-this-column',
          message: 'bananas',
        };
        const subject = newEmptyComponent();

        subject.respondToThought('put', randomThought);
        const myThought = findThought(
          subject.thoughtAggregation,
          randomThought.id
        );

        expect(myThought.state).toEqual('active');
      });
    });
  });
});
