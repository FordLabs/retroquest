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

import Board from '../../../Types/Board';
import Topic from '../../../Types/Topic';

export const mockBoards: Board[] = [
	{
		id: 1,
		dateCreated: new Date(1982, 9, 1),
		teamId: 'teamId',
		thoughts: [
			{
				id: 100,
				message: 'I am a message',
				hearts: 0,
				discussed: false,
				topic: Topic.HAPPY,
			},
		],
		columns: [
			{
				id: 10,
				title: 'Happy',
				topic: Topic.HAPPY,
			},
		],
	},
	{
		id: 2,
		dateCreated: new Date(1998, 3, 22),
		teamId: 'teamId',
		thoughts: [],
		columns: [],
	},
];

const BoardService = {
	archiveRetro: jest.fn().mockResolvedValue(null),
	getBoards: jest.fn().mockResolvedValue(mockBoards),
};

export default BoardService;
