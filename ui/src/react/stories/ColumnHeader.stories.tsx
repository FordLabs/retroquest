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
import { ComponentMeta, ComponentStory } from '@storybook/react';

import ColumnHeader from '../components/column-header/ColumnHeader';
import RetroItemType from '../types/RetroItemType';

export default {
  title: 'components/ColumnHeader',
  component: ColumnHeader,
} as ComponentMeta<typeof ColumnHeader>;

const props = {
  initialTitle: 'Change This',
  sortedChanged(changed: boolean) {
    alert(`Sorting: ${changed}`);
  },
  titleChanged(title: string) {
    alert(`New Title: ${title}`);
  },
};

const Template: ComponentStory<typeof ColumnHeader> = () => (
  <span
    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexBasis: 800, flexShrink: 1 }}
  >
    <ColumnHeader {...props} type={RetroItemType.HAPPY} style={{ marginBottom: '5rem' }} />
    <ColumnHeader {...props} type={RetroItemType.CONFUSED} style={{ marginBottom: '5rem' }} />
    <ColumnHeader {...props} type={RetroItemType.UNHAPPY} style={{ marginBottom: '5rem' }} />
    <ColumnHeader {...props} readOnly={true} type={RetroItemType.ACTION} />
  </span>
);

export const Example = Template.bind({});
