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
import 'cypress-jest-adapter';

import Topic from '../../src/types/Topic';

import TeamCredentials from './types/teamCredentials';

declare global {
	namespace Cypress {
		interface Chainable {
			login(teamCredentials: TeamCredentials): Chainable<Response<unknown>>;

			createTeam(teamCredentials: TeamCredentials): Chainable<void>;

			createTeamAndLogin(
				teamCredentials: TeamCredentials,
				visitOptions?: Partial<VisitOptions>
			): Chainable<void>;

			enterThought(topic: Topic, thought: string): Chainable<void>;

			enterActionItem(actionItemTask: string): Chainable<void>;

			getActionItemByTask(actionItemTask: string): Chainable<void>;

			confirmNumberOfThoughtsInColumn(
				topic: Topic,
				expectedCount: number
			): Chainable<void>;

			confirmNumberOfActionItemsInColumn(
				expectedCount: number
			): Chainable<void>;

			shouldBeOnRetroPage(teamId: string): Chainable<void>;
		}
	}
}
