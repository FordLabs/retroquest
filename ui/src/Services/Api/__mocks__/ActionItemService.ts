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

import Action from '../../../Types/Action';

export const getMockActionItem = (
	isCompleted = false,
	archived: boolean = false
): Action => ({
	id: Math.random(),
	task: 'This is an action we can take',
	completed: isCompleted,
	assignee: 'Bob',
	dateCreated: '2022-01-20',
	archived,
});

const ActionItemService = {
	get: jest.fn().mockResolvedValue([]),
	create: jest.fn().mockResolvedValue((action: Action) => action),
	deleteOne: jest.fn().mockResolvedValue(null),
	deleteMultiple: jest.fn().mockResolvedValue(null),
	updateTask: jest.fn().mockResolvedValue(null),
	updateAssignee: jest.fn().mockResolvedValue(null),
	updateCompletionStatus: jest.fn().mockResolvedValue(null),
	parseAssignees: jest.fn().mockReturnValue(''),
	removeAssigneesFromTask: jest.fn().mockReturnValue(null),
};

export default ActionItemService;
