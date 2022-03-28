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
	topic: ThoughtTopic;
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

export const ThoughtsByTopicState = atomFamily<Thought[], ThoughtTopic>({
	key: 'ThoughtsByTopicState',
	default: selectorFamily({
		key: 'ThoughtsByTopicState/Default',
		get:
			(topic: ThoughtTopic) =>
			({ get }) => {
				return get(ThoughtsState).filter((thought) => thought.topic === topic);
			},
	}),
});

export const ActiveThoughtsByTopicState = atomFamily<
	Thought[],
	ThoughtFilterParams
>({
	key: 'ActiveThoughtsByTopicState',
	default: selectorFamily({
		key: 'ActiveThoughtsByTopicState/Default',
		get:
			(params: ThoughtFilterParams) =>
			({ get }) => {
				const filteredThoughts = get(ThoughtsByTopicState(params.topic)).filter(
					(thought) => !thought.discussed
				);
				return params.sorted
					? filteredThoughts.sort((a, b) => b.hearts - a.hearts)
					: filteredThoughts;
			},
	}),
});

export const DiscussedThoughtsByTopicState = atomFamily<
	Thought[],
	ThoughtFilterParams
>({
	key: 'DiscussedThoughtsByTopicState',
	default: selectorFamily({
		key: 'DiscussedThoughtsState/Default',
		get:
			(params: ThoughtFilterParams) =>
			({ get }) => {
				const filteredThoughts = get(ThoughtsByTopicState(params.topic)).filter(
					(thought) => thought.discussed
				);
				return params.sorted
					? filteredThoughts.sort((a, b) => b.hearts - a.hearts)
					: filteredThoughts;
			},
	}),
});
