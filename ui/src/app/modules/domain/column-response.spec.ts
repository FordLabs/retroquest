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

import { emptyColumnResponse, findThought } from './column-response';
import { emptyThought } from './thought';

describe('the thoughtAggregation in the ThoughtColumnComponent', () => {
  it('can find a thought in the active items', () => {
    const subject = emptyColumnResponse();
    const randomThought = { ...emptyThought(), id: 42 };
    subject.items.active.push(randomThought);

    const result = findThought(subject, randomThought.id);

    expect(result).toBe(randomThought); // object equality
  });
  it('can find a thought in the completed items', () => {
    const subject = emptyColumnResponse();
    const randomThought = { ...emptyThought(), id: 42 };
    subject.items.completed.push(randomThought);

    const result = findThought(subject, randomThought.id);

    expect(result).toBe(randomThought); // object equality
  });
  it('does not find one that is not there', () => {
    const subject = emptyColumnResponse();
    const randomThought = { ...emptyThought(), id: 42 };
    subject.items.completed.push(randomThought);

    const result = findThought(subject, 976); // not the same id

    expect(result).toBeUndefined(); // object equality
  });
});
