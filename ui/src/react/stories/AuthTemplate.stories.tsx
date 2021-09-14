/*
 * Copyright (c) 2021 Ford Motor Company
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

import * as React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Link, MemoryRouter } from 'react-router-dom';

import AuthTemplate from '../templates/auth/AuthTemplate';
import { PrimaryButton } from '../components/button/Button';

export default {
  title: 'templates/AuthTemplate',
  component: AuthTemplate,
} as ComponentMeta<typeof AuthTemplate>;

const Template: ComponentStory<typeof AuthTemplate> = () => {
  return (
    <MemoryRouter initialEntries={['/team/team-id/']}>
      <AuthTemplate header="Sign in to your Team!" subHeader={<Link to="/create">or create a new Team</Link>}>
        <PrimaryButton>Sign in</PrimaryButton>
      </AuthTemplate>
    </MemoryRouter>
  );
};

export const Example = Template.bind({});
