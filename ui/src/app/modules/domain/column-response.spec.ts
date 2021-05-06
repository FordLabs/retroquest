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
