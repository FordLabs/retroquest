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

import Thought from '../../../Types/Thought';
import Topic, { ThoughtTopic } from '../../../Types/Topic';

export const getMockThought = (
	topic: ThoughtTopic,
	isDiscussed = false,
	hearts = 0
): Thought => ({
	id: Math.random(),
	message: `This is a ${topic} thought`,
	topic,
	hearts,
	discussed: isDiscussed,
});

const ThoughtService = {
	getThoughts: jest
		.fn()
		.mockResolvedValue([
			getMockThought(Topic.HAPPY, false),
			getMockThought(Topic.HAPPY, true),
			getMockThought(Topic.CONFUSED, false),
			getMockThought(Topic.CONFUSED, true),
			getMockThought(Topic.UNHAPPY, false),
			getMockThought(Topic.UNHAPPY, true),
		]),
	create: jest.fn().mockResolvedValue((thought: Thought) => thought),
	delete: jest.fn().mockResolvedValue(null),
	updateMessage: jest.fn().mockResolvedValue(null),
	upvoteThought: jest.fn().mockResolvedValue(null),
	updateDiscussionStatus: jest.fn().mockResolvedValue(null),
};

export default ThoughtService;
