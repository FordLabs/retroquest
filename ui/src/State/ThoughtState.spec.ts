/*
 * Copyright (c) 2022. Ford Motor Company
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

import { snapshot_UNSTABLE } from 'recoil';

import Thought from '../Types/Thought';
import Topic from '../Types/Topic';

import {
	ActiveThoughtCountByTopicState,
	SortableThoughtsByTopicState,
	ThoughtByIdState,
	ThoughtsByTopicState,
	ThoughtsState,
} from './ThoughtsState';

describe('Thought State', () => {
	const happyThought1 = {
		id: 1,
		hearts: 1,
		topic: Topic.HAPPY,
		discussed: true,
	};
	const happyThought2 = {
		id: 2,
		hearts: 2,
		topic: Topic.HAPPY,
		discussed: false,
	};
	const happyThought3 = {
		id: 3,
		hearts: 3,
		topic: Topic.HAPPY,
		discussed: false,
	};
	const happyThought4 = {
		id: 4,
		hearts: 4,
		topic: Topic.HAPPY,
		discussed: true,
	};
	const confusedThought1 = {
		id: 5,
		hearts: 5,
		topic: Topic.CONFUSED,
		discussed: true,
	};
	const sadThought1 = {
		id: 6,
		hearts: 6,
		topic: Topic.UNHAPPY,
		discussed: true,
	};
	const thoughts = [
		happyThought1,
		happyThought2,
		happyThought3,
		happyThought4,
		confusedThought1,
		sadThought1,
	] as Thought[];

	const initialSnapshot = snapshot_UNSTABLE(({ set }) =>
		set(ThoughtsState, thoughts)
	);

	describe('ThoughtByIdState', () => {
		it('should return a thought with the same ID', () => {
			const actual = initialSnapshot
				.getLoadable(ThoughtByIdState(2))
				.valueOrThrow();
			expect(actual).toEqual(happyThought2);
		});

		it('should return null if no thought matching ID', () => {
			const actual = initialSnapshot
				.getLoadable(ThoughtByIdState(-1))
				.valueOrThrow();
			expect(actual).toBeNull();
		});
	});

	describe('ThoughtsByTopicState', () => {
		it('should return thoughts with the same topic', () => {
			const actual = initialSnapshot
				.getLoadable(ThoughtsByTopicState(Topic.HAPPY))
				.valueOrThrow();
			expect(actual).toEqual([
				happyThought1,
				happyThought2,
				happyThought3,
				happyThought4,
			]);
		});
	});

	describe('SortableThoughtsByTopicState', () => {
		it('should return thoughts grouped by discussed', () => {
			const actual = initialSnapshot
				.getLoadable(
					SortableThoughtsByTopicState({ topic: Topic.HAPPY, sorted: false })
				)
				.valueOrThrow();
			expect(actual).toEqual([
				happyThought2,
				happyThought3,
				happyThought1,
				happyThought4,
			]);
		});

		it('should return thoughts sorted by like and then group them by discussed', () => {
			const actual = initialSnapshot
				.getLoadable(
					SortableThoughtsByTopicState({ topic: Topic.HAPPY, sorted: true })
				)
				.valueOrThrow();
			expect(actual).toEqual([
				happyThought3,
				happyThought2,
				happyThought4,
				happyThought1,
			]);
		});
	});

	describe('ActiveThoughtCountByTopicState', () => {
		it('should return number of non discussed thoughts per column', () => {
			const actual = initialSnapshot
				.getLoadable(ActiveThoughtCountByTopicState(Topic.HAPPY))
				.valueOrThrow();
			expect(actual).toEqual(2);
		});
	});
});
