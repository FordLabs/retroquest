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

export const getMockThought = (
	columnId: number,
	isDiscussed = false,
	hearts = 0
): Thought => ({
	id: Math.random(),
	message: `This is a ${columnId} thought`,
	hearts,
	discussed: isDiscussed,
	columnId,
});

const ThoughtService = {
	getThoughts: jest
		.fn()
		.mockResolvedValue([
			getMockThought(1, false),
			getMockThought(1, true),
			getMockThought(2, false),
			getMockThought(2, true),
			getMockThought(3, false),
			getMockThought(3, true),
		]),
	create: jest.fn().mockResolvedValue((thought: Thought) => thought),
	delete: jest.fn().mockResolvedValue(null),
	updateMessage: jest.fn().mockResolvedValue(null),
	upvoteThought: jest.fn().mockResolvedValue(null),
	updateDiscussionStatus: jest.fn().mockResolvedValue(null),
	updateColumn: jest.fn().mockResolvedValue(null),
};

export default ThoughtService;
