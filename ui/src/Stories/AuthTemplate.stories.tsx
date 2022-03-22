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

import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import AuthTemplate from '../Common/AuthTemplate/AuthTemplate';

export default {
	title: 'templates/AuthTemplate',
	component: AuthTemplate,
} as ComponentMeta<typeof AuthTemplate>;

const Template: ComponentStory<typeof AuthTemplate> = () => {
	return (
		<MemoryRouter initialEntries={['/team/team-id/']}>
			<AuthTemplate
				header="Sign in to your Team!"
				subHeader={<Link to="/create">or create a new Team</Link>}
			>
				<button className="button-primary">Sign in</button>
			</AuthTemplate>
		</MemoryRouter>
	);
};

export const Example = Template.bind({});
