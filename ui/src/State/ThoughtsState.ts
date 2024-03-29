/*
 * Copyright (c) 2022 Ford Motor Company
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

import { atom, atomFamily, selectorFamily } from 'recoil';

import Thought from '../Types/Thought';
import Topic from '../Types/Topic';

export type ThoughtTopic = Topic.HAPPY | Topic.CONFUSED | Topic.UNHAPPY;
export type ThoughtFilterParams = {
	columnId: number;
	sorted: boolean;
};

export const ThoughtsState = atom<Thought[]>({
	key: 'ThoughtsState',
	default: [],
});

export const ThoughtByIdState = selectorFamily({
	key: 'ThoughtByIdState',
	get:
		(thoughtId: number) =>
		({ get }): Thought | null => {
			return (
				get(ThoughtsState).find((thought) => thought.id === thoughtId) || null
			);
		},
});

export const ThoughtsByColumnIdState = atomFamily<Thought[], number>({
	key: 'ThoughtsByTopicState',
	default: selectorFamily({
		key: 'ThoughtsByTopicState/Default',
		get:
			(columnId: number) =>
			({ get }) => {
				return get(ThoughtsState).filter(
					(thought) => thought.columnId === columnId
				);
			},
	}),
});

export const SortableThoughtsByTopicState = atomFamily<
	Thought[],
	ThoughtFilterParams
>({
	key: 'SortableThoughtsByTopicState',
	default: selectorFamily({
		key: 'SortableThoughtsByTopicState/Default',
		get:
			(params: ThoughtFilterParams) =>
			({ get }) => {
				let thoughts = get(ThoughtsByColumnIdState(params.columnId));
				if (params.sorted) {
					thoughts = [...thoughts].sort((a, b) => b.hearts - a.hearts);
				}
				return [...thoughts].sort((a, b) => {
					if (a.discussed === b.discussed) return 0;
					return a.discussed ? 1 : -1;
				});
			},
	}),
});

export const ActiveThoughtCountByColumnIdState = atomFamily<number, number>({
	key: 'ActiveThoughtCountByTopicState',
	default: selectorFamily({
		key: 'ActiveThoughtCountByTopicState/Default',
		get:
			(columnId: number) =>
			({ get }) => {
				return get(ThoughtsByColumnIdState(columnId)).filter(
					(thought) => !thought.discussed
				).length;
			},
	}),
});
